import OpenAI from "openai";

// Initialize the OpenAI client with Groq's base URL
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { resumeText } = req.body;
  if (!resumeText || typeof resumeText !== 'string') {
    return res.status(400).json({ error: 'Invalid resume text.' });
  }

  // Enhanced prompt for comprehensive resume analysis
  const enhancedPrompt = `You are a professional resume expert and career counselor with over 15 years of experience in hiring and talent acquisition. Analyze the following resume comprehensively and provide detailed, actionable feedback.

Please structure your analysis as a JSON object with the following keys:
- "overallAssessment": "Provide an overall quality score (e.g., 7/10) and a 2-3 sentence summary of the resume's strengths and main areas for improvement."
- "strengths": ["List 3-5 specific strong points about this resume.", "Highlight what makes this candidate stand out.", "Note any particularly impressive achievements or skills."]
- "criticalImprovementsNeeded": ["Identify 3-5 most important areas that need immediate attention.", "Focus on issues that significantly impact the resume's effectiveness.", "Prioritize changes that will have the biggest impact."]
- "sectionBySectionAnalysis": {
    "contactInformation": "Assess completeness and professionalism.",
    "professionalSummaryObjective": "Evaluate clarity, impact, and relevance. Suggest improvements if needed.",
    "workExperience": "Analyze job descriptions and achievements. Check for quantifiable results and action verbs. Assess relevance and presentation.",
    "skills": "Evaluate relevance and organization. Suggest additions or removals.",
    "education": "Check formatting and relevance. Note any missing important details.",
    "additionalSections": "Assess value and presentation of certifications, projects, etc."
  }
- "formattingAndPresentation": ["Visual appeal and readability.", "Consistency in formatting.", "Length appropriateness.", "ATS (Applicant Tracking System) compatibility."]
- "contentOptimization": ["Keyword optimization suggestions.", "Action verb usage.", "Quantifiable achievements.", "Relevance to target roles."]
- "specificRecommendations": ["Provide 5-7 concrete, actionable steps the candidate should take to improve their resume, ranked by priority."]
- "redFlagsToAddress": ["Identify any potential concerns that might hurt the candidate's chances."]
- "industrySpecificAdvice": "Based on the resume content, provide tailored advice for their specific industry or role."

The output MUST be a valid JSON object.

Resume to analyze:

${resumeText}

Provide a thorough, professional analysis that will genuinely help this candidate improve their resume and job prospects. Be specific, constructive, and actionable in your feedback.`;

  try {
    // Using Groq API with LLaMA-3-8B model
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional resume expert and career counselor. Your output MUST be a valid JSON object as per the user's instructions."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      // Ensure JSON mode is requested if supported by the API client, otherwise rely on prompt.
      // For OpenAI compatible APIs, response_format can be used.
      // response_format: { type: "json_object" }, // This line might need adjustment based on Groq's specific API capabilities
    });

    let feedbackData;
    const responseText = response.choices[0]?.message?.content || '';

    if (!responseText.trim()) {
      throw new Error('Empty response from Groq API');
    }

    try {
      // Attempt to parse the response as JSON
      feedbackData = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: If JSON parsing fails, use the raw text and try to structure it somewhat
      console.warn('Failed to parse AI response as JSON, using fallback:', parseError.message);
      // Basic fallback: split by common section headers if present, otherwise use as a single block
      const sections = {};
      const lines = responseText.split('\n');
      let currentKey = "generalFeedback";
      sections[currentKey] = "";

      const knownKeys = [
        "overallAssessment", "strengths", "criticalImprovementsNeeded",
        "sectionBySectionAnalysis", "formattingAndPresentation",
        "contentOptimization", "specificRecommendations",
        "redFlagsToAddress", "industrySpecificAdvice"
      ];

      lines.forEach(line => {
        const foundKey = knownKeys.find(k => line.toLowerCase().startsWith(k.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()));
        if (foundKey) {
          currentKey = foundKey;
          sections[currentKey] = (sections[currentKey] ? sections[currentKey] + "\n" : "") + line.substring(foundKey.length).replace(/^[:\s]+/, '');
        } else {
          sections[currentKey] += (sections[currentKey] ? "\n" : "") + line;
        }
      });
       // Clean up empty sections that might have been created if only a key was found
      for (const key in sections) {
        if (sections[key].trim() === "" || knownKeys.includes(sections[key].trim())) {
          delete sections[key];
        }
      }
      // If after attempting to parse, sections is still empty or only contains generalFeedback with the original text,
      // it means no known keys were found. In this case, just pass the original text.
      if (Object.keys(sections).length === 0 || (Object.keys(sections).length === 1 && sections.generalFeedback && sections.generalFeedback.trim() === responseText.trim())) {
        feedbackData = responseText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '• $1').trim();
      } else {
         feedbackData = sections;
      }
    }

    res.status(200).json({ 
      feedback: feedbackData,
      metadata: {
        resumeLength: resumeText.length,
        analysisTimestamp: new Date().toISOString(),
        wordCount: resumeText.split(/\s+/).length,
        isStructured: typeof feedbackData === 'object' && feedbackData !== null && !Array.isArray(feedbackData)
      }
    });

  } catch (err) {
    console.error('Resume analysis error:', err);
    let errorMessage = 'Internal server error during analysis.';
    if (err.message.includes('Groq')) {
      errorMessage = 'AI service temporarily unavailable. Please try again.';
    } else if (err.message.includes('fetch') || err.message.includes('network')) {
      errorMessage = 'Unable to connect to AI service. Please try again later.';
    } else if (err.message.includes('Empty response')) {
      errorMessage = 'AI service returned an empty response. Please try again.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      // Send raw feedback if available, for debugging or partial display
      feedback: `Error during analysis. Raw response (if any): ${err.responseText || 'N/A'}`
    });
  }
}