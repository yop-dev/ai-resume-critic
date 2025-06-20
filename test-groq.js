import { Groq } from "groq";

// Initialize the Groq client
const client = new Groq({
  apiKey: "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",
});

async function testGroq() {
  try {
    const response = await client.chat.completions.create({
      model: "mixtral-8x7b-32768-v1",
      messages: [
        {
          role: "user",
          content: "Hello, how are you?"
        }
      ],
    });
    
    console.log("Response:", response.choices[0]?.message?.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGroq();