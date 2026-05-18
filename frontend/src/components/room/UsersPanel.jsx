import { useEffect, useState } from "react";
import { Check, Headphones, Mic, MicOff, MoreVertical, Shield, UserX, MessageSquare } from "lucide-react";
import { getInviteCode } from "../../lib/navigation";
import { API_URL } from "../../config";

export function UsersPanel({ 
  room, 
  roomId, 
  users, 
  permissions, 
  onRoleChange, 
  onKickUser
}) {
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

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
          flex: 1, 
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
              marginBottom: "4px",
              padding: "10px"
            }}
          >
            <div
              className={`user-row ${user.speaking ? "speaking" : ""}`}
              onClick={(e) => {
                if (e.target.closest('.user-actions')) return;
                setExpandedUser(current => current === user.socketId ? null : user.socketId);
              }}
              style={{
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "30px minmax(0, 1fr)",
                gap: "8px",
                alignItems: "center"
              }}
            >
              {/* Column 1: Avatar */}
              <div className="avatar-wrap" style={{ position: "relative", width: "30px", height: "30px" }}>
                {user.emotionId ? (
                  <div className="avatar" style={{ width: "30px", height: "30px", borderRadius: "9px", background: user.color || "#ffb000", display: "grid", placeItems: "center", overflow: "hidden" }}>
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
                      width: "30px", 
                      height: "30px", 
                      borderRadius: "9px", 
                      background: user.color || (user.role === "Host" ? "#ffb000" : "#8b5cf6"), 
                      display: "grid", 
                      placeItems: "center", 
                      fontSize: "13px", 
                      fontWeight: "bold", 
                      color: "#fff"
                    }}
                  >
                    {user.name[0]?.toUpperCase()}
                  </span>
                )}
                {user.speaking && <div className="speaking-indicator" />}
              </div>

              {/* Column 2: User Info (Name & Role/Typing Status) */}
              <div className="user-info" style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                <strong style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </strong>
                <small style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: "600" }}>
                  {user.role}
                </small>
                {user.isTyping && user.currentFile && (
                  <span style={{ fontSize: "10px", color: "var(--primary-orange)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                    typing in {user.currentFile}...
                  </span>
                )}
              </div>

              {/* Bottom Row (Full Width): User Actions / Status */}
              <div className="user-actions" style={{ 
                gridColumn: "1 / -1", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                width: "100%",
                marginTop: "6px",
                paddingTop: "6px",
                borderTop: "1px solid rgba(255,255,255,0.03)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                  <span className={`mic-status-icon ${user.mic ? "on" : "off"}`}>
                    {user.mic ? <Mic size={12} style={{ color: "var(--primary-orange)" }} /> : <MicOff size={12} style={{ opacity: 0.3 }} />}
                  </span>
                </div>

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
                          bottom: "28px",
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
                padding: "8px 0 0 0",
                marginTop: "4px",
                borderTop: "1px solid rgba(255,255,255,0.03)"
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
    </aside>
  );
}
