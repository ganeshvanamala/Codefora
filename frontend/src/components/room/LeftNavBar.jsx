import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Users, StickyNote, Info, Settings, MessageSquare, ArrowLeft, FileCode2, Target, PanelLeftClose, PanelLeftOpen, Monitor, Timer, Square, LogOut, Lock, Unlock, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LeftNavBar({ 
  activeTab,
  micOn, 
  onToggleMic, 
  onLeave,
  onEndRoom,
  onShowFiles,
  onShowProblem,
  onShowUsers,
  onShowNotes,
  showPreviewButton,
  onShowFullPreview,
  onShowInfo,
  room,
  users,
  timer,
  permissions,
  actions
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [localMaxMembers, setLocalMaxMembers] = useState(room?.max || 7);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const settingsRef = useRef(null);

  // Timer logic
  const [timeLeft, setTimeLeft] = useState("");
  
  useEffect(() => {
    window.setTourToggleState = setIsTourRunning;
    return () => {
      delete window.setTourToggleState;
    }
  }, []);

  useEffect(() => {
    setLocalMaxMembers(room?.max || 7);
  }, [room?.max]);

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
    if (!timer?.isRunning || (!timer.endTime && !timer.startTime)) {
      setTimeLeft("");
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now();
      let diff = timer.mode === "stopwatch" ? now - timer.startTime : timer.endTime - now;
      if (timer.mode !== "stopwatch" && diff <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer?.isRunning, timer?.endTime, timer?.startTime, timer?.mode]);

  return (
    <div className={`left-nav-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="nav-logo-container">
        {isExpanded && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
            <img src="/codefora.png" alt="Codefora Logo" style={{ height: "24px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
            <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--primary-orange)", letterSpacing: "-0.02em" }}>Codefora</span>
          </div>
        )}
        {!isExpanded && (
          <img 
            src="/codefora.png" 
            alt="Codefora Logo" 
            onClick={() => setIsExpanded(true)} 
            title="Expand"
            style={{ cursor: "pointer", height: "24px", width: "auto", objectFit: "contain", borderRadius: "4px" }} 
          />
        )}
        {isExpanded && (
          <button onClick={() => setIsExpanded(false)} className="nav-expand-btn" title="Collapse">
            <PanelLeftClose size={20} />
          </button>
        )}
      </div>

      {timer?.isRunning && (
        <div className={`nav-timer-container ${timer.isRunning ? 'running' : ''}`} onClick={permissions?.isHost ? actions.stopTimer : undefined} title={permissions?.isHost ? "Stop Timer" : "Timer running"}>
          <Timer size={16} style={{ color: "var(--primary-orange)", flexShrink: 0 }} />
          <span className="nav-timer-text">{timeLeft}</span>
          {isExpanded && permissions?.isHost && (
             <Square size={12} fill="currentColor" style={{ color: "#ef4444", flexShrink: 0 }} />
          )}
        </div>
      )}

      <div className="nav-items-top">
        <button className={`nav-item ${!micOn ? 'mic-off' : ''}`} onClick={onToggleMic} title={micOn ? 'Mute Mic' : 'Unmute Mic'}>
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          <span>{micOn ? 'Mic On' : 'Mic Off'}</span>
        </button>
        <button className={`nav-item ${activeTab === 'files' ? 'active' : ''}`} onClick={onShowFiles} title="Explorer">
          <div className="icon-wrapper"><FileCode2 size={20} /></div>
          <span>Explorer</span>
        </button>
        <button className={`nav-item ${activeTab === 'problem' ? 'active' : ''}`} onClick={onShowProblem} title="Problem">
          <div className="icon-wrapper"><Target size={20} /></div>
          <span>Problem</span>
        </button>
        <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={onShowUsers} title="Users">
          <div className="icon-wrapper"><Users size={20} /></div>
          <span>Users</span>
        </button>
        <button className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={onShowNotes} title="Notes">
          <div className="icon-wrapper"><StickyNote size={20} /></div>
          <span>Notes</span>
        </button>
        {showPreviewButton && (
          <button className={`nav-item ${activeTab === 'preview' ? 'active' : ''}`} onClick={onShowFullPreview} title="Full Preview">
            <div className="icon-wrapper"><Monitor size={20} /></div>
            <span>Preview</span>
          </button>
        )}
      </div>

      <div className="nav-items-bottom">
        <button className="nav-item" onClick={onShowInfo} title="Information">
          <Info size={20} />
          <span>Info</span>
        </button>
        
        {/* Settings Dropdown/Popover */}
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }} ref={settingsRef}>
          <button className="nav-item" onClick={() => setShowSettings(!showSettings)} title="Settings" style={showSettings ? { background: "rgba(255,255,255,0.1)", color: "#fff" } : {}}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
          
          {showSettings && (
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "100%",
              marginLeft: "16px",
              width: "240px",
              background: "#0f172a",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
              padding: "16px",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              cursor: "default"
            }}>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#fff" }}>Room Settings</h3>
              
              {!permissions?.isHost ? (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--primary-orange)" }}>
                  Only the host can change these settings.
                </p>
              ) : null}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px", marginBottom: "4px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Clock Mode</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    disabled={!permissions?.isHost}
                    onClick={() => actions.setTimerMode("timer")}
                    style={{ flex: 1, padding: "6px", background: (!timer?.mode || timer.mode === "timer") ? "rgba(255, 145, 0, 0.2)" : "rgba(255,255,255,0.05)", border: (!timer?.mode || timer.mode === "timer") ? "1px solid var(--primary-orange)" : "1px solid rgba(255,255,255,0.1)", color: (!timer?.mode || timer.mode === "timer") ? "var(--primary-orange)" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions?.isHost ? "pointer" : "not-allowed" }}
                  >
                    Timer
                  </button>
                  <button 
                    disabled={!permissions?.isHost}
                    onClick={() => actions.setTimerMode("stopwatch")}
                    style={{ flex: 1, padding: "6px", background: timer?.mode === "stopwatch" ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)", border: timer?.mode === "stopwatch" ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)", color: timer?.mode === "stopwatch" ? "#3b82f6" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions?.isHost ? "pointer" : "not-allowed" }}
                  >
                    Stop Watch
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Visibility</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    disabled={!permissions?.isHost}
                    onClick={() => actions.updateRoomSettings({ visibility: "public" })}
                    style={{ flex: 1, padding: "6px", background: room?.visibility === "public" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)", border: room?.visibility === "public" ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: room?.visibility === "public" ? "#10b981" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions?.isHost ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Unlock size={12} /> Public
                  </button>
                  <button 
                    disabled={!permissions?.isHost}
                    onClick={() => actions.updateRoomSettings({ visibility: "private" })}
                    style={{ flex: 1, padding: "6px", background: room?.visibility === "private" ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.05)", border: room?.visibility === "private" ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)", color: room?.visibility === "private" ? "#ef4444" : "#fff", borderRadius: "4px", fontSize: "11px", cursor: permissions?.isHost ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Lock size={12} /> Private
                  </button>
                </div>
              </div>

              {room?.visibility === "private" && room?.inviteCode && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Invite Code</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--primary-orange)", flex: 1, letterSpacing: "1px", textAlign: "center" }}>
                      {room.inviteCode}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(room.inviteCode)}
                      style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "2px" }}
                      title="Copy Invite Code"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Max Capacity</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input 
                      type="range" 
                      className="custom-slider"
                      min={users?.length || 1} 
                      max="7" 
                      step="1"
                      value={localMaxMembers}
                      onChange={(e) => setLocalMaxMembers(parseInt(e.target.value))}
                      onMouseUp={() => actions.updateRoomSettings({ max: localMaxMembers })}
                      onTouchEnd={() => actions.updateRoomSettings({ max: localMaxMembers })}
                      disabled={!permissions?.isHost}
                      style={{ 
                        flex: 1, 
                        cursor: permissions?.isHost ? "pointer" : "not-allowed",
                        background: `linear-gradient(to right, var(--primary-orange) ${(users?.length || 1) >= 7 ? 100 : ((localMaxMembers - (users?.length || 1)) / (7 - (users?.length || 1))) * 100}%, rgba(255, 255, 255, 0.1) ${(users?.length || 1) >= 7 ? 100 : ((localMaxMembers - (users?.length || 1)) / (7 - (users?.length || 1))) * 100}%)`
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", minWidth: "20px" }}>{localMaxMembers}</span>
                </div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Current members: {users?.length || 0}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Anti-Cheat</label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: permissions?.isHost ? "pointer" : "not-allowed", fontSize: "12px", color: "#fff" }}>
                  <input
                    type="checkbox"
                    disabled={!permissions?.isHost}
                    checked={room?.allowAi !== false}
                    onChange={(e) => actions.updateRoomSettings({ allowAi: e.target.checked })}
                    style={{ margin: 0, width: "14px", height: "14px", cursor: permissions?.isHost ? "pointer" : "not-allowed" }}
                  />
                  Allow AI Usage
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: permissions?.isHost ? "pointer" : "not-allowed", fontSize: "12px", color: "#fff" }}>
                  <input
                    type="checkbox"
                    disabled={!permissions?.isHost}
                    checked={room?.allowCopyPaste !== false}
                    onChange={(e) => actions.updateRoomSettings({ allowCopyPaste: e.target.checked })}
                    style={{ margin: 0, width: "14px", height: "14px", cursor: permissions?.isHost ? "pointer" : "not-allowed" }}
                  />
                  Allow Copy & Paste
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", marginTop: "4px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Your Preferences</label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px", color: "#fff" }}>
                  <input
                    id="tour-toggle-checkbox"
                    type="checkbox"
                    checked={isTourRunning}
                    onChange={(e) => {
                      setIsTourRunning(e.target.checked);
                      if (e.target.checked) {
                        window.dispatchEvent(new Event('manual-start-tour'));
                      } else {
                        window.dispatchEvent(new Event('manual-stop-tour'));
                      }
                    }}
                    style={{ margin: 0, width: "14px", height: "14px", cursor: "pointer" }}
                  />
                  Room Tour Guide
                </label>
              </div>
            </div>
          )}
        </div>

        {permissions?.isHost && (
          <button className="nav-item" onClick={onEndRoom} title="End Room" style={{ color: '#ef4444', background: "rgba(239, 68, 68, 0.1)" }}>
            <LogOut size={20} style={{ transform: "rotate(180deg)" }} />
            <span>End Room</span>
          </button>
        )}
        <button className="nav-item leave-btn" onClick={onLeave} title="Leave Room">
          <ArrowLeft size={20} />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}
