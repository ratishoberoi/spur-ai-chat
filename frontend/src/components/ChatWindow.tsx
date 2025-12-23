import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../api/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

type Msg = { sender: "user" | "ai"; text: string };

/**
 * Simulates human-like typing effect for AI replies
 */
function typeMessage(
  fullText: string,
  onUpdate: (text: string) => void,
  onDone: () => void
) {
  let index = 0;

  const interval = setInterval(() => {
    index++;
    onUpdate(fullText.slice(0, index));

    if (index >= fullText.length) {
      clearInterval(interval);
      onDone();
    }
  }, 20); // typing speed (ms per character)
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");

    // Add user message
    setMessages((m) => [...m, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendMessage(userMsg, conversationId);
      setConversationId(res.conversationId);

      // Add empty AI message first
      setMessages((m) => [...m, { sender: "ai", text: "" }]);

      // Type AI message character-by-character
      typeMessage(
        res.reply,
        (partialText) => {
          setMessages((m) => {
            const updated = [...m];
            updated[updated.length - 1] = {
              sender: "ai",
              text: partialText
            };
            return updated;
          });
        },
        () => {
          setLoading(false);
        }
      );
    } catch {
      setMessages((m) => [
        ...m,
        { sender: "ai", text: "Agent unavailable. Please try again." }
      ]);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          width: 420,
          height: 560,
          background: "#ffffff",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            fontWeight: 600
          }}
        >
          Spur Support Chat
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: 16,
            overflowY: "auto",
            background: "#f8fafc"
          }}
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} sender={m.sender} text={m.text} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: 12,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 8
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message…"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              outline: "none"
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
