"""
Resume Generator API Routes
Handles resume generation, ATS analysis, and template management
"""
import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel, Field, validator

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import resume service
from resume_service import generate_premium_resume

# Setup logging
logger = logging.getLogger(__name__)

# Router
router = APIRouter()


# Pydantic Models
class PersonalInfo(BaseModel):
    name: str
    title: str
    email: str
    phone: str
    location: str
    linkedin: str = ""
    github: str = ""
    website: str = ""
    summary: str = ""


class SkillItem(BaseModel):
    name: str
    level: int = Field(ge=0, le=100)


class Experience(BaseModel):
    role: str
    company: str
    location: str
    duration: str
    achievements: list[str] = []
    technologies: list[str] = []


class Education(BaseModel):
    degree: str
    school: str
    year: str
    gpa: str = ""


class Project(BaseModel):
    name: str
    description: str
    technologies: list[str] = []
    github: str = ""
    demo: str = ""


class Certification(BaseModel):
    name: str
    issuer: str
    year: str


class ResumeRequest(BaseModel):
    personal: PersonalInfo
    skills: dict[str, list[SkillItem]] = {}
    experience: list[Experience] = []
    education: list[Education] = []
    projects: list[Project] = []
    certifications: list[Certification] = []
    template: str = "modern_ai"
    
    @validator('template')
    def validate_template(cls, v):
        allowed = ['modern_ai', 'faang', 'startup', 'research']
        if v not in allowed:
            raise ValueError(f'Template must be one of: {allowed}')
        return v


class ATSAnalysisRequest(BaseModel):
    personal: Optional[PersonalInfo] = None
    skills: Optional[dict] = None
    experience: Optional[list] = None
    education: Optional[list] = None
    projects: Optional[list] = None


# API Endpoints

@router.post("/generate")
async def generate_resume(
    request: ResumeRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate a premium ATS-optimized resume
    
    Returns a DOCX file with professional formatting
    """
    try:
        logger.info(f"Generating resume for {request.personal.name}")
        
        # Convert to dict for resume service
        data = request.dict()
        
        # Generate resume
        resume_bytes = generate_premium_resume(data, template=request.template)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{request.personal.name.replace(' ', '_')}_Resume_{timestamp}.docx"
        
        # Return as streaming response
        return StreamingResponse(
            iter([resume_bytes]),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "X-Filename": filename
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating resume: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate resume: {str(e)}"
        )


@router.get("/templates")
async def get_templates():
    """Get available resume templates"""
    return {
        "templates": [
            {
                "id": "modern_ai",
                "name": "Modern AI Engineer",
                "description": "Clean, futuristic design optimized for AI/ML roles",
                "ats_score": 98,
                "colors": ["#8B5CF6", "#3B82F6", "#A3FF12"]
            },
            {
                "id": "faang",
                "name": "FAANG Style",
                "description": "Professional layout inspired by top tech companies",
                "ats_score": 97,
                "colors": ["#2563EB", "#1D4ED8", "#10B981"]
            },
            {
                "id": "startup",
                "name": "Startup Founder",
                "description": "Bold design highlighting entrepreneurial experience",
                "ats_score": 95,
                "colors": ["#F59E0B", "#EF4444", "#10B981"]
            },
            {
                "id": "research",
                "name": "Research Engineer",
                "description": "Academic-style layout for research-focused roles",
                "ats_score": 96,
                "colors": ["#6366F1", "#8B5CF6", "#EC4899"]
            }
        ]
    }


@router.post("/ats-analyze")
async def analyze_ats_score(resume_data: ATSAnalysisRequest):
    """
    Analyze ATS score for a resume
    
    Returns ATS optimization suggestions
    """
    try:
        checks = [
            {
                "name": "Contact Info",
                "weight": 10,
                "passed": bool(resume_data.personal and resume_data.personal.email and resume_data.personal.phone)
            },
            {
                "name": "Professional Summary",
                "weight": 15,
                "passed": bool(resume_data.personal and resume_data.personal.summary)
            },
            {
                "name": "Work Experience",
                "weight": 25,
                "passed": resume_data.experience and len(resume_data.experience) > 0
            },
            {
                "name": "Education",
                "weight": 15,
                "passed": resume_data.education and len(resume_data.education) > 0
            },
            {
                "name": "Skills Section",
                "weight": 15,
                "passed": resume_data.skills and len(resume_data.skills) > 0
            },
            {
                "name": "Projects",
                "weight": 5,
                "passed": resume_data.projects and len(resume_data.projects) > 0
            },
        ]

        score = sum(check['weight'] for check in checks if check['passed'])
        suggestions = [f"Add {check['name']}" for check in checks if not check['passed']]

        return {
            "score": score,
            "checks": checks,
            "suggestions": suggestions,
            "rating": "excellent" if score >= 95 else "good" if score >= 85 else "fair" if score >= 70 else "poor"
        }

    except Exception as e:
        logger.error(f"Error analyzing ATS score: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze ATS score: {str(e)}"
        )
