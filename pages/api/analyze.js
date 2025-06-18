export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { resumeText } = req.body;
  if (!resumeText || typeof resumeText !== 'string') {
    return res.status(400).json({ error: 'Invalid resume text.' });
  }

  // Enhanced prompt for comprehensive resume analysis
  const enhancedPrompt = `You are a professional resume expert and career counselor with over 15 years of experience in hiring and talent acquisition. Analyze the following resume comprehensively and provide detailed, actionable feedback.

Please structure your analysis with the following sections:

**OVERALL ASSESSMENT (Score: X/10)**
Provide an overall quality score and 2-3 sentence summary of the resume's strengths and main areas for improvement.

**STRENGTHS**
• List 3-5 specific strong points about this resume
• Highlight what makes this candidate stand out
• Note any particularly impressive achievements or skills

**CRITICAL IMPROVEMENTS NEEDED**
• Identify 3-5 most important areas that need immediate attention
• Focus on issues that significantly impact the resume's effectiveness
• Prioritize changes that will have the biggest impact

**SECTION-BY-SECTION ANALYSIS**
Analyze each major section present in the resume:

*Contact Information:*
- Assess completeness and professionalism

*Professional Summary/Objective:*
- Evaluate clarity, impact, and relevance
- Suggest improvements if needed

*Work Experience:*
- Analyze job descriptions and achievements
- Check for quantifiable results and action verbs
- Assess relevance and presentation

*Skills:*
- Evaluate relevance and organization
- Suggest additions or removals

*Education:*
- Check formatting and relevance
- Note any missing important details

*Additional Sections:*
- Assess value and presentation of certifications, projects, etc.

**FORMATTING & PRESENTATION**
• Visual appeal and readability
• Consistency in formatting
• Length appropriateness
• ATS (Applicant Tracking System) compatibility

**CONTENT OPTIMIZATION**
• Keyword optimization suggestions
• Action verb usage
• Quantifiable achievements
• Relevance to target roles

**SPECIFIC RECOMMENDATIONS**
Provide 5-7 concrete, actionable steps the candidate should take to improve their resume, ranked by priority.

**RED FLAGS TO ADDRESS**
Identify any potential concerns that might hurt the candidate's chances.

**INDUSTRY-SPECIFIC ADVICE**
Based on the resume content, provide tailored advice for their specific industry or role.

---

Resume to analyze:

${resumeText}

Please provide a thorough, professional analysis that will genuinely help this candidate improve their resume and job prospects. Be specific, constructive, and actionable in your feedback.`;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: enhancedPrompt,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000,
          stop: ["---END---"]
        }
      }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      throw new Error(`Ollama API error: ${ollamaRes.status} ${ollamaRes.statusText}`);
    }

    const reader = ollamaRes.body.getReader();
    let fullText = '';
    let responseText = '';

    // Stream processing with better error handling
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        fullText += chunk;
      }
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      throw new Error('Error reading response stream');
    }

    // Parse the streamed response
    const lines = fullText.trim().split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) {
          responseText += parsed.response;
        }
        if (parsed.error) {
          throw new Error(`Ollama error: ${parsed.error}`);
        }
      } catch (parseError) {
        // Skip malformed JSON lines but log for debugging
        console.warn('Skipping malformed JSON line:', line);
        continue;
      }
    }

    // Validate response
    if (!responseText.trim()) {
      throw new Error('Empty response from Ollama');
    }

    // Post-process the response for better formatting
    const formattedResponse = responseText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold formatting for cleaner display
      .replace(/\*([^*]+)\*/g, '• $1') // Convert single asterisks to bullet points
      .trim();

    // Log successful analysis (optional, remove in production)
    console.log(`Successfully analyzed resume of ${resumeText.length} characters`);

    res.status(200).json({ 
      feedback: formattedResponse,
      metadata: {
        resumeLength: resumeText.length,
        analysisTimestamp: new Date().toISOString(),
        wordCount: resumeText.split(/\s+/).length
      }
    });

  } catch (err) {
    console.error('Resume analysis error:', err);
    
    // Provide more helpful error messages
    let errorMessage = 'Internal server error';
    if (err.message.includes('Ollama')) {
      errorMessage = 'AI service temporarily unavailable. Please try again.';
    } else if (err.message.includes('fetch')) {
      errorMessage = 'Unable to connect to AI service. Please check if Ollama is running.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}