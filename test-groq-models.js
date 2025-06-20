import OpenAI from "openai";

// Initialize the OpenAI client with Groq's base URL
const client = new OpenAI({
  apiKey: "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",
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