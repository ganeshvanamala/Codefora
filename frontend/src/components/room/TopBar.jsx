import { Code2, LogOut, Mic, MicOff, Users, X, BookOpen, Info, StickyNote, Timer, Play, Square, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ room, users, files, runFile, setRunFile, micOn, permissions, onMic, actions, onLeaveRequest, onToggleProblem, onShowInfo, onShowNotes, timer }) {
  const [timeLeft, setTimeLeft] = useState("");

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
    <header className="topbar">
      <div className="room-heading">
        <button className="icon-button orange" onClick={onLeaveRequest} aria-label="Back to rooms" style={{ padding: 0, overflow: 'hidden' }}>
          <img src="/codefora.png" alt="Codefora" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>{room?.name || "Room"}</h1>
            {(room?.problemId || (room?.name && room.name.includes("Problem Room:"))) && (
              <button 
                className="button-pill-sm" 
                onClick={onToggleProblem}
                title="View Problem Description"
                style={{ 
                  background: '#f97316', 
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <BookOpen size={14} /> <span>View Problem</span>
              </button>
            )}
          </div>
          <span style={{ marginTop: '4px' }}>
            <Users size={14} /> {users.length} online — {permissions.me?.role || "Member"}
          </span>
        </div>

        {/* Pomodoro Timer */}
        <div className="pomodoro-timer" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          marginLeft: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timer.isRunning ? 'var(--primary-orange)' : 'var(--text-muted)' }}>
            <Timer size={16} className={timer.isRunning ? "animate-pulse" : ""} />
            <span style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold', minWidth: '50px' }}>
              {timer.isRunning ? timeLeft : "25:00"}
            </span>
          </div>
          
          {permissions.isHost && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {!timer.isRunning ? (
                <button 
                  className="button-icon-sm" 
                  onClick={() => actions.startTimer(25 * 60)}
                  title="Start Sprint (25m)"
                  style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', padding: '4px' }}
                >
                  <Play size={14} />
                </button>
              ) : (
                <button 
                  className="button-icon-sm" 
                  onClick={actions.stopTimer}
                  title="Stop Timer"
                  style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}
                >
                  <Square size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="top-actions">
        <button
          className="button compact secondary"
          onClick={onShowInfo}
          title="Room Information & Guide"
          style={{ width: '40px', padding: '0', justifyContent: 'center' }}
        >
          <Info size={18} />
        </button>

        <button
          className={`button compact ${micOn ? "primary mic-live" : "secondary"}`}
          disabled={!permissions.canSpeak}
          onClick={onMic}
          style={micOn ? { background: "#f97316", border: "none" } : {}}
        >
          {micOn ? <Mic size={16} style={{ color: "#000" }} /> : <MicOff size={16} />}
          <span style={micOn ? { color: "#000", fontWeight: "800" } : {}}>{micOn ? "Mic Live" : "Mic Off"}</span>
        </button>

        <button className="button compact secondary" onClick={onShowNotes} title="Rough Notes / Scratchpad">
          <StickyNote size={16} />
        </button>

        <button className="button compact secondary" onClick={onLeaveRequest}>
          <LogOut size={16} /> Leave
        </button>

        {permissions.isHost && (
          <button className="button compact danger" onClick={actions.endRoom}>
            <X size={16} /> End Lab
          </button>
        )}
      </div>
    </header>
  );
}
