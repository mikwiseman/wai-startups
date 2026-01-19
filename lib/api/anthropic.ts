import Anthropic from "@anthropic-ai/sdk";

// Initialize the Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL_ID = "claude-opus-4-5-20251101";
