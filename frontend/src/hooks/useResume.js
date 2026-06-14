/**
 * Resume Generator Hook
 * Handles resume generation, ATS analysis, and template management
 */
import { useState, useCallback } from "react";
import {
  generateResume,
  getTemplates,
  analyzeATSScore,
  downloadResume,
} from "@/lib/resumeApi";

export const useResume = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [atsScore, setAtsScore] = useState(null);

  // Fetch available templates
  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTemplates();
      setTemplates(data.templates || []);
      return data.templates;
    } catch (err) {
      setError(err.message || "Failed to fetch templates");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate resume
  const generateResumeFile = useCallback(
    async (resumeData, template = "modern_ai") => {
      try {
        setIsLoading(true);
        setError(null);

        const blob = await generateResume(resumeData, template);

        // Generate filename
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `${resumeData.personal.name.replace(
          /\s+/g,
          "_"
        )}_Resume_${timestamp}.docx`;

        return { blob, filename };
      } catch (err) {
        setError(err.message || "Failed to generate resume");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
  );

  // Download resume
  const downloadResumeFile = useCallback((blob, filename) => {
    downloadResume(blob, filename);
  }, []);

  // Analyze ATS score
  const analyzeResumeATS = useCallback(async (resumeData) => {
    try {
      setIsLoading(true);
      setError(null);

      const analysis = await analyzeATSScore(resumeData);
      setAtsScore(analysis);

      return analysis;
    } catch (err) {
      setError(err.message || "Failed to analyze ATS score");
      // Return client-side analysis as fallback
      return performClientSideATSAnalysis(resumeData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    templates,
    atsScore,
    fetchTemplates,
    generateResumeFile,
    downloadResumeFile,
    analyzeResumeATS,
  };
};

// Client-side ATS analysis (fallback)
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
  const suggestions = checks.filter((c) => !c.passed).map((c) => `Add ${c.name}`);

  return {
    score,
    checks,
    suggestions,
    rating:
      score >= 95 ? "excellent" : score >= 85 ? "good" : score >= 70 ? "fair" : "poor",
  };
};

export default useResume;
