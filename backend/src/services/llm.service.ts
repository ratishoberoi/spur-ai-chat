import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function generateReply(
  history: { role: "user" | "assistant"; content: string }[],
  userMessage: string
) {
  try {
    const messages = [
      {
        role: "system",
        content: `
You are a helpful support agent for a small e-commerce store.

Store policies:
- Shipping: India & USA, 5–7 business days
- Returns: 7-day no-questions-asked return
- Support hours: Mon–Fri, 10am–6pm IST

Answer clearly, politely, and concisely.
`
      },
      ...history,
      { role: "user", content: userMessage }
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.3,
      max_tokens: 200
    });

    return (
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("Groq LLM Error:", error);
    throw new Error("LLM_SERVICE_FAILED");
  }
}
