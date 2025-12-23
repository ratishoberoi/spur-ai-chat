import prisma from "../db/prisma";
import crypto from "crypto";

export async function createConversation() {
  return prisma.conversation.create({
    data: {
      id: crypto.randomUUID()
    }
  });
}

export async function addMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      sender,
      text
    }
  });
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" }
  });
}
