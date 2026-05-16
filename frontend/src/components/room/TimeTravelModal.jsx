import React, { useState, useEffect } from 'react';
import { X, History, User, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Editor from "@monaco-editor/react";

export function TimeTravelModal({ isOpen, onClose, history, files: currentFiles }) {
  const [index, setIndex] = useState(0);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  useEffect(() => {
    if (history.length > 0) {
      setIndex(history.length - 1);
    }
  }, [history.length]);

  if (!isOpen) return null;

  const snapshots = history.length > 0 ? history : [
    { 
      timestamp: Date.now(), 
      user: "System", 
      files: currentFiles.map(f => ({ name: f.name, code: f.code })) 
    }
  ];

  const snapshot = snapshots[index];
  const files = snapshot.files || [];
  const activeFile = files[activeFileIndex] || files[0];

  const formatDate = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="profile-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="profile-modal-card time-travel-card" style={{ maxWidth: '900px', width: '95%', height: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div className="profile-modal-header" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="icon-circle orange">
              <History size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Time Travel History</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Explore how the code evolved over this session
              </p>
            </div>
          </div>
          <button onClick={onClose} className="profile-modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="time-travel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#020817', overflow: 'hidden' }}>
          {/* File Tabs for the snapshot */}
          <div className="file-tabs" style={{ background: 'rgba(255,255,255,0.02)', padding: '0 10px' }}>
            {files.map((file, i) => (
              <div 
                key={file.name} 
                className={`file-tab ${activeFileIndex === i ? "active" : ""}`}
                onClick={() => setActiveFileIndex(i)}
                style={{ height: '35px', fontSize: '12px' }}
              >
                <span>{file.name}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={activeFile?.name?.split('.').pop() === 'js' ? 'javascript' : 'cpp'}
              value={activeFile?.code || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 20,
                padding: { top: 10 }
              }}
            />
          </div>

          {/* Timeline Slider */}
          <div className="timeline-controls" style={{ 
            padding: '20px', 
            background: 'var(--bg-secondary)', 
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-orange)' }}>
                  <User size={14} />
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{snapshot.user}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span style={{ fontSize: '12px' }}>{formatDate(snapshot.timestamp)}</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Snapshot {index + 1} of {snapshots.length}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                className="button-icon-sm" 
                onClick={() => setIndex(Math.max(0, index - 1))}
                disabled={index === 0}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '50%', padding: '8px' }}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="range"
                  min="0"
                  max={snapshots.length - 1}
                  value={index}
                  onChange={(e) => setIndex(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '5px',
                    appearance: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                {/* Visual Ticks for snapshots */}
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: 0, 
                  right: 0, 
                  transform: 'translateY(-50%)',
                  display: 'flex', 
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                  padding: '0 8px'
                }}>
                  {snapshots.map((_, i) => (
                    <div key={i} style={{ 
                      width: '4px', 
                      height: '4px', 
                      borderRadius: '50%', 
                      background: i <= index ? 'var(--primary-orange)' : 'rgba(255,255,255,0.2)' 
                    }} />
                  ))}
                </div>
              </div>

              <button 
                className="button-icon-sm" 
                onClick={() => setIndex(Math.min(snapshots.length - 1, index + 1))}
                disabled={index === snapshots.length - 1}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '50%', padding: '8px' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
