import { Code2, LogOut, Mic, MicOff, Users, X, BookOpen, Info, StickyNote, Timer, Play, Square, RotateCcw, ExternalLink, Settings, Lock, Unlock } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function TopBar({ room, users, files, runFile, setRunFile, micOn, permissions, onMic, actions, onLeaveRequest, onToggleProblem, onShowInfo, onShowNotes, timer }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [customMin, setCustomMin] = useState(25);
  const [customSec, setCustomSec] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!timer.isRunning || !timer.endTime) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = timer.endTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.endTime]);

  return (
    <header className="topbar" style={{ height: "52px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--glass-border)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 1000 }}>
      {/* Brand logo & Problem Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
        <div 
          onClick={onLeaveRequest} 
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none", flexShrink: 0 }}
        >
          <img 
            src="/codefora.png" 
            alt="Codefora Logo" 
            style={{ height: "24px", width: "auto", objectFit: "contain", borderRadius: "4px" }} 
          />
          <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-orange)", letterSpacing: "-0.02em" }}>
            Codefora
          </span>
        </div>

        {/* Separator Line */}
        <div style={{ width: "1px", height: "24px", background: "var(--glass-border)", flexShrink: 0 }} />

        {/* Room details */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, gap: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
              {room?.name || "Room"}
            </h1>
            {(room?.problemId || (room?.name && room.name.includes("Problem Room:"))) && (
              <button 
                onClick={onToggleProblem}
                style={{ 
                  background: "var(--primary-orange)", 
                  color: "#fff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0
                }}
              >
                <ExternalLink size={12} /> 
                <span>View Problem</span>
              </button>
            )}
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {users.length} online • Host: {room?.hostName || "N/A"}
          </span>
        </div>
      </div>

      {/* Center Pomodoro Timer Badge */}
      <div 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "6px",
          background: "rgba(0, 0, 0, 0.25)",
          height: "26px",
          padding: "0 10px",
          boxSizing: "border-box",
          borderRadius: "6px",
          border: "1px solid var(--glass-border)",
          fontFamily: '"Cascadia Code", "Fira Code", monospace',
          flexShrink: 0,
          margin: "0 12px"
        }}
      >
        <Timer size={13} style={{ color: "var(--primary-orange)" }} />
        {timer.isRunning ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#fff", minWidth: "36px", textAlign: "center" }}>
              {timeLeft}
            </span>
            {permissions.isHost && (
              <button 
                onClick={() => actions.stopTimer()}
                style={{ 
                  background: "rgba(239, 68, 68, 0.15)", 
                  border: "1px solid rgba(239, 68, 68, 0.3)", 
                  borderRadius: "4px",
                  color: "#ef4444", 
                  cursor: "pointer", 
                  width: "18px",
                  height: "18px",
                  boxSizing: "border-box",
                  display: "grid", 
                  placeItems: "center",
                  padding: 0,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
                title="Stop Timer"
              >
                <Square size={6} fill="#ef4444" style={{ color: "#ef4444" }} />
              </button>
            )}
          </div>
        ) : permissions.isHost ? (
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <input 
              type="text" 
              inputMode="numeric"
              value={customMin} 
              onChange={(e) => setCustomMin(Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0))}
              style={{ 
                width: "22px", 
                height: "18px",
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid rgba(255, 255, 255, 0.12)", 
                borderRadius: "4px",
                color: "#fff", 
                fontSize: "11px", 
                textAlign: "center", 
                outline: "none", 
                fontWeight: "bold",
                padding: 0
              }}
              title="Minutes"
            />
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>:</span>
            <input 
              type="text" 
              inputMode="numeric"
              value={customSec.toString().padStart(2, '0')} 
              onChange={(e) => setCustomSec(Math.max(0, Math.min(59, parseInt(e.target.value.replace(/\D/g, '')) || 0)))}
              style={{ 
                width: "22px", 
                height: "18px",
                boxSizing: "border-box",
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid rgba(255, 255, 255, 0.12)", 
                borderRadius: "4px",
                color: "#fff", 
                fontSize: "11px", 
                textAlign: "center", 
                outline: "none", 
                fontWeight: "bold",
                padding: 0
              }}
              title="Seconds"
            />
            <button 
              onClick={() => actions.startTimer(customMin * 60 + customSec)}
              style={{ 
                background: "rgba(16, 185, 129, 0.15)", 
                border: "1px solid rgba(16, 185, 129, 0.3)", 
                borderRadius: "4px",
                color: "var(--success)", 
                cursor: "pointer", 
                width: "18px",
                height: "18px",
                boxSizing: "border-box",
                display: "grid",
                placeItems: "center",
                padding: 0,
                marginLeft: "3px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16, 185, 129, 0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)"}
              title="Start Timer"
            >
              <Play size={8} fill="var(--success)" style={{ color: "var(--success)" }} />
            </button>
          </div>
        ) : (
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)" }}>
            00:00
          </span>
        )}
      </div>

      {/* Right side Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {/* Mic Toggle pill */}
        <button
          onClick={onMic}
          disabled={!permissions.canSpeak}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 12px",
            borderRadius: "6px",
            background: micOn ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.04)",
            border: micOn ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
            color: micOn ? "#10b981" : "var(--text-muted)",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: permissions.canSpeak ? "pointer" : "not-allowed",
            outline: "none"
          }}
        >
          {micOn ? <Mic size={14} /> : <MicOff size={14} />}
          <span>{micOn ? "Mic On" : "Mic Off"}</span>
        </button>

        {/* Notes Toggle pill */}
        <button
          onClick={onShowNotes}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 12px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
          title="Rough Notes & Scratchpad"
        >
          <StickyNote size={14} />
          <span>Notes</span>
        </button>

        {/* Info Toggle pill */}
        <button
          onClick={onShowInfo}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 12px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
          title="Room Information"
        >
          <Info size={14} />
          <span>Info</span>
        </button>

        {/* Room Settings Pill */}
        <div style={{ position: "relative" }} ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "6px",
              background: showSettings ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.04)",
              border: showSettings ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.06)",
              color: "var(--text-muted)",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none"
            }}
            title="Room Settings"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
          
          {showSettings && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              width: "220px",
              background: "#0f172a",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              padding: "16px",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#fff" }}>Room Settings</h3>
              
              {!permissions.isHost ? (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--primary-orange)" }}>
                  Only the host can change these settings.
                </p>
              ) : null}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Visibility</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    disabled={!permissions.isHost}
                    onClick={() => actions.updateRoomSettings({ visibility: "public" })}
                    style={{ flex: 1, padding: "6px", background: room?.visibility === "public" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)", border: room?.visibility === "public" ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: room?.visibility === "public" ? "#10b981" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions.isHost ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Unlock size={12} /> Public
                  </button>
                  <button 
                    disabled={!permissions.isHost}
                    onClick={() => actions.updateRoomSettings({ visibility: "private" })}
                    style={{ flex: 1, padding: "6px", background: room?.visibility === "private" ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.05)", border: room?.visibility === "private" ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)", color: room?.visibility === "private" ? "#ef4444" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions.isHost ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Lock size={12} /> Private
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Max Capacity</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input 
                    type="range" 
                    min={users.length} 
                    max="7" 
                    step="1"
                    value={room?.max || 7}
                    onChange={(e) => actions.updateRoomSettings({ max: parseInt(e.target.value) })}
                    disabled={!permissions.isHost}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", minWidth: "20px" }}>{room?.max || 7}</span>
                </div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Current members: {users.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Leave Room Pill */}
        <button
          onClick={onLeaveRequest}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 12px",
            borderRadius: "6px",
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <LogOut size={12} />
          <span>Leave Room</span>
        </button>

        {/* End Room Pill */}
        {permissions.isHost && (
          <button
            onClick={() => actions.endRoom()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "6px",
              background: "#ef4444",
              border: "none",
              color: "#fff",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <LogOut size={12} style={{ transform: "rotate(180deg)" }} />
            <span>End Room</span>
          </button>
        )}
      </div>
    </header>
  );
}
