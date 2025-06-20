export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription || typeof resumeText !== 'string' || typeof jobDescription !== 'string') {
    return res.status(400).json({ error: 'Invalid resume text or job description.' });
  }

  // Enhanced prompt for personalized cover letter generation
  const enhancedPrompt = `You are a professional career advisor with expertise in creating personalized cover letters. 
Create a compelling cover letter based on the candidate's resume and the job description provided.

The cover letter should:
1. Be professionally formatted with proper sections (greeting, introduction, body paragraphs, conclusion, signature)
2. Highlight the most relevant skills and experiences from the resume that match the job requirements
3. Show enthusiasm for the specific role and company
4. Be concise (around 300-400 words)
5. Include a call to action in the closing paragraph
6. Be personalized and not generic
7. Use professional but engaging language
8. Address specific requirements mentioned in the job description

Resume:
${resumeText}

Job Description:
${jobDescription}

Please create a complete, ready-to-use cover letter that the candidate can personalize further if needed.`;

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

    // Log successful generation (optional, remove in production)
    console.log(`Successfully generated cover letter for job description of ${jobDescription.length} characters`);

    res.status(200).json({ 
      coverLetter: responseText.trim(),
      metadata: {
        resumeLength: resumeText.length,
        jobDescriptionLength: jobDescription.length,
        generationTimestamp: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Cover letter generation error:', err);
    
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