"""
Premium Resume Generator API
Handles resume generation with proper data validation and error handling
"""
import os
import sys
import json
import traceback
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel, Field, validator
import logging

# Import resume generator
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from resume_service import generate_premium_resume, ResumeData, PersonalInfo

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Router
router = APIRouter(prefix="/resume", tags=["resume"])


# Pydantic Models for Request Validation
class PersonalInfoModel(BaseModel):
    """Personal information model"""
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    title: str = Field(..., min_length=1, max_length=200, description="Professional title")
    email: str = Field(..., min_length=5, max_length=100, description="Email address")
    phone: str = Field(..., min_length=7, max_length=20, description="Phone number")
    location: str = Field(..., min_length=1, max_length=100, description="Location")
    linkedin: str = Field(default="", max_length=200, description="LinkedIn URL")
    github: str = Field(default="", max_length=200, description="GitHub URL")
    website: str = Field(default="", max_length=200, description="Personal website")
    summary: str = Field(default="", max_length=1000, description="Professional summary")


class ExperienceModel(BaseModel):
    """Work experience model"""
    role: str = Field(..., min_length=1, max_length=100)
    company: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=100)
    duration: str = Field(..., min_length=1, max_length=50)
    achievements: list[str] = Field(default_factory=list, max_length=10)
    technologies: list[str] = Field(default_factory=list, max_length=20)


class EducationModel(BaseModel):
    """Education model"""
    degree: str = Field(..., min_length=1, max_length=100)
    school: str = Field(..., min_length=1, max_length=100)
    year: str = Field(..., min_length=1, max_length=50)
    gpa: str = Field(default="", max_length=10)


class ProjectModel(BaseModel):
    """Project model"""
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    technologies: list[str] = Field(default_factory=list, max_length=20)
    github: str = Field(default="", max_length=200)
    demo: str = Field(default="", max_length=200)


class CertificationModel(BaseModel):
    """Certification model"""
    name: str = Field(..., min_length=1, max_length=100)
    issuer: str = Field(..., min_length=1, max_length=100)
    year: str = Field(..., min_length=1, max_length=10)


class ResumeGenerateRequest(BaseModel):
    """Resume generation request"""
    personal: PersonalInfoModel
    skills: dict[str, list[dict[str, Any]]] = Field(default_factory=dict)
    experience: list[ExperienceModel] = Field(default_factory=list, max_length=10)
    education: list[EducationModel] = Field(default_factory=list, max_length=5)
    projects: list[ProjectModel] = Field(default_factory=list, max_length=10)
    certifications: list[CertificationModel] = Field(default_factory=list, max_length=10)
    template: str = Field(default="modern_ai", description="Template style")
    
    @validator('template')
    def validate_template(cls, v):
        allowed = ['modern_ai', 'faang', 'startup', 'research']
        if v not in allowed:
            raise ValueError(f'Template must be one of: {allowed}')
        return v


class ResumeGenerateResponse(BaseModel):
    """Resume generation response"""
    success: bool
    message: str
    filename: str
    file_size: int
    template: str
    generated_at: str


# API Endpoints

@router.post("/generate", response_model=ResumeGenerateResponse)
async def generate_resume(
    request: ResumeGenerateRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate a premium ATS-optimized resume
    
    Returns a DOCX file with professional formatting
    """
    try:
        logger.info(f"Generating resume for {request.personal.name}")
        
        # Convert request to dict for resume service
        data = request.dict()
        
        # Generate resume
        resume_bytes = generate_premium_resume(data, template=request.template)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{request.personal.name.replace(' ', '_')}_Resume_{timestamp}.docx"
        
        # Save to temp file for response
        temp_path = f"/tmp/{filename}"
        with open(temp_path, "wb") as f:
            f.write(resume_bytes)
        
        # Schedule cleanup
        background_tasks.add_task(os.remove, temp_path)
        
        return ResumeGenerateResponse(
            success=True,
            message="Resume generated successfully",
            filename=filename,
            file_size=len(resume_bytes),
            template=request.template,
            generated_at=datetime.now().isoformat()
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
async def analyze_ats_score(resume_data: Dict[str, Any]):
    """
    Analyze ATS score for a resume
    
    Returns ATS optimization suggestions
    """
    try:
        checks = [
            {"name": "Contact Info", "weight": 10, "passed": bool(resume_data.get('personal', {}).get('email') and resume_data.get('personal', {}).get('phone'))},
            {"name": "Professional Summary", "weight": 15, "passed": bool(resume_data.get('personal', {}).get('summary'))},
            {"name": "Work Experience", "weight": 25, "passed": len(resume_data.get('experience', [])) > 0},
            {"name": "Education", "weight": 15, "passed": len(resume_data.get('education', [])) > 0},
            {"name": "Skills Section", "weight": 15, "passed": len(resume_data.get('skills', {})) > 0},
            {"name": "Projects", "weight": 5, "passed": len(resume_data.get('projects', [])) > 0},
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
