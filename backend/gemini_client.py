
"""
Gemini AI Client for Margdarshak Sathi AI
Production Ready Version
"""

import os
import json
import logging
import re
import asyncio

from pathlib import Path
from typing import Optional, Dict, Any, AsyncGenerator

from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

import google.generativeai as genai
from openai import AsyncOpenAI


# =========================================================
# ENVIRONMENT
# =========================================================

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

logger = logging.getLogger("margdarshak.gemini")


# =========================================================
# CONFIG
# =========================================================

GEMINI_MODEL = "gemini-1.5-flash"

GROK_MODEL = os.getenv(
    "GROK_MODEL",
    "grok-beta"
)

DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 8192


# =========================================================
# EXCEPTION
# =========================================================

class GeminiError(Exception):
    pass


# =========================================================
# CLIENT
# =========================================================

class GeminiClient:

    def __init__(self):

        self.api_key = os.getenv("GEMINI_API_KEY")
        self.grok_api_key = os.getenv("GROK_API_KEY")

        if not self.api_key and not self.grok_api_key:
            raise GeminiError(
                "GEMINI_API_KEY or GROK_API_KEY required"
            )

        # =====================================================
        # GEMINI
        # =====================================================

        self.client = None

        if self.api_key:
            try:

                genai.configure(
                    api_key=self.api_key
                )

                self.client = genai.GenerativeModel(
                    GEMINI_MODEL
                )

                logger.info(
                    "Gemini initialized successfully"
                )

            except Exception as e:
                logger.error(
                    f"Gemini init failed: {e}"
                )

        # =====================================================
        # GROK
        # =====================================================

        self.grok_client = None

        if self.grok_api_key:
            try:

                self.grok_client = AsyncOpenAI(
                    api_key=self.grok_api_key,
                    base_url="https://api.x.ai/v1"
                )

                logger.info(
                    "Grok initialized successfully"
                )

            except Exception as e:
                logger.error(
                    f"Grok init failed: {e}"
                )

    # =========================================================
    # GEMINI TEXT
    # =========================================================

    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=2, max=5),
    )
    async def _generate_text_gemini(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> str:

        if not self.client:
            raise Exception(
                "Gemini client not initialized"
            )

        full_prompt = prompt

        if system_message:
            full_prompt = (
                f"{system_message}\n\n{prompt}"
            )

        loop = asyncio.get_event_loop()

        response = await loop.run_in_executor(
            None,
            lambda: self.client.generate_content(
                full_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
            )
        )

        return response.text or ""

    # =========================================================
    # GROK TEXT
    # =========================================================

    async def _generate_text_grok(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> str:

        if not self.grok_client:
            raise Exception(
                "Grok client not initialized"
            )

        messages = []

        if system_message:
            messages.append({
                "role": "system",
                "content": system_message
            })

        messages.append({
            "role": "user",
            "content": prompt
        })

        response = await self.grok_client.chat.completions.create(
            model=GROK_MODEL,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return (
            response.choices[0]
            .message
            .content
        ) or ""

    # =========================================================
    # MAIN GENERATION
    # =========================================================

    async def generate_text(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
    ) -> str:

        # =====================================================
        # TRY GEMINI
        # =====================================================

        try:

            if self.client:

                logger.info(
                    "Using Gemini"
                )

                return await self._generate_text_gemini(
                    prompt,
                    system_message,
                    temperature,
                    max_tokens,
                )

        except Exception as e:

            logger.warning(
                f"Gemini failed: {e}"
            )

        # =====================================================
        # FALLBACK GROK
        # =====================================================

        try:

            if self.grok_client:

                logger.info(
                    "Using Grok fallback"
                )

                return await self._generate_text_grok(
                    prompt,
                    system_message,
                    temperature,
                    max_tokens,
                )

        except Exception as e:

            logger.error(
                f"Grok failed: {e}"
            )

        raise Exception(
            "Both Gemini and Grok failed"
        )

    # =========================================================
    # JSON GENERATION
    # =========================================================

    async def generate_json(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ) -> Dict[str, Any]:

        json_prompt = f"""
{prompt}

IMPORTANT:
Return ONLY valid JSON.
No markdown.
No code fences.
No explanation.
"""

        try:

            response = await self.generate_text(
                prompt=json_prompt,
                system_message=system_message,
                temperature=temperature,
            )

            parsed = self._parse_json(response)

            if parsed:
                return parsed

        except Exception as e:

            logger.error(
                f"JSON generation failed: {e}"
            )

        return {
            "success": False,
            "message": "JSON parsing failed"
        }

    # =========================================================
    # SAFE JSON PARSER
    # =========================================================

    def _parse_json(
        self,
        text: str
    ) -> Optional[Dict[str, Any]]:

        if not text:
            return None

        clean = text.strip()

        try:
            return json.loads(clean)
        except Exception:
            pass

        try:

            clean = re.sub(
                r"```json|```",
                "",
                clean
            ).strip()

            return json.loads(clean)

        except Exception:
            pass

        try:

            start = clean.find("{")
            end = clean.rfind("}")

            if start >= 0 and end > start:

                return json.loads(
                    clean[start:end + 1]
                )

        except Exception:
            pass

        return None

    # =========================================================
    # STREAMING
    # =========================================================

    async def stream_text(
        self,
        prompt: str,
        system_message: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ) -> AsyncGenerator[str, None]:

        if not self.client:
            raise Exception(
                "Gemini not initialized"
            )

        full_prompt = prompt

        if system_message:
            full_prompt = (
                f"{system_message}\n\n{prompt}"
            )

        response = self.client.generate_content(
            full_prompt,
            stream=True,
            generation_config={
                "temperature": temperature
            }
        )

        for chunk in response:

            if chunk.text:
                yield chunk.text


# =========================================================
# GLOBAL CLIENT
# =========================================================

_gemini_client = None


def get_gemini_client():

    global _gemini_client

    if _gemini_client is None:
        _gemini_client = GeminiClient()

    return _gemini_client


# =========================================================
# CONVENIENCE FUNCTIONS
# =========================================================

async def gemini_generate_text(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
    max_tokens: int = DEFAULT_MAX_TOKENS,
):

    client = get_gemini_client()

    return await client.generate_text(
        prompt,
        system_message,
        temperature,
        max_tokens,
    )


async def gemini_generate_json(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
):

    client = get_gemini_client()

    return await client.generate_json(
        prompt,
        system_message,
        temperature,
    )


async def gemini_stream_text(
    prompt: str,
    system_message: Optional[str] = None,
    temperature: float = DEFAULT_TEMPERATURE,
):

    client = get_gemini_client()

    async for chunk in client.stream_text(
        prompt,
        system_message,
        temperature,
    ):
        yield chunk

