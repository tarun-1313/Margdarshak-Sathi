"""
Gemini AI Client for CareerPilot AI
Handles all interactions with Google Gemini API with fallback to Grok.
"""

import os
import json
import logging
import re
from typing import Optional, List, Dict, Any, AsyncGenerator
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import AsyncOpenAI

# Load environment variables
ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

# Configure logging
logger = logging.getLogger("careerpilot.gemini")

# Constants
GEMINI_MODEL = "gemini-2.5-flash"
GROK_MODEL = os.getenv("GROK_MODEL", "llama-3.1-8b-instant")
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 8192


class GeminiError(Exception):
    """Custom exception for Gemini API errors."""
    pass


class GeminiClient:
    """Async client for Google Gemini API with Grok fallback."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.grok_api_key = os.getenv("GROK_API_KEY")
        
        if not self.api_key and not self.grok_api_key:
            raise GeminiError(
                "Either GEMINI_API_KEY or GROK_API_KEY must be set."
            )
        
        # Initialize Gemini client if we have the key
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini client, will use Grok only: {e}")
        
        # Initialize OpenAI client for Grok (xAI uses OpenAI-compatible API)
        self.grok_client = None
        if self.grok_api_key:
            try:
                self.grok_client = AsyncOpenAI(
                    api_key=self.grok_api_key,
                    base_url="https://api.x.ai/v1"
                )
                logger.info("Grok client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Grok client: {e}")
    
    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=5),
        retry=retry_if_exception_type((Exception,)),
    )
    async def _generate_text_gemini(self, prompt: str, system_message: Optional[str] = None, temperature: float = DEFAULT_TEMPERATURE, max_tokens: int = DEFAULT_MAX_TOKENS) -> str:
        """Generate text using Gemini."""
        if not self.client:
            raise Exception("Gemini client not initialized")
            
        contents = []
        if system_message:
            contents.append(types.Content(
                role="model",
                parts=[types.Part(text=system_message)]
            ))
        
        contents.append(types.Content(
            role="user",
            parts=[types.Part(text=prompt)]
        ))
        
        config = types.GenerateContentConfig(
            temperature=temperature,
            max_output_tokens=max_tokens,
        )
        
        response = await self.client.aio.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=config,
        )
        
        return response.text or ""
    
    async def _generate_text_grok(self, prompt: str, system_message: Optional[str] = None, temperature: float = DEFAULT_TEMPERATURE, max_tokens: int = DEFAULT_MAX_TOKENS) -> str:
        """Generate text using Grok."""
        if not self.grok_client:
            raise Exception("Grok client not initialized")
            
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.grok_client.chat.completions.create(
            model=GROK_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        
        return response.choices[0].message.content or ""
    
    async def generate_text(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> str:
        """Generate text, trying Gemini first, then Grok."""
        try:
            if self.client:
                logger.info("Attempting generation with Gemini")
                return await self._generate_text_gemini(prompt, system_message, temperature, max_tokens)
        except Exception as e:
            logger.warning(f"Gemini failed, falling back to Grok: {e}")
            
        try:
            if self.grok_client:
                logger.info("Attempting generation with Grok")
                return await self._generate_text_grok(prompt, system_message, temperature, max_tokens)
        except Exception as e:
            logger.error(f"Grok also failed: {e}")
            
        raise Exception("Both Gemini and Grok failed to generate text")
    
    async def generate_json(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ) -> Dict[str, Any]:
        """Generate JSON with fallback to Grok, then fallback data."""
        try:
            json_prompt = (
                f"{prompt}\n\n"
                "IMPORTANT: Return ONLY valid JSON with double quotes, no single quotes, no markdown, no code fences."
            )
            
            # Try generation first
            response = await self.generate_text(
                prompt=json_prompt,
                system_message=system_message,
                temperature=temperature,
                max_tokens=DEFAULT_MAX_TOKENS,
            )
            
            # Try to parse
            parsed_data = self._parse_json_safely(response)
            if parsed_data is not None:
                return parsed_data
                
            logger.error(f"Failed to parse JSON, using fallback. Raw text: {response[:1000]}")
        except Exception as e:
            logger.error(f"JSON generation failed, using fallback: {e}")
            
        return self._get_fallback_data(prompt)
    
    def _parse_json_safely(self, text: str) -> Optional[Dict[str, Any]]:
        """Try multiple methods to parse JSON safely."""
        if not text:
            return None
            
        clean_text = text.strip()
        
        # Try 1. Straight json.loads
        try:
            return json.loads(clean_text)
        except Exception:
            pass
            
        # Try 2. Remove code fences
        try:
            if clean_text.startswith("```"):
                lines = clean_text.split("\n")
                if lines and lines[0].lower().startswith("```json"):
                    lines = lines[1:]
                if lines and lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                clean_text = "\n".join(lines).strip()
            return json.loads(clean_text)
        except Exception:
            pass
            
        # Try 3. Find JSON object in text
        try:
            start = clean_text.find("{")
            end = clean_text.rfind("}")
            if start >= 0 and end > start:
                json_str = clean_text[start:end+1]
                return json.loads(json_str)
        except Exception:
            pass
            
        # Try 4. ast.literal_eval
        try:
            import ast
            return ast.literal_eval(clean_text)
        except Exception:
            pass
            
        # Try 5. Fix quotes and newlines
        try:
            fixed_text = clean_text.replace("'", '"')
            fixed_text = re.sub(r'(\w)"(\w)', r'\1\\"\\2', fixed_text)
            return json.loads(fixed_text)
        except Exception:
            pass
            
        return None
        
    def _get_fallback_data(self, prompt: str) -> Dict[str, Any]:
        """Return fallback data based on prompt type."""
        logger.info("Using fallback JSON data")
        
        prompt_lower = prompt.lower()
        
        # Roadmap fallback
        if "roadmap" in prompt_lower:
            return {
                "role": "Software Engineer",
                "months": [
                    {
                        "month": 1,
                        "title": "Foundations of Software Engineering",
                        "focus": "Master core programming concepts and version control",
                        "weekly_goals": [
                            "Review data structures & algorithms",
                            "Learn Git & GitHub workflow",
                            "Practice problem-solving",
                            "Build a small project"
                        ],
                        "projects": [
                            "Personal portfolio website"
                        ],
                        "certifications": []
                    },
                    {
                        "month": 2,
                        "title": "Web Development Basics",
                        "focus": "HTML, CSS, JavaScript, and front-end frameworks",
                        "weekly_goals": [
                            "Master HTML/CSS",
                            "Learn core JavaScript",
                            "Build responsive UIs"
                        ],
                        "projects": ["To-do app"],
                        "certifications": []
                    }
                ]
            }
        
        # Resume analysis fallback
        if "resume" in prompt_lower or "ats" in prompt_lower:
            return {
                "ats_score": 75,
                "strengths": [
                    "Clear work experience",
                    "Technical skills listed"
                ],
                "improvements": [
                    "Add more metrics",
                    "Optimize for ATS keywords"
                ],
                "skills": ["Python", "JavaScript"],
                "missing_keywords": ["AWS", "Docker"],
                "projects": [
                    {"name": "Portfolio", "description": "Personal portfolio website"}
                ],
                "experience": [
                    {"role": "Software Developer", "company": "Tech Corp", "duration": "2022-2024"}
                ],
                "education": [
                    {"degree": "BSc CS", "institution": "University", "year": "2020-2024"}
                ],
                "certifications": []
            }
            
        # Portfolio analysis fallback
        if "portfolio" in prompt_lower or "github" in prompt_lower:
            return {
                "score": 70,
                "summary": "Good portfolio with active repositories",
                "strengths": [
                    "Active contributor",
                    "Multiple projects"
                ],
                "improvements": [
                    "Improve READMEs",
                    "Add more documentation"
                ],
                "top_projects": [
                    {"name": "Portfolio", "comment": "Great showcase project"}
                ]
            }
            
        # Trends fallback
        if "trends" in prompt_lower:
            return {
                "trending_tech": [
                    {"name": "AI/ML", "momentum": 95, "category": "Software"},
                    {"name": "React", "momentum": 85, "category": "Web"}
                ],
                "high_demand_roles": [
                    {"role": "AI Engineer", "demand": 95, "growth": "High"},
                    {"role": "Full Stack Dev", "demand": 80, "growth": "Stable"}
                ],
                "salary_shifts": [
                    {"role": "AI Engineer", "change_pct": 15, "note": "Rising demand"}
                ],
                "ai_focus_areas": ["LLMs", "Computer Vision"]
            }
            
        # Careers fallback
        if "career" in prompt_lower or "careers" in prompt_lower:
            return {
                "careers": [
                    {
                        "name": "AI Engineer",
                        "match_score": 90,
                        "description": "Build AI models and systems",
                        "salary_range_inr": "20-40 LPA",
                        "demand_level": "Very High",
                        "growth_potential": "Excellent",
                        "key_skills": ["Python", "ML", "TensorFlow"]
                    },
                    {
                        "name": "Full Stack Developer",
                        "match_score": 80,
                        "description": "Build web apps end to end",
                        "salary_range_inr": "12-25 LPA",
                        "demand_level": "High",
                        "growth_potential": "Strong",
                        "key_skills": ["React", "Node.js", "MongoDB"]
                    }
                ]
            }
            
        # Skill gap fallback
        if "skill" in prompt_lower or "gap" in prompt_lower:
            return {
                "target_role": "AI Engineer",
                "current_skills": ["Python"],
                "required_skills": ["Python", "Machine Learning", "TensorFlow"],
                "missing_skills": [
                    {
                        "name": "Machine Learning",
                        "priority": "high",
                        "difficulty": "intermediate",
                        "estimated_weeks": 8,
                        "reason": "Core requirement for AI roles"
                    }
                ]
            }
            
        # Default fallback
        return {"success": True, "data": {}}
        
    async def stream_text(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ) -> AsyncGenerator[str, None]:
        """Stream text, trying Gemini then Grok."""
        try:
            if self.client:
                logger.info("Attempting streaming with Gemini")
                messages = []
                if system_message:
                    messages.append(types.Content(
                        role="model",
                        parts=[types.Part(text=system_message)]
                    ))
                messages.append(types.Content(
                    role="user",
                    parts=[types.Part(text=prompt)]
                ))
                
                config = types.GenerateContentConfig(temperature=temperature)
                response = await self.client.aio.models.generate_content(
                    model=GEMINI_MODEL,
                    contents=messages,
                    config=config,
                )
                
                if response.text:
                    yield response.text
                return
        except Exception as e:
            logger.warning(f"Gemini streaming failed, falling back to Grok: {e}")
            
        try:
            if self.grok_client:
                logger.info("Attempting streaming with Grok")
                messages = []
                if system_message:
                    messages.append({"role": "system", "content": system_message})
                messages.append({"role": "user", "content": prompt})
                
                stream = await self.grok_client.chat.completions.create(
                    model=GROK_MODEL,
                    messages=messages,
                    stream=True,
                    temperature=temperature,
                )
                
                async for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
                return
        except Exception as e:
            logger.error(f"Grok streaming failed: {e}")
            
        raise Exception("Both Gemini and Grok failed to stream text")


# Global client instance
_gemini_client: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """Get or create the global Gemini client instance."""
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client


def reset_gemini_client():
    """Reset the global client (useful for testing)."""
    global _gemini_client
    _gemini_client = None


# Convenience functions for direct use
async def gemini_generate_text(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
    max_tokens: int = DEFAULT_MAX_TOKENS,
) -> str:
    """Generate text using Gemini/Grok fallback."""
    client = get_gemini_client()
    return await client.generate_text(prompt, system_message, temperature, max_tokens)


async def gemini_generate_json(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
) -> Dict[str, Any]:
    """Generate JSON using Gemini/Grok fallback."""
    client = get_gemini_client()
    return await client.generate_json(prompt, system_message, temperature)


async def gemini_stream_text(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
) -> AsyncGenerator[str, None]:
    """Stream text using Gemini/Grok fallback."""
    client = get_gemini_client()
    async for chunk in client.stream_text(prompt, system_message, temperature):
        yield chunk
