import { Router, Request, Response } from "express";
import {
  createConversation,
  addMessage,
  getConversationMessages
} from "../services/chat.service";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  const { message, conversationId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  let convoId = conversationId;

  if (!convoId) {
    const convo = await createConversation();
    convoId = convo.id;
  }

  await addMessage(convoId, "user", message);

  // TEMP reply (LLM Phase-3)
  const reply = "Thanks! Our support agent will reply shortly.";

  await addMessage(convoId, "ai", reply);

  res.json({
    reply,
    conversationId: convoId
  });
});

export default router;
