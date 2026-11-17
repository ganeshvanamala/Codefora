import { Globe2, Loader2, Play, Terminal, Keyboard, PanelLeftClose, Monitor, Bug, Trash2, Send, TerminalSquare, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { withChallengePolicy } from '../../lib/preview';

export function ConsolePanel({ 
  output, 
  preview, 
  style, 
  onResizeStart, 
  onClear, 
  isRunningCode, 
  isSubmittingCode, 
  onSubmit, 
  activeProblem, 
  canSubmit,
  stdin,
  setStdin,
  panelMode: externalPanelMode,
  setPanelMode: externalSetPanelMode,
  onOpenSplitPreview,
  onOpenFullPreview,
  onClose
}) {
  const [localPanelMode, setLocalPanelMode] = useState("output");
  const panelMode = externalPanelMode !== undefined ? externalPanelMode : localPanelMode;
  const setPanelMode = externalSetPanelMode || setLocalPanelMode;
  const [showInput, setShowInput] = useState(true);
  
  // DevTools Console state
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [logFilter, setLogFilter] = useState("all");
  const [replInput, setReplInput] = useState("");
  const logsEndRef = useRef(null);
  const iframeRef = useRef(null);

  // Listen for console messages from iframe preview
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CODEFORA_CONSOLE_MESSAGE') {
        setConsoleLogs((prev) => [
          ...prev.slice(-199),
          {
            id: Date.now() + Math.random(),
            level: event.data.level || 'log',
            message: event.data.message || '',
            timestamp: event.data.timestamp || new Date().toLocaleTimeString()
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Scroll to bottom of logs on new entry
  useEffect(() => {
    if (panelMode === "devtools" && logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [consoleLogs, panelMode]);

  const handleClearLogs = () => {
    setConsoleLogs([]);
    if (onClear) onClear();
  };

  const handleReplSubmit = (e) => {
    e.preventDefault();
    if (!replInput.trim()) return;
    
    const command = replInput.trim();
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        level: 'command',
        message: `> ${command}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setReplInput("");

    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Execute inside iframe context
        const result = iframeRef.current.contentWindow.eval(command);
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            level: 'result',
            message: result !== undefined ? (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)) : 'undefined',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        // Fallback execute
        // eslint-disable-next-line no-eval
        const result = eval(command);
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            level: 'result',
            message: result !== undefined ? String(result) : 'undefined',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
    } catch (err) {
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          level: 'error',
          message: `Uncaught ${err.name}: ${err.message}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }
  };

  const filteredLogs = consoleLogs.filter((item) => {
    if (logFilter === "errors") return item.level === "error";
    if (logFilter === "warnings") return item.level === "warn";
    if (logFilter === "info") return item.level === "info" || item.level === "log";
    return true;
  });

  const renderFormattedOutput = (rawOutput) => {
    if (!rawOutput) return <span style={{ color: 'var(--text-muted)' }}>Ready.</span>;
    const lines = rawOutput.split('\n');
    return lines.map((line, idx) => {
      const isStatus = line.toLowerCase().includes('status:');
      const isExecTime = line.toLowerCase().includes('execution time:');
      const isSuccessVal = !isStatus && !isExecTime && line.trim() !== "";
      
      if (isStatus) {
        return (
          <div key={idx} style={{ color: '#10b981', fontWeight: 'bold', marginTop: '8px', fontSize: '12px' }}>
            {line}
          </div>
        );
      }
      if (isExecTime) {
        return (
          <div key={idx} style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
            {line}
          </div>
        );
      }
      return (
        <div key={idx} style={{ color: isSuccessVal ? '#10b981' : '#fff', fontSize: isSuccessVal ? '18px' : '13px', fontWeight: isSuccessVal ? 'bold' : 'normal', fontFamily: 'monospace' }}>
          {line}
        </div>
      );
    });
  };

  const getLogBadge = (level) => {
    switch (level) {
      case 'error':
        return <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={13} /> error</span>;
      case 'warn':
        return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={13} /> warn</span>;
      case 'info':
        return <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}><Info size={13} /> info</span>;
      case 'command':
        return <span style={{ color: '#a855f7', fontWeight: 'bold' }}>eval</span>;
      case 'result':
        return <span style={{ color: '#10b981' }}>&lt;</span>;
      default:
        return <span style={{ color: '#94a3b8' }}>log</span>;
    }
  };

  return (
    <section className="console-panel tour-console" style={style}>
      <div className="resize-handle" onMouseDown={onResizeStart} onDoubleClick={(event) => event.preventDefault()} aria-hidden="true" />
      <div className="console-panel-head">
        <div className="panel-tabs">
          <button 
            className={panelMode === "output" ? "active" : ""} 
            onClick={() => setPanelMode("output")}
            title="Standard Runner & Stdin"
          >
            <Terminal size={15} /> 
            <span>Runner</span>
          </button>

          <button 
            className={panelMode === "devtools" ? "active" : ""} 
            onClick={() => setPanelMode("devtools")}
            title="Live Browser DevTools Console & REPL"
            style={{ position: 'relative' }}
          >
            <Bug size={15} /> 
            <span>Console</span>
            {consoleLogs.some(l => l.level === 'error') && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', position: 'absolute', top: '8px', right: '6px' }} />
            )}
          </button>

          {preview && (
            <button 
              className={`${panelMode === "preview" ? "active" : ""} tour-web-preview`} 
              onClick={() => setPanelMode("preview")}
            >
              <Globe2 size={15} /> 
              <span>Web Preview</span>
            </button>
          )}
        </div>
        
        <div className="console-actions">
          {panelMode === "output" && (
            <button 
              className={`button compact console-run-btn ${showInput ? "active" : ""}`} 
              onClick={() => setShowInput(!showInput)}
              title="Toggle Custom Input (stdin)"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                height: '30px',
                borderRadius: '6px',
                border: '1px solid var(--primary-orange)',
                background: 'transparent',
                color: 'var(--primary-orange)',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '0 12px'
              }}
            >
              <Keyboard size={14} style={{ color: 'var(--primary-orange)' }} />
              <span>Input</span>
            </button>
          )}

          {panelMode === "devtools" && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginRight: '8px' }}>
              {["all", "info", "warnings", "errors"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  style={{
                    background: logFilter === filter ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: logFilter === filter ? '#fff' : '#94a3b8',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
          
          {activeProblem && (
            <button 
              className="button secondary console-run-btn" 
              onClick={onSubmit} 
              disabled={isRunningCode || isSubmittingCode || !canSubmit}
              title={!canSubmit ? "Viewers cannot submit solutions" : "Submit solution against all test cases"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '30px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontWeight: '500',
                fontSize: '12px',
                cursor: (isRunningCode || isSubmittingCode || !canSubmit) ? 'not-allowed' : 'pointer',
                padding: '0 12px',
                opacity: (isRunningCode || isSubmittingCode || !canSubmit) ? 0.6 : 1
              }}
            >
              {isSubmittingCode ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              <span>{isSubmittingCode ? "Submitting..." : "Submit"}</span>
            </button>
          )}

          {panelMode === "preview" && onOpenSplitPreview && (
            <button 
              className="button secondary console-run-btn mobile-hidden" 
              onClick={onOpenSplitPreview}
              title="Open Split View"
              style={{
                height: '30px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '0 12px'
              }}
            >
              <PanelLeftClose size={14} />
              <span>Split Screen</span>
            </button>
          )}

          {panelMode === "preview" && onOpenFullPreview && (
            <button 
              className="button secondary console-run-btn mobile-hidden" 
              onClick={onOpenFullPreview}
              title="Open Full Screen"
              style={{
                height: '30px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '0 12px'
              }}
            >
              <Monitor size={14} />
              <span>Full Screen</span>
            </button>
          )}

          <button 
            className="button secondary console-run-btn" 
            onClick={panelMode === "devtools" ? handleClearLogs : onClear}
            style={{
              height: '30px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontWeight: '500',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
          
          {onClose && (
            <button 
              onClick={onClose}
              style={{
                height: '30px',
                width: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: '8px'
              }}
              title="Close Console"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="console-panel-content">
        {panelMode === "output" ? (
          showInput ? (
            <div className="console-split-container" style={{ display: 'flex', height: '100%', width: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
              <div className="console-input-half" style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Custom Input (stdin)
                </div>
                <div style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', display: 'flex', minHeight: 0 }}>
                  <textarea 
                    style={{ 
                      flex: 1, 
                      background: 'transparent', 
                      color: '#fff', 
                      border: 'none', 
                      resize: 'none', 
                      padding: '12px', 
                      fontFamily: '"Cascadia Code", "Fira Code", monospace',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      outline: 'none'
                    }}
                    value={stdin || ""}
                    onChange={(e) => setStdin?.(e.target.value)}
                    placeholder="Type or paste sample inputs here..."
                  />
                </div>
              </div>
              <div className="console-output-half" style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Output
                </div>
                <div style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px', overflowY: 'auto', boxSizing: 'border-box', minHeight: 0 }}>
                  {renderFormattedOutput(output)}
                </div>
              </div>
            </div>
          ) : (
            <div className="console-container" style={{ padding: '16px', height: '100%', boxSizing: 'border-box', overflowY: 'auto', minHeight: 0 }}>
              {renderFormattedOutput(output)}
            </div>
          )
        ) : panelMode === "devtools" ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxSizing: 'border-box' }}>
            <div 
              ref={logsEndRef}
              style={{ 
                flex: 1, 
                padding: '12px 16px', 
                overflowY: 'auto', 
                fontFamily: '"Cascadia Code", "Fira Code", monospace', 
                fontSize: '12px', 
                lineHeight: '1.6',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {filteredLogs.length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', padding: '12px 0' }}>
                  Console ready. Logs, errors, and warnings from your preview application will appear here live.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '8px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: log.level === 'error' ? 'rgba(239, 68, 68, 0.1)' : log.level === 'warn' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      borderLeft: log.level === 'error' ? '3px solid #ef4444' : log.level === 'warn' ? '3px solid #f59e0b' : '3px solid transparent'
                    }}
                  >
                    <span style={{ color: '#64748b', fontSize: '10px', minWidth: '55px', marginTop: '2px' }}>{log.timestamp}</span>
                    <span style={{ minWidth: '45px', fontSize: '11px', fontWeight: 'bold' }}>{getLogBadge(log.level)}</span>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: log.level === 'error' ? '#fca5a5' : log.level === 'warn' ? '#fde68a' : '#f8fafc', flex: 1, fontFamily: 'inherit' }}>
                      {log.message}
                    </pre>
                  </div>
                ))
              )}
            </div>

            {/* Live Interactive REPL Input */}
            <form 
              onSubmit={handleReplSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            >
              <span style={{ color: '#f97316', fontWeight: 'bold', fontFamily: 'monospace' }}>&gt;</span>
              <input 
                type="text"
                value={replInput}
                onChange={(e) => setReplInput(e.target.value)}
                placeholder="Evaluate JavaScript expression in live app context..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontFamily: '"Cascadia Code", "Fira Code", monospace',
                  fontSize: '12px'
                }}
              />
              <button
                type="submit"
                disabled={!replInput.trim()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: replInput.trim() ? '#f97316' : '#64748b',
                  cursor: replInput.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        ) : preview?.showPreview ? (
          <div className="preview-container" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <iframe
              ref={iframeRef}
              className="preview-iframe"
              title="Web preview"
              sandbox={preview.challengeMode ? '' : 'allow-scripts allow-modals allow-popups allow-forms allow-same-origin'}
              srcDoc={preview.challengeMode ? withChallengePolicy(preview.previewDoc) : preview.previewDoc}
              style={{ width: preview.challengeMode ? 800 : '100%', height: '100%', border: 'none' }}
            />
          </div>
        ) : (
          <div className="console-output empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <Globe2 size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>No previewable application files detected.</p>
            <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>Use the Templates button in Explorer to start a React or Web App.</p>
          </div>
        )}
      </div>
    </section>
  );
}

