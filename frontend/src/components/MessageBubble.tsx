type Props = {
  sender: "user" | "ai";
  text: string;
};

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: 14,
          background: isUser ? "#4f46e5" : "#e5e7eb",
          color: isUser ? "#fff" : "#111827",
          lineHeight: 1.4
        }}
      >
        {text}
      </div>
    </div>
  );
}
