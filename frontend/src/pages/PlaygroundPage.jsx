import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Save, Play, Code2, Layout, Terminal, Globe, ChevronRight } from 'lucide-react';
import Editor from "@monaco-editor/react";
import { Navbar } from "../components/Navbar";
import { ConsolePanel } from "../components/room/ConsolePanel";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { buildPreview } from "../lib/preview";
import { useTheme } from "../hooks/useTheme";

export function PlaygroundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [files, setFiles] = useState([
    { name: 'index.html', language: 'html', code: '<!-- HTML Playground -->\n<div class="hero">\n  <h1>Codefora Playground</h1>\n  <p>Start coding instantly.</p>\n</div>' },
    { name: 'styles.css', language: 'css', code: '.hero {\n  text-align: center;\n  padding: 50px;\n  background: #0f172a;\n  color: white;\n  border-radius: 12px;\n}' },
    { name: 'main.js', language: 'javascript', code: 'console.log("Hello from Playground!");' }
  ]);

  const [activeName, setActiveName] = useState('index.html');
  const [output, setOutput] = useState("Ready to code.");
  const [stdin, setStdin] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ y: 0, height: 300 });

  useEffect(() => {
    if (location.state?.initialFiles) {
      setFiles(location.state.initialFiles);
      if (location.state.initialFiles.length > 0) {
        setActiveName(location.state.initialFiles[0].name);
      }
    }
  }, [location.state]);

  const activeFile = files.find(f => f.name === activeName) || files[0];
  const previewDoc = buildPreview(files);

  const handleCodeChange = (value) => {
    setFiles(prev => prev.map(f => f.name === activeName ? { ...f, code: value } : f));
  };

  const handleRun = async () => {
    if (activeFile.language === 'html' || activeFile.language === 'css') {
      setOutput("Preview updated.");
      return;
    }
    
    setIsRunning(true);
    setOutput("Running...");
    try {
      const res = await api.runCode({
        language: activeFile.language === 'javascript' ? 'javascript' : activeFile.language,
        code: activeFile.code,
        input: stdin
      });
      setOutput(res.output || res.message || "Finished.");
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your work.");
      return;
    }
    setIsSaving(true);
    try {
      await api.saveWork(user.uid, {
        name: "Playground Project",
        files,
        type: "playground"
      });
      alert("Project saved to 'My Works'!");
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Resize logic
  useEffect(() => {
    const onMove = (e) => {
      if (isResizing) {
        const delta = e.clientY - resizeStart.current.y;
        setConsoleHeight(Math.max(100, Math.min(window.innerHeight - 150, resizeStart.current.height - delta)));
      }
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);

  return (
    <div className="playground-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#020817' }}>
      <Navbar />
      
      <div className="playground-header" style={{ 
        padding: '12px 24px', 
        background: 'rgba(15, 23, 42, 0.6)', 
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-orange)' }}>
            <Layout size={20} />
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Playground</h2>
          </div>
          <div className="file-tabs-mini" style={{ display: 'flex', gap: '4px' }}>
            {files.map(f => (
              <button 
                key={f.name}
                onClick={() => setActiveName(f.name)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: '1px solid var(--glass-border)',
                  background: activeName === f.name ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                  color: activeName === f.name ? 'var(--primary-orange)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="button primary compact" 
            onClick={handleRun} 
            disabled={isRunning}
            style={{ gap: '8px' }}
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Run
          </button>
          <button 
            className="button secondary compact" 
            onClick={handleSave}
            disabled={isSaving}
            style={{ gap: '8px' }}
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Work"}
          </button>
        </div>
      </div>

      <div className="playground-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          {/* Editor Section */}
          <div style={{ flex: 1, borderRight: '1px solid var(--glass-border)' }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={activeFile.language}
              value={activeFile.code}
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                lineHeight: 24,
                minimap: { enabled: false },
                wordWrap: 'on',
                padding: { top: 20 }
              }}
            />
          </div>

          {/* Preview Section */}
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <div style={{ padding: '8px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <Globe size={14} />
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Web Preview</span>
            </div>
            <iframe 
              srcDoc={previewDoc}
              title="preview"
              style={{ flex: 1, border: 'none', width: '100%' }}
            />
          </div>
        </div>

        {/* Console Section */}
        <div className="playground-console" style={{ height: `${consoleHeight}px`, borderTop: '2px solid var(--primary-orange)', background: '#010409', display: 'flex', flexDirection: 'column' }}>
          <div 
            className="console-resize-handle" 
            onMouseDown={(e) => {
              resizeStart.current = { y: e.clientY, height: consoleHeight };
              setIsResizing(true);
            }}
            style={{ height: '4px', cursor: 'row-resize', background: 'transparent' }}
          />
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', marginBottom: '12px', fontSize: '12px' }}>
               <Terminal size={14} />
               <span style={{ fontWeight: '700', textTransform: 'uppercase' }}>Output Console</span>
             </div>
             <pre style={{ margin: 0, color: '#e6edf3', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
               {output}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
