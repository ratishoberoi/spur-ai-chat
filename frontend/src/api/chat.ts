export async function sendMessage(
  message: string,
  conversationId?: string
) {
  const res = await fetch("http://localhost:4000/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationId })
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json() as Promise<{
    reply: string;
    conversationId: string;
  }>;
}
