import OpenAI from "openai";

// Initialize the OpenAI client with Groq's base URL
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

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
    // Using Groq API with LLaMA-3-8B model
    const response = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional career advisor with expertise in creating personalized cover letters."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract the generated text
    let responseText = response.choices[0]?.message?.content || '';

    // Validate response
    if (!responseText.trim()) {
      throw new Error('Empty response from Groq API');
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
    if (err.message.includes('Groq')) {
      errorMessage = 'AI service temporarily unavailable. Please try again.';
    } else if (err.message.includes('fetch') || err.message.includes('network')) {
      errorMessage = 'Unable to connect to AI service. Please try again later.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}