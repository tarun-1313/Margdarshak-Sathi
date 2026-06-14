/**
 * Resume Generator API Service
 * Handles communication with the backend resume generation API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Generate a premium ATS-optimized resume
 * @param {Object} resumeData - Complete resume data
 * @param {string} template - Template style (modern_ai, faang, startup, research)
 * @returns {Promise<Blob>} - DOCX file as blob
 */
export const generateResume = async (resumeData, template = "modern_ai") => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/resume/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...resumeData,
        template,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to generate resume");
    }

    // Return the DOCX file as a blob
    return await response.blob();
  } catch (error) {
    console.error("Resume generation error:", error);
    throw error;
  }
};

/**
 * Get available resume templates
 * @returns {Promise<Array>} - List of available templates
 */
export const getTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/resume/templates`);

    if (!response.ok) {
      throw new Error("Failed to fetch templates");
    }

    return await response.json();
  } catch (error) {
    console.error("Get templates error:", error);
    // Return default templates if API fails
    return {
      templates: [
        {
          id: "modern_ai",
          name: "Modern AI Engineer",
          description: "Clean, futuristic design optimized for AI/ML roles",
          ats_score: 98,
        },
        {
          id: "faang",
          name: "FAANG Style",
          description: "Professional layout inspired by top tech companies",
          ats_score: 97,
        },
        {
          id: "startup",
          name: "Startup Founder",
          description: "Bold design highlighting entrepreneurial experience",
          ats_score: 95,
        },
        {
          id: "research",
          name: "Research Engineer",
          description: "Academic-style layout for research-focused roles",
          ats_score: 96,
        },
      ],
    };
  }
};

/**
 * Analyze ATS score for a resume
 * @param {Object} resumeData - Resume data to analyze
 * @returns {Promise<Object>} - ATS analysis results
 */
export const analyzeATSScore = async (resumeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/resume/ats-analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze ATS score");
    }

    return await response.json();
  } catch (error) {
    console.error("ATS analysis error:", error);
    // Return client-side analysis as fallback
    return performClientSideATSAnalysis(resumeData);
  }
};

/**
 * Client-side ATS analysis (fallback when API is unavailable)
 * @param {Object} resumeData - Resume data to analyze
 * @returns {Object} - ATS analysis results
 */
const performClientSideATSAnalysis = (resumeData) => {
  const checks = [
    {
      name: "Contact Info",
      weight: 10,
      passed: !!(
        resumeData?.personal?.email && resumeData?.personal?.phone
      ),
    },
    {
      name: "Professional Summary",
      weight: 15,
      passed: !!resumeData?.personal?.summary,
    },
    {
      name: "Work Experience",
      weight: 25,
      passed: resumeData?.experience?.length > 0,
    },
    {
      name: "Education",
      weight: 15,
      passed: resumeData?.education?.length > 0,
    },
    {
      name: "Skills Section",
      weight: 15,
      passed: Object.keys(resumeData?.skills || {}).length > 0,
    },
    {
      name: "Projects",
      weight: 5,
      passed: resumeData?.projects?.length > 0,
    },
  ];

  const score = checks.reduce(
    (acc, check) => acc + (check.passed ? check.weight : 0),
    0
  );
  const suggestions = checks
    .filter((c) => !c.passed)
    .map((c) => `Add ${c.name}`);

  return {
    score,
    checks,
    suggestions,
    rating:
      score >= 95 ? "excellent" : score >= 85 ? "good" : score >= 70 ? "fair" : "poor",
  };
};

/**
 * Download a generated resume
 * @param {Blob} blob - Resume file blob
 * @param {string} filename - Filename for download
 */
export const downloadResume = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default {
  generateResume,
  getTemplates,
  analyzeATSScore,
  downloadResume,
};
