import { Code2, LogOut, Mic, MicOff, Users, X, BookOpen, Info, StickyNote, Timer, Play, Square, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ room, users, files, runFile, setRunFile, micOn, permissions, onMic, actions, onLeaveRequest, onToggleProblem, onShowInfo, onShowNotes, timer }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [customMin, setCustomMin] = useState(25);
  const [customSec, setCustomSec] = useState(0);

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
    <header className="topbar" style={{ height: "52px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--glass-border)", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      {/* Brand logo & Problem Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
        <div 
          onClick={onLeaveRequest} 
          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", userSelect: "none", flexShrink: 0 }}
        >
          <Code2 size={20} style={{ color: "var(--primary-orange)" }} />
          <span style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>
            Codefora
          </span>
        </div>

        {/* Separator Line */}
        <div style={{ width: "1px", height: "20px", background: "var(--glass-border)", flexShrink: 0 }} />

        {/* Room details */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }}>
              {room?.name || "Room"}
            </h1>
            {(room?.problemId || (room?.name && room.name.includes("Problem Room:"))) && (
              <button 
                onClick={onToggleProblem}
                style={{ 
                  background: "rgba(249, 115, 22, 0.15)", 
                  color: "var(--primary-orange)",
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0
                }}
              >
                <BookOpen size={10} /> 
                <span>View Problem</span>
              </button>
            )}
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
          padding: "4px 12px",
          borderRadius: "6px",
          border: "1px solid var(--glass-border)",
          fontFamily: '"Cascadia Code", "Fira Code", monospace',
          flexShrink: 0,
          margin: "0 12px"
        }}
      >
        <Timer size={13} style={{ color: "var(--primary-orange)" }} />
        {timer.isRunning ? (
          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#fff", minWidth: "36px", textAlign: "center" }}>
            {timeLeft}
          </span>
        ) : permissions.isHost ? (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <input 
              type="text" 
              inputMode="numeric"
              value={customMin} 
              onChange={(e) => setCustomMin(Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0))}
              style={{ width: "20px", background: "none", border: "none", color: "#fff", fontSize: "12px", textAlign: "center", outline: "none", fontWeight: "bold" }}
            />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>:</span>
            <input 
              type="text" 
              inputMode="numeric"
              value={customSec.toString().padStart(2, '0')} 
              onChange={(e) => setCustomSec(Math.max(0, Math.min(59, parseInt(e.target.value.replace(/\D/g, '')) || 0)))}
              style={{ width: "20px", background: "none", border: "none", color: "#fff", fontSize: "12px", textAlign: "center", outline: "none", fontWeight: "bold" }}
            />
            <button 
              onClick={() => actions.startTimer(customMin * 60 + customSec)}
              style={{ background: "none", border: "none", color: "var(--success)", cursor: "pointer", padding: "0 0 0 6px" }}
              title="Start Timer"
            >
              <Play size={10} fill="var(--success)" />
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
            borderRadius: "15px",
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
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
          title="Scratchpad Notes"
        >
          <StickyNote size={12} />
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
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            color: "var(--text-muted)",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <Info size={12} />
          <span>Guide</span>
        </button>

        {/* Leave Room Pill */}
        <button
          onClick={onLeaveRequest}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "30px",
            padding: "0 12px",
            borderRadius: "15px",
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
            onClick={actions.endRoom}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "30px",
              padding: "0 12px",
              borderRadius: "15px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "11px",
              fontWeight: "bold",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <X size={12} />
            <span>End Room</span>
          </button>
        )}
      </div>
    </header>
  );
}
