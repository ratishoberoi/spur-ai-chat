import { Router, Request, Response } from "express";
import {
  createConversation,
  addMessage,
  getConversationMessages
} from "../services/chat.service";
import { generateReply } from "../services/llm.service";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    let convoId = conversationId as string | undefined;

    if (!convoId) {
      const convo = await createConversation();
      convoId = convo.id;
    }

    await addMessage(convoId, "user", message);

    const messages = await getConversationMessages(convoId);

    const history = messages.slice(-6).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));

    const reply = await generateReply(history, message);

    await addMessage(convoId, "ai", reply);

    return res.json({
      reply,
      conversationId: convoId
    });
  } catch (error) {
    console.error("Chat Route Error:", error);
    return res.status(500).json({
      error: "Our support agent is temporarily unavailable. Please try again."
    });
  }
});

export default router;
