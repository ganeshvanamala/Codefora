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

          <button 
            className="button primary console-run-btn" 
            onClick={onRun} 
            disabled={isRunningCode || isSubmittingCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '30px',
              borderRadius: '6px',
              background: 'var(--primary-orange)',
              color: '#000',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: (isRunningCode || isSubmittingCode) ? 'not-allowed' : 'pointer',
              padding: '0 12px',
              opacity: (isRunningCode || isSubmittingCode) ? 0.6 : 1
            }}
          >
            {isRunningCode ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} style={{ color: '#000' }} />}
            <span>{isRunningCode ? "Running..." : "Run Code"}</span>
          </button>
          
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

          <button 
            className="button secondary console-run-btn" 
            onClick={onClear}
            style={{
              height: '30px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontWeight: '500',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '0 12px'
            }}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="console-panel-content">
        {panelMode === "output" ? (
          showInput ? (
            <div className="console-split-container" style={{ display: 'flex', height: '100%', width: '100%', gap: '16px', padding: '16px', boxSizing: 'border-box' }}>
              <div className="console-input-half" style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Custom Input (stdin)
                </div>
                <div style={{ flex: 1, background: '#070c14', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', display: 'flex' }}>
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
              <div className="console-output-half" style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Output
                </div>
                <div style={{ flex: 1, background: '#070c14', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '16px', overflowY: 'auto', boxSizing: 'border-box' }}>
                  {renderFormattedOutput(output)}
                </div>
              </div>
            </div>
          ) : (
            <div className="console-container" style={{ padding: '16px', height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
              {renderFormattedOutput(output)}
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
