import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addUserMessage,
  clearChat,
} from "../store/slices/chatSlice";

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { messages, loading, conversationId } = useSelector(
    (state) => state.chat,
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage({ message: input, conversationId }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>AI Chat — Log via Conversation</h2>
        <button style={styles.clearBtn} onClick={() => dispatch(clearChat())}>
          Clear Chat
        </button>
      </div>

      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.placeholder}>
            <p style={{ fontSize: "16px", fontWeight: 500 }}>
              Start a conversation
            </p>
            <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>
              Try: "I met Dr. Patel today to discuss our new cardiac drug"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#4361ee" : "#f0f0f5",
              color: msg.role === "user" ? "#fff" : "#1a1a2e",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "4px",
                color: msg.role === "user" ? "#c5d0ff" : "#888",
              }}
            >
              {msg.role === "user" ? "You" : "AI Assistant"}
            </span>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div
            style={{ ...styles.message, background: "#f0f0f5", color: "#888" }}
          >
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your interaction..."
          rows={2}
        />
        <button style={styles.sendBtn} onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#fff",
    borderRadius: "12px",
    padding: "0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    maxWidth: "700px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "600px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #eee",
  },
  title: { fontSize: "18px", fontWeight: 600 },
  clearBtn: {
    padding: "6px 14px",
    background: "#fee",
    color: "#c33",
    border: "1px solid #fcc",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  placeholder: { textAlign: "center", marginTop: "100px", color: "#666" },
  message: {
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "80%",
    fontSize: "14px",
    lineHeight: "1.5",
    display: "flex",
    flexDirection: "column",
    whiteSpace: "pre-wrap",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #eee",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Inter",
    outline: "none",
    resize: "none",
  },
  sendBtn: {
    padding: "10px 24px",
    background: "#4361ee",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default ChatInterface;
