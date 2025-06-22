import OpenAI from "openai";

// Initialize the OpenAI client with Groq's base URL
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function testGroqModels() {
  try {
    // List available models
    const models = await client.models.list();
    console.log("Available models:", models.data.map(model => model.id));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

testGroqModels();