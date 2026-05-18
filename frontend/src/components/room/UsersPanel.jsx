import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Check, Headphones, Mic, MicOff, MoreVertical, Shield, UserX, Send, Sparkles, MessageSquare, Bot } from "lucide-react";
import { getInviteCode } from "../../lib/navigation";
import { API_URL } from "../../config";

export function UsersPanel({ 
  room, 
  roomId, 
  users, 
  permissions, 
  onRoleChange, 
  onKickUser,
  messages = [],
  aiMessages = [],
  me,
  aiThinking = false,
  onSendChat,
  onSendSticker,
  onAskAi,
  onClearNotifications
}) {
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatText, setChatText] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const chatScrollRef = useRef(null);
  const aiScrollRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest('.user-menu-wrap')) setOpenMenuFor(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpenMenuFor(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const scrollToBottom = () => {
    const container = chatScrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  const scrollAiToBottom = () => {
    const container = aiScrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  useLayoutEffect(() => {
    scrollAiToBottom();
  }, [aiMessages, aiThinking, activeTab]);

  return (
    <aside 
      className="side-panel users-panel" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        overflow: "hidden", 
        background: "var(--bg-secondary)", 
        borderRight: "1px solid var(--glass-border)",
        borderRadius: "12px"
      }}
    >
      {/* --- USERS SECTION --- */}
      <div 
        className="section-title" 
        style={{ 
          padding: "12px 16px 8px", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          : USERS ({users.length})
        </span>
      </div>

      <div 
        className="users-list" 
        style={{ 
          padding: "8px 12px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          maxHeight: "180px", 
          overflowY: "auto",
          flexShrink: 0
        }}
      >
        {users.map((user) => (
          <div
            className="user-item-card"
            key={user.socketId}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              borderRadius: "10px",
              position: "relative"
            }}
          >
            <div
              className={`user-row-v2 ${user.speaking ? "speaking" : ""}`}
              onClick={(e) => {
                if (e.target.closest('.user-actions')) return;
                setExpandedUser(current => current === user.socketId ? null : user.socketId);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px"
              }}
            >
              <div className="avatar-wrap" style={{ position: "relative" }}>
                {user.emotionId ? (
                  <div className="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", background: user.color || "#ff7a18", display: "grid", placeItems: "center", overflow: "hidden" }}>
                    <img
                      src={`${API_URL}/api/emotions/${user.emotionId}/image`}
                      alt={`${user.name}'s emotion`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <span
                    className="avatar"
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      borderRadius: "50%", 
                      background: user.color || "#ff7a18", 
                      display: "grid", 
                      placeItems: "center", 
                      fontSize: "12px", 
                      fontWeight: "bold", 
                      color: "#fff",
                      boxShadow: "none",
                      border: "none"
                    }}
                  >
                    {user.name[0]?.toUpperCase()}
                  </span>
                )}
                {user.speaking && <div className="speaking-indicator" />}
              </div>

              <div className="user-info" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <strong style={{ fontSize: "13px", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</strong>
                  {user.role === "Host" && <Shield size={10} style={{ color: "var(--primary-orange)" }} />}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <small style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: "600" }}>{user.role}</small>
                  {user.isTyping && user.currentFile && (
                    <>
                      <span style={{ width: "2px", height: "2px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                      <small style={{ fontSize: "9px", color: "var(--primary-orange)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Typing...
                      </small>
                    </>
                  )}
                </div>
              </div>

              <div className="user-actions" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                <span className={`mic-status-icon ${user.mic ? "on" : "off"}`}>
                  {user.mic ? <Mic size={12} style={{ color: "var(--primary-orange)" }} /> : <MicOff size={12} style={{ opacity: 0.3 }} />}
                </span>

                {permissions.isHost && user.role !== "Host" && (
                  <div className="user-menu-wrap" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      className="mini-icon"
                      onClick={() => setOpenMenuFor((current) => current === user.socketId ? null : user.socketId)}
                      style={{ padding: "4px", background: "none", border: "none", color: "#666", cursor: "pointer" }}
                    >
                      <MoreVertical size={12} />
                    </button>

                    {openMenuFor === user.socketId && (
                      <div
                        className="user-action-menu"
                        role="menu"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "32px",
                          zIndex: 1000,
                          background: "#111",
                          border: "1px solid #333",
                          borderRadius: "8px",
                          padding: "4px",
                          minWidth: "120px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                        }}
                      >
                        <div style={{ fontSize: "8px", color: "#555", padding: "4px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</div>
                        {(["Host", "Member", "Viewer"]).map((nextRole) => {
                          const isActive = user.role === nextRole;
                          return (
                            <button
                              key={nextRole}
                              type="button"
                              className={`user-action-item ${isActive ? "active" : ""}`}
                              onClick={() => {
                                onRoleChange(user.socketId, nextRole);
                                setOpenMenuFor(null);
                              }}
                              style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: isActive ? "rgba(249,115,22,0.1)" : "none", border: "none", color: isActive ? "#f97316" : "#ccc", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                            >
                              <span>{nextRole}</span>
                              {isActive && <Check size={10} />}
                            </button>
                          );
                        })}
                        <div style={{ height: "1px", background: "#333", margin: "4px 0" }} />
                        <button
                          type="button"
                          onClick={() => {
                            onKickUser?.(user.socketId);
                            setOpenMenuFor(null);
                          }}
                          style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", background: "none", border: "none", color: "#ef4444", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                        >
                          <span>Kick</span>
                          <UserX size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Expansion */}
            {expandedUser === user.socketId && (
              <div className="user-profile-expansion" style={{
                padding: "0 10px 10px 10px",
                marginTop: "-2px"
              }}>
                <div style={{
                  padding: "8px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginBottom: "2px", textTransform: "uppercase" }}>Bio</div>
                  {user.bio ? (
                    <p style={{ margin: 0, fontSize: "11px", color: "#ddd", lineHeight: "1.3" }}>{user.bio}</p>
                  ) : (
                    <p style={{ margin: 0, fontSize: "11px", color: "#555", fontStyle: "italic" }}>No bio provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- PUBLIC ROOM PERMISSIONS CARD --- */}
      <div 
        style={{ 
          margin: "8px 12px", 
          padding: "12px", 
          border: "1px solid rgba(249, 115, 22, 0.3)", 
          background: "rgba(249, 115, 22, 0.03)", 
          borderRadius: "12px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "4px",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff" }}>
          <MessageSquare size={14} style={{ color: "var(--primary-orange)" }} />
          <strong style={{ fontSize: "12px" }}>
            {room?.visibility === "private" ? "Private Room" : "Public Room"}
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: "10px", color: "rgba(255,255,255,0.6)", lineHeight: "1.4" }}>
          {permissions.canEdit ? "Full Access: Edit, Chat & Speak" : "View Only: Read-only Workspace"}
        </p>

        {permissions.isHost && room?.visibility === "private" && (
          <div style={{ marginTop: "4px", paddingTop: "4px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Invite Code:</span>
            <code style={{ fontSize: "10px", color: "var(--primary-orange)", fontFamily: "monospace", fontWeight: "bold" }}>
              {getInviteCode(roomId) || "N/A"}
            </code>
          </div>
        )}
      </div>

      {/* --- TABS --- */}
      <div 
        style={{ 
          display: "flex", 
          padding: "2px 12px 0", 
          borderTop: "1px solid rgba(255,255,255,0.03)", 
          borderBottom: "1px solid rgba(255,255,255,0.03)", 
          background: "rgba(0,0,0,0.1)",
          flexShrink: 0
        }}
      >
        <button 
          style={{ 
            flex: 1, 
            padding: "8px 0", 
            background: "none", 
            border: "none", 
            color: activeTab === "chat" ? "var(--primary-orange)" : "var(--text-muted)", 
            fontSize: "11px", 
            fontWeight: "bold", 
            borderBottom: activeTab === "chat" ? "2px solid var(--primary-orange)" : "2px solid transparent", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "6px", 
            outline: "none" 
          }}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare size={12} />
          <span>Public Chat</span>
        </button>
        <button 
          style={{ 
            flex: 1, 
            padding: "8px 0", 
            background: "none", 
            border: "none", 
            color: activeTab === "ai" ? "var(--primary-orange)" : "var(--text-muted)", 
            fontSize: "11px", 
            fontWeight: "bold", 
            borderBottom: activeTab === "ai" ? "2px solid var(--primary-orange)" : "2px solid transparent", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "6px", 
            outline: "none" 
          }}
          onClick={() => {
            setActiveTab("ai");
            onClearNotifications?.();
          }}
        >
          <Sparkles size={12} />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* --- SCROLL MESSAGE CONTENT PANEL --- */}
      <div 
        style={{ 
          flex: 1, 
          minHeight: 0, 
          display: "flex", 
          flexDirection: "column",
          background: "#041425"
        }}
      >
        {activeTab === "chat" ? (
          <div 
            ref={chatScrollRef} 
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "12px", 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px" 
            }}
          >
            {messages.map((message) => {
              const formattedTime = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
              const initials = (message.user || "U").slice(0, 1).toUpperCase();
              
              return (
                <div key={message.id || `${message.user}-${message.createdAt}`} style={{ display: "flex", gap: "8px", padding: "2px 0" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: "bold", color: "#fff", flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "bold", color: "rgba(255,255,255,0.85)" }}>
                          {message.user}
                        </span>
                        {message.user === room?.hostName && (
                          <span style={{ fontSize: "7px", background: "rgba(249,115,22,0.15)", color: "var(--primary-orange)", padding: "0 3px", borderRadius: "3px", fontWeight: "bold" }}>
                            HOST
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>
                        {formattedTime}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.75)", lineHeight: "1.35", wordBreak: "break-word" }}>
                      {message.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            ref={aiScrollRef} 
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "12px", 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px" 
            }}
          >
            {aiMessages.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 10px", color: "var(--text-muted)" }}>
                <Bot size={24} style={{ color: "var(--primary-orange)", marginBottom: "8px" }} />
                <p style={{ margin: 0, fontSize: "11px" }}>Ask the assistant anything about your code, logic, or errors.</p>
              </div>
            )}
            {aiMessages.map((message) => (
              <div key={message.id} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: message.role === "user" ? "var(--primary-orange)" : "#0096ff" }}>
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </span>
                </div>
                <div style={{ 
                  background: message.role === "user" ? "rgba(255,255,255,0.02)" : "rgba(0,150,255,0.02)", 
                  border: "1px solid rgba(255,255,255,0.04)", 
                  padding: "8px", 
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#ddd",
                  lineHeight: "1.4",
                  wordBreak: "break-word"
                }}>
                  {message.content || message.text}
                </div>
              </div>
            ))}
            {aiThinking && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px" }}>
                <span className="dot-pulse" style={{ fontSize: "10px", color: "var(--primary-orange)", fontWeight: "bold" }}>AI is thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- STICKY INPUT BAR --- */}
      <div 
        style={{ 
          padding: "10px 12px", 
          background: "rgba(0,0,0,0.15)", 
          borderTop: "1px solid rgba(255,255,255,0.03)", 
          display: "flex", 
          gap: "8px", 
          alignItems: "center",
          flexShrink: 0
        }}
      >
        <input 
          type="text"
          style={{ 
            flex: 1, 
            height: "36px", 
            borderRadius: "18px", 
            background: "rgba(255,255,255,0.04)", 
            border: "1px solid rgba(255,255,255,0.06)", 
            color: "#fff", 
            padding: "0 16px", 
            fontSize: "11px", 
            outline: "none" 
          }}
          placeholder={activeTab === "chat" ? (permissions.canChat ? "Type a message..." : "Chat disabled") : "Ask the AI assistant..."}
          value={activeTab === "chat" ? chatText : aiPrompt}
          onChange={(e) => activeTab === "chat" ? setChatText(e.target.value) : setAiPrompt(e.target.value)}
          disabled={activeTab === "chat" ? !permissions.canChat : false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (activeTab === "chat") {
                if (!chatText.trim()) return;
                onSendChat(chatText);
                setChatText("");
              } else {
                if (!aiPrompt.trim()) return;
                onAskAi(aiPrompt);
                setAiPrompt("");
              }
            }
          }}
        />
        <button 
          style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "10px", 
            background: "var(--primary-orange)", 
            border: "none", 
            display: "grid", 
            placeItems: "center", 
            color: "#000", 
            cursor: "pointer", 
            transition: "all 0.2s", 
            flexShrink: 0 
          }}
          disabled={activeTab === "chat" ? !permissions.canChat : false}
          onClick={() => {
            if (activeTab === "chat") {
              if (!chatText.trim()) return;
              onSendChat(chatText);
              setChatText("");
            } else {
              if (!aiPrompt.trim()) return;
              onAskAi(aiPrompt);
              setAiPrompt("");
            }
          }}
        >
          <Send size={13} style={{ color: "#000" }} />
        </button>
      </div>
    </aside>
  );
}
