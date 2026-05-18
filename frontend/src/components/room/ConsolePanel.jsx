import { Globe2, Loader2, Play, Terminal, Keyboard } from "lucide-react";
import { useState } from "react";

export function ConsolePanel({ 
  output, 
  preview, 
  style, 
  onResizeStart, 
  onClear, 
  files = [], 
  runFile, 
  setRunFile, 
  onRun, 
  isRunningCode, 
  isSubmittingCode, 
  onSubmit, 
  activeProblem, 
  canSubmit,
  stdin,
  setStdin 
}) {
  const [panelMode, setPanelMode] = useState("output");
  const [showInput, setShowInput] = useState(true); // Default to showing input side-by-side for better onboarding

  return (
    <section className="console-panel" style={style}>
      <div className="resize-handle" onMouseDown={onResizeStart} onDoubleClick={(event) => event.preventDefault()} aria-hidden="true" />
      <div className="console-panel-head">
        <div className="panel-tabs">
          <button 
            className={panelMode === "output" ? "active" : ""} 
            onClick={() => setPanelMode("output")}
          >
            <Terminal size={15} /> 
            <span>Console</span>
          </button>
          <button 
            className={panelMode === "preview" ? "active" : ""} 
            disabled={!preview.showPreview} 
            onClick={() => setPanelMode("preview")}
          >
            <Globe2 size={15} /> 
            <span>Web Preview</span>
          </button>
        </div>
        
        <div className="console-actions">
          <select
            className="run-file-select console-run-file"
            value={runFile}
            onChange={(event) => setRunFile(event.target.value)}
            aria-label="File to run"
          >
            {files.map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>

          {panelMode === "output" && (
            <button 
              className={`button compact console-run-btn ${showInput ? "active" : ""}`} 
              onClick={() => setShowInput(!showInput)}
              title="Toggle Custom Input (stdin)"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                borderColor: showInput ? 'var(--primary)' : 'var(--line)',
                background: showInput ? 'rgba(255, 122, 24, 0.1)' : 'transparent',
                color: showInput ? 'var(--primary)' : 'var(--text)'
              }}
            >
              <Keyboard size={14} />
              <span>Input</span>
            </button>
          )}

          <button className="button primary run-btn console-run-btn" onClick={onRun} disabled={isRunningCode || isSubmittingCode}>
            {isRunningCode ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            <span>{isRunningCode ? "Running..." : "Run Code"}</span>
          </button>
          
          {activeProblem && (
            <button 
              className="button success run-btn console-run-btn" 
              onClick={onSubmit} 
              disabled={isRunningCode || isSubmittingCode || !canSubmit}
              title={!canSubmit ? "Viewers cannot submit solutions" : "Submit solution against all test cases"}
            >
              {isSubmittingCode ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              <span>{isSubmittingCode ? "Submitting..." : "Submit"}</span>
            </button>
          )}

          <button className="button compact console-run-btn" onClick={onClear}>Clear</button>
        </div>
      </div>
      
      <div className="console-panel-content">
        {panelMode === "output" ? (
          showInput ? (
            <div className="console-split-container" style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
              <div className="console-input-half" style={{ width: '40%', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--console-bg)' }}>
                <div style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--line)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Custom Input (stdin)
                </div>
                <textarea 
                  style={{ 
                    flex: 1, 
                    background: 'transparent', 
                    color: 'var(--text)', 
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
              <div className="console-output-half" style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--text-muted)', borderBottom: '1px solid var(--line)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Output
                </div>
                <pre className="console-output" style={{ flex: 1, margin: 0, overflow: 'auto', border: 'none', height: 'auto', background: 'var(--console-bg)' }}>{output}</pre>
              </div>
            </div>
          ) : (
            <div className="console-container">
              <pre className="console-output">{output}</pre>
            </div>
          )
        ) : preview.showPreview ? (
          <div className="preview-container">
            <iframe 
              className="preview-iframe" 
              title="Web preview" 
              sandbox="allow-scripts" 
              srcDoc={preview.previewDoc} 
            />
          </div>
        ) : (
          <div className="console-output empty">
            <Globe2 size={40} className="text-muted opacity-20" />
            <p>No HTML file detected for preview.</p>
          </div>
        )}
      </div>
    </section>
  );
}
