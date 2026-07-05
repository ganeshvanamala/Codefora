import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, X, Bot, Sparkles, Send } from "lucide-react";
import { api } from "../api/client";

export default function GlobalAiChat() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);

  // Hide on pages that have their own custom combo AI chat
  if (
    location.pathname.startsWith("/code") || 
    location.pathname.startsWith("/room") || 
    location.pathname.startsWith("/problems") ||
    location.pathname.startsWith("/playground")
  ) {
    return null;
  }

  const getPageName = () => {
    const path = location.pathname;
    if (path === "/" || path === "/home") return "Home";
    if (path.startsWith("/admin")) return "Admin Dashboard";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/rooms")) return "Rooms Library";
    return "Codefora Platform";
  };

  async function handleAskAi() {
    if (!prompt.trim() || thinking) return;
    const input = prompt.trim();
    setPrompt("");
    setThinking(true);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: input }]);

    try {
      const result = await api.request("/api/ai/ask", {
        method: "POST",
        body: JSON.stringify({
          prompt: input,
          context: {
            page: getPageName(),
          }
        })
      });
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: result.suggestion || "No answer returned." }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", text: error.message || "AI request failed." }
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="problem-ai-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{ zIndex: 9999 }}
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      <aside className={`problem-ai-panel ${open ? "open" : ""}`} aria-hidden={!open} style={{ zIndex: 9999 }}>
        <div className="problem-ai-header">
          <div>
            <span><Bot size={15} /> AI Assistant</span>
            <strong>{getPageName()}</strong>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close AI">
            <X size={16} />
          </button>
        </div>

        <div className="problem-ai-messages">
          {messages.length === 0 && (
            <div className="assistant-empty">
              <Sparkles size={15} />
              <p>Ask me anything about Codefora, features, or how to navigate the platform!</p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.role === "user" ? "ai-message--user" : "ai-message--assistant"}`}>
              <strong>{message.role === "user" ? "You" : "AI Assistant"}</strong>
              <div className="msg-bubble">
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {thinking && (
            <div className="ai-message ai-message--assistant">
              <strong>AI Assistant</strong>
              <div className="msg-bubble"><p>Thinking...</p></div>
            </div>
          )}
        </div>

        <div className="problem-ai-input">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleAskAi()}
            placeholder="Ask AI about Codefora..."
          />
          <button type="button" onClick={handleAskAi} disabled={thinking || !prompt.trim()} aria-label="Ask AI">
            <Send size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
