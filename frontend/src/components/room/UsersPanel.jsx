import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Check, Headphones, Mic, MicOff, MoreVertical, Shield, UserX, Send, Sparkles, MessageSquare, Bot, CheckCheck, Paperclip, X } from "lucide-react";
import { getInviteCode } from "../../lib/navigation";
import { API_URL } from "../../config";
import sticker1 from "../../../assets/sticker1.jpeg";
import sticker2 from "../../../assets/sticker2.jpeg";
import bonfire from "../../../assets/bonfire.jpeg";

const STICKERS = [
  { id: "sticker1", label: "Sticker 1", src: sticker1 },
  { id: "sticker2", label: "Sticker 2", src: sticker2 },
  { id: "bonfire", label: "Bonfire", src: bonfire }
];

function stickerFor(id) {
  return STICKERS.find((sticker) => sticker.id === id);
}

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
          padding: "8px 12px 4px", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          flexShrink: 0
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          : USERS ({users.length})
        </span>
      </div>

      <div 
        className="users-list" 
        style={{ 
          padding: "6px 8px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "4px", 
          maxHeight: "150px", 
          overflowY: "auto",
          flexShrink: 0
        }}
      >
        {users.map((user) => (
          <div
            className="user-item-card"
            key={user.socketId}
            style={{
              background: "#121822",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              position: "relative",
              marginBottom: "4px"
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
                gap: "12px",
                padding: "10px 12px"
              }}
            >
              <div className="avatar-wrap" style={{ position: "relative" }}>
                {user.emotionId ? (
                  <div className="avatar" style={{ width: "32px", height: "32px", borderRadius: "50%", background: user.color || "#ffb000", display: "grid", placeItems: "center", overflow: "hidden" }}>
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
                      background: user.color || (user.role === "Host" ? "#ffb000" : "#8b5cf6"), 
                      display: "grid", 
                      placeItems: "center", 
                      fontSize: "14px", 
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

              <div className="user-info" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "nowrap" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>{user.name}</span>
                  {user.role === "Host" && <span style={{ fontSize: "12px", flexShrink: 0 }}>👑</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <small style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.02em" }}>{user.role}</small>
                  {user.isTyping && user.currentFile && (
                    <>
                      <span style={{ width: "2px", height: "2px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                      <small style={{ fontSize: "10px", color: "var(--primary-orange)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                          top: "24px",
                          zIndex: 1000,
                          background: "#111",
                          border: "1px solid #333",
                          borderRadius: "6px",
                          padding: "4px",
                          minWidth: "100px",
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
                              style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", background: isActive ? "rgba(249,115,22,0.1)" : "none", border: "none", color: isActive ? "#f97316" : "#ccc", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
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
                          style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", background: "none", border: "none", color: "#ef4444", borderRadius: "4px", fontSize: "10px", cursor: "pointer" }}
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
            {expandedUser === user.socketId && user.bio && (
              <div className="user-profile-expansion" style={{
                padding: "0 8px 8px 8px",
                marginTop: "-2px"
              }}>
                <div style={{
                  padding: "6px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <p style={{ margin: 0, fontSize: "10px", color: "#ddd", lineHeight: "1.3" }}>{user.bio}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- PUBLIC ROOM PERMISSIONS CARD --- */}
      <div 
        style={{ 
          margin: "0 16px 16px", 
          padding: "16px", 
          border: "1px solid rgba(249, 115, 22, 0.4)", 
          background: "transparent", 
          borderRadius: "12px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-orange)" }}>
          <MessageSquare size={16} />
          <strong style={{ fontSize: "13px", fontWeight: "600" }}>
            {room?.visibility === "private" ? "Private Room" : "Public Room"}
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>
          {permissions.canEdit ? "Full Access: Edit, Chat & Speak" : "View Only: Read-only Workspace"}
        </p>

        {permissions.isHost && room?.visibility === "private" && (
          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Invite Code:</span>
            <code style={{ fontSize: "11px", color: "var(--primary-orange)", fontFamily: "monospace", fontWeight: "bold" }}>
              {getInviteCode(roomId) || "N/A"}
            </code>
          </div>
        )}
      </div>

      {/* --- PREMIUM DYNAMIC TAB HEADER --- */}
      <div 
        style={{ 
          padding: "12px 16px", 
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MessageSquare size={16} style={{ color: "var(--primary-orange)" }} />
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff" }}>
              {activeTab === "chat" ? "Room Chat" : "AI Assistant"}
            </span>
          </div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "4px" }}>
            {activeTab === "chat" ? (
              <>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                {users.length} {users.length === 1 ? "participant" : "participants"}
              </>
            ) : (
              <>
                <Sparkles size={9} style={{ color: "var(--primary-orange)" }} />
                Powered by Gemini
              </>
            )}
          </span>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === "chat" ? "ai" : "chat")}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "5px 10px",
            borderRadius: "14px",
            color: "var(--primary-orange)",
            fontSize: "10px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.2s"
          }}
        >
          {activeTab === "chat" ? (
            <>
              <span>Chat with AI</span>
              <Sparkles size={10} />
            </>
          ) : (
            <>
              <span>Room Chat</span>
              <MessageSquare size={10} />
            </>
          )}
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
          <section className="room-chat" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div className="chat-messages" ref={chatScrollRef} style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.map((message, index) => {
                const isMe = message.user === me?.name;
                const isAi = String(message.text || "").startsWith("AI Assistant:");
                const sticker = stickerFor(message.stickerId);
                const prevMessage = messages[index - 1];
                const isGrouped = prevMessage && prevMessage.user === message.user;
                const senderName = isAi ? "AI Assistant" : message.user;
                const formattedTime = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

                if (isMe) {
                  return (
                    <div
                      className={`chat-message user-message ${isGrouped ? "grouped" : ""} ${message.optimistic ? "optimistic" : ""}`}
                      key={message.id || `${message.user}-${message.createdAt}`}
                    >
                      {!isGrouped && <span className="chat-time-above" style={{ fontSize: "9px", opacity: 0.4, alignSelf: "flex-end", marginBottom: "2px" }}>{formattedTime}</span>}
                      <div className="msg-bubble" style={{ background: "var(--primary-orange)", borderRadius: "14px 14px 2px 14px", padding: "8px 12px", maxWidth: "85%", alignSelf: "flex-end", position: "relative" }}>
                        <strong className="chat-sender-name-me" style={{ display: "none" }}>{senderName}</strong>
                        {sticker ? (
                          <img className="chat-sticker-image" src={sticker.src} alt={sticker.label} style={{ maxWidth: "80px", borderRadius: "4px" }} />
                        ) : (
                          <p style={{ margin: 0, fontSize: "12px", color: "#000", fontWeight: "500", lineHeight: "1.4", wordBreak: "break-word" }}>{message.text}</p>
                        )}
                        <span className="chat-status-check" style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px", opacity: 0.6 }}>
                          <CheckCheck size={10} style={{ color: "#000" }} />
                        </span>
                      </div>
                    </div>
                  );
                }

                // Others' messages
                const initials = (senderName || "").slice(0, 1).toUpperCase();
                return (
                  <div
                    className={`chat-message other-message ${isGrouped ? "grouped" : ""} ${isAi ? "ai-msg" : ""} ${message.optimistic ? "optimistic" : ""}`}
                    key={message.id || `${message.user}-${message.createdAt}`}
                    style={{ alignSelf: "flex-start", width: "100%" }}
                  >
                    {!isGrouped && (
                      <div className="chat-sender-row" style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <div className="chat-avatar" style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center", fontSize: "10px", fontWeight: "bold", color: "#8be9fd" }}>{initials}</div>
                        <div className="chat-sender-info" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span className="chat-sender-name-other" style={{ fontSize: "10px", fontWeight: "bold", color: "#8be9fd" }}>{senderName}</span>
                          <span className="chat-time-other" style={{ fontSize: "8px", opacity: 0.4 }}>{formattedTime}</span>
                        </div>
                      </div>
                    )}
                    <div className="msg-bubble" style={{ background: "#1b2b45", borderRadius: "14px 14px 14px 2px", padding: "8px 12px", maxWidth: "85%", marginLeft: isGrouped ? "0px" : "26px" }}>
                      {sticker ? (
                        <img className="chat-sticker-image" src={sticker.src} alt={sticker.label} style={{ maxWidth: "80px", borderRadius: "4px" }} />
                      ) : (
                        <p style={{ margin: 0, fontSize: "12px", color: "#fff", lineHeight: "1.4", wordBreak: "break-word" }}>{isAi ? String(message.text || "").replace("AI Assistant: ", "") : message.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
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
          flexShrink: 0,
          position: "relative"
        }}
      >
        {activeTab === "chat" && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={() => onSendSticker ? onSendSticker("bonfire") : onSendChat("🔥")}
              title="Send Bonfire sticker"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '4px',
                display: 'grid',
                placeItems: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <Paperclip size={16} />
            </button>
          </div>
        )}

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
            borderRadius: "18px", 
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
