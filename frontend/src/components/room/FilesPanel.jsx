import { FileCode2, Plus, X, Upload, Download, FileJson, FileText, Code2, Sparkles, FolderPlus, Layers } from "lucide-react";
import JSZip from "jszip";

export const PROJECT_TEMPLATES = [
  {
    id: "react-app",
    name: "React + Tailwind App",
    description: "Interactive React 18 component with Tailwind styling & live state",
    badge: "Frontend",
    files: [
      {
        name: "index.html",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Workspace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen">
    <div id="root"></div>
    <script type="text/babel" src="./App.jsx"></script>
  </body>
</html>`
      },
      {
        name: "App.jsx",
        language: "javascript",
        code: `function App() {
  const [count, setCount] = React.useState(0);
  const [tasks, setTasks] = React.useState([
    { id: 1, title: "Collaborate in real-time with team", done: true },
    { id: 2, title: "Test live React components & UI", done: false },
    { id: 3, title: "Export complete project as ZIP", done: false }
  ]);
  const [newTitle, setNewTitle] = React.useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTitle.trim(), done: false }]);
    setNewTitle("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            Codefora Collaborative App
          </h1>
          <p className="text-slate-400 text-xs mt-1">Multi-file Real-time Project Sandbox</p>
        </div>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-sm transition shadow-lg shadow-orange-500/20"
        >
          Clicks: {count}
        </button>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          placeholder="Add a new feature / task..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold text-white transition">
          Add
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={\`p-3 rounded-lg flex items-center justify-between cursor-pointer border transition \${task.done ? 'bg-slate-950/60 border-slate-800 text-slate-500 line-through' : 'bg-slate-950 border-slate-800/80 text-slate-200 hover:border-slate-700'}\`}
          >
            <div className="flex items-center gap-3">
              <span className={\`w-4 h-4 rounded flex items-center justify-center text-xs font-bold \${task.done ? 'bg-emerald-500/20 text-emerald-400' : 'border border-slate-600'}\`}>
                {task.done ? "✓" : ""}
              </span>
              <span className="text-sm">{task.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
      },
      {
        name: "style.css",
        language: "css",
        code: `/* Project Styles */
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}`
      }
    ]
  },
  {
    id: "node-express",
    name: "Node / Express API",
    description: "Backend REST service with API routes, JSON handlers, and CORS",
    badge: "Backend",
    files: [
      {
        name: "server.js",
        language: "javascript",
        code: `import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/collaborators", (req, res) => {
  res.json([
    { id: 1, name: "Alice", role: "Frontend Lead" },
    { id: 2, name: "Bob", role: "Backend Architect" }
  ]);
});

app.listen(PORT, () => {
  console.log(\`[Codefora API] Server listening on port \${PORT}\`);
});`
      },
      {
        name: "package.json",
        language: "json",
        code: `{
  "name": "codefora-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5"
  }
}`
      }
    ]
  },
  {
    id: "fullstack-vanilla",
    name: "HTML5 / Canvas App",
    description: "Vanilla JavaScript application with interactive canvas graphics",
    badge: "Fullstack",
    files: [
      {
        name: "index.html",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Codefora Interactive Sandbox</h1>
    <p>Live collaborative application builder</p>
    <button id="counterBtn">Click Count: 0</button>
  </div>
  <script src="app.js"></script>
</body>
</html>`
      },
      {
        name: "style.css",
        language: "css",
        code: `body {
  background: #090d16;
  color: #f8fafc;
  font-family: system-ui, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}
.container {
  background: #111827;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid #1f2937;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
button {
  background: #f97316;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: transform 0.1s, background 0.2s;
}
button:hover {
  background: #ea580c;
  transform: scale(1.03);
}`
      },
      {
        name: "app.js",
        language: "javascript",
        code: `let count = 0;
const btn = document.getElementById('counterBtn');

btn.addEventListener('click', () => {
  count++;
  btn.textContent = \`Click Count: \${count}\`;
  console.log('User interacted with app:', { count, timestamp: Date.now() });
});`
      }
    ]
  }
];

const FILE_TYPES = [
  { label: "React / JSX (.jsx)", language: "javascript", extension: ".jsx" },
  { label: "JavaScript (.js)", language: "javascript", extension: ".js" },
  { label: "TypeScript (.ts)", language: "typescript", extension: ".ts" },
  { label: "TypeScript React (.tsx)", language: "typescript", extension: ".tsx" },
  { label: "HTML (.html)", language: "html", extension: ".html" },
  { label: "CSS (.css)", language: "css", extension: ".css" },
  { label: "JSON (.json)", language: "json", extension: ".json" },
  { label: "Markdown (.md)", language: "markdown", extension: ".md" },
  { label: "Python (.py)", language: "python", extension: ".py" },
  { label: "Java (.java)", language: "java", extension: ".java" },
  { label: "C++ (.cpp)", language: "cpp", extension: ".cpp" },
  { label: "C (.c)", language: "c", extension: ".c" },
  { label: "C# (.cs)", language: "csharp", extension: ".cs" },
  { label: "Go (.go)", language: "go", extension: ".go" },
  { label: "Rust (.rs)", language: "rust", extension: ".rs" },
  { label: "SQL (.sql)", language: "sql", extension: ".sql" }
];

export const BOILERPLATES = {
  javascript: "function solution() {\n  // write your code here\n}\n\nconsole.log(solution());",
  typescript: "function solution(): void {\n  // write your code here\n}\n\nconsole.log(solution());",
  python: "import sys\nimport math\nfrom collections import defaultdict, deque\n\ndef solution():\n    # write your code here\n    pass\n\nif __name__ == '__main__':\n    solution()",
  java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}",
  c: "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <math.h>\n\nint main() {\n    // write your code here\n    return 0;\n}",
  cpp: "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <map>\n#include <set>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    // write your code here\n    return 0;\n}",
  csharp: "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\n\nclass Program {\n    static void Main() {\n        // write your code here\n    }\n}",
  go: "package main\n\nimport (\n\t\"fmt\"\n\t\"math\"\n\t\"strings\"\n)\n\nfunc main() {\n    // write your code here\n}",
  rust: "use std::io;\nuse std::collections::{HashMap, HashSet};\nuse std::cmp;\n\nfn main() {\n    // write your code here\n}",
  php: "<?php\n// write your code here\n?>",
  sql: "-- write your sql here",
  html: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n</head>\n<body>\n    <div id=\"root\"></div>\n</body>\n</html>",
  css: "/* write your css here */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: sans-serif;\n}",
  json: "{\n  \"name\": \"project\",\n  \"version\": \"1.0.0\"\n}",
  markdown: "# Project README\n\nCollaborative application project built with Codefora."
};

export function FilesPanel({ 
  roomId, 
  files, 
  activeFile, 
  activeName, 
  setActiveName, 
  permissions, 
  onCreateFile, 
  onExpectActiveName, 
  onDeleteFile
}) {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState(FILE_TYPES[0].language);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  function getFileIcon(filename) {
    if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) return <Code2 size={16} color="#61dafb" />;
    if (filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode2 size={16} color="#facc15" />;
    if (filename.endsWith('.py')) return <FileCode2 size={16} color="#3b82f6" />;
    if (filename.endsWith('.html')) return <Code2 size={16} color="#f97316" />;
    if (filename.endsWith('.css')) return <FileCode2 size={16} color="#06b6d4" />;
    if (filename.endsWith('.json')) return <FileJson size={16} color="#a855f7" />;
    return <FileText size={16} color="#94a3b8" />;
  }

  function handleLoadTemplate(template) {
    if (!permissions.canEdit) return;
    template.files.forEach((file, index) => {
      onCreateFile(file.name, file.language, file.code);
      if (index === 0 && onExpectActiveName) {
        onExpectActiveName(file.name);
      }
    });
    setShowTemplatesModal(false);
  }

  function createFile() {
    const isNewFileContext = newFileName.trim().length > 0;
    const cleanName = newFileName.trim();
    if (!cleanName) return;
    
    let determinedLanguage = isNewFileContext ? newFileType : (activeFile?.language || newFileType || "javascript");
    
    if (cleanName.includes(".")) {
      const ext = "." + cleanName.split(".").pop();
      const typeMatch = FILE_TYPES.find(t => t.extension === ext);
      if (typeMatch) {
        determinedLanguage = typeMatch.language;
      }
    }
    
    const selectedType = FILE_TYPES.find((type) => type.language === determinedLanguage) || FILE_TYPES[0];
    const fileName = cleanName.includes(".") ? cleanName : `${cleanName}${selectedType.extension}`;
    const boilerplate = BOILERPLATES[selectedType.language] || "";
    onCreateFile(fileName, selectedType.language, boilerplate);
    if (onExpectActiveName) onExpectActiveName(fileName);
    setNewFileName("");
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let fileName = file.name || "imported-file";
        const ext = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
        const typeMatch = FILE_TYPES.find(t => t.extension === ext);
        
        let attempt = 1;
        let baseName = ext ? fileName.replace(ext, "") : fileName;
        while (files.some(f => f.name === fileName)) {
          fileName = `${baseName}-${attempt}${ext}`;
          attempt++;
        }

        onCreateFile(fileName, typeMatch?.language || "javascript", content);
        if (onExpectActiveName) onExpectActiveName(fileName);
      } catch (err) {
        console.error("Failed to parse or create imported file", err);
      }
    };
    reader.onloadend = () => {
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  async function handleExport() {
    if (files.length === 0) return;
    setIsExporting(true);
    try {
      if (files.length === 1) {
        const file = files[0];
        const blob = new Blob([file.code || ""], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const zip = new JSZip();
        files.forEach(file => {
          zip.file(file.name, file.code || "");
        });
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codefora_project_${roomId || "app"}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingRight: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Files & Project</h3>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {permissions.canEdit && (
            <button 
              onClick={() => setShowTemplatesModal(true)}
              title="Project Templates"
              style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}
            >
              <Sparkles size={13} />
              <span>Templates</span>
            </button>
          )}
          {permissions.canEdit && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Import File"
              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}
            >
              <Upload size={14} />
            </button>
          )}
          <button 
            onClick={handleExport}
            title="Export Project (ZIP)"
            disabled={isExporting}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px', opacity: isExporting ? 0.5 : 1 }}
          >
            <Download size={14} />
          </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />
        </div>
      </div>

      {permissions.canEdit && (
        <div style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              placeholder="New file (e.g. App.jsx, api.js)..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createFile(); }}
              style={{
                flex: 1,
                background: '#121822',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px',
                padding: '6px 8px',
                outline: 'none',
                minWidth: 0
              }}
            />
            <button
              onClick={createFile}
              disabled={!newFileName.trim()}
              title="Create new file"
              style={{
                background: 'var(--primary-orange)',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                width: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: newFileName.trim() ? 1 : 0.5
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          {newFileName.trim() && (
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              style={{
                background: '#121822',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '12px',
                padding: '6px 8px',
                outline: 'none',
                width: '100%'
              }}
            >
              {FILE_TYPES.map(t => <option key={t.extension} value={t.language}>{t.label}</option>)}
            </select>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {files.map(file => (
          <div 
            key={file.name}
            onClick={() => setActiveName(file.name)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '6px 10px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              background: activeName === file.name ? 'rgba(255, 122, 24, 0.1)' : 'transparent',
              border: activeName === file.name ? '1px solid rgba(255, 122, 24, 0.2)' : '1px solid transparent',
              color: activeName === file.name ? '#fff' : 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
              {getFileIcon(file.name)}
              <span style={{ fontSize: '13px', fontWeight: activeName === file.name ? '500' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
            </div>
            {activeName === file.name && files.length > 1 && permissions.canEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.name);
                }}
                title={`Delete ${file.name}`}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', borderRadius: '4px' }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#131b26',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#f97316" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Start from Project Template</h3>
              </div>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
              Choose a starter framework or architecture. This will add the scaffold files to your collaborative room.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PROJECT_TEMPLATES.map(tmpl => (
                <div 
                  key={tmpl.id}
                  onClick={() => handleLoadTemplate(tmpl)}
                  style={{
                    background: '#1a2434',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f97316';
                    e.currentTarget.style.background = '#212d40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = '#1a2434';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>{tmpl.name}</span>
                      <span style={{ fontSize: '10px', background: 'rgba(249, 115, 22, 0.2)', color: '#f97316', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{tmpl.badge}</span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>{tmpl.description}</p>
                    <div style={{ marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                      Files: {tmpl.files.map(f => f.name).join(', ')}
                    </div>
                  </div>
                  <button 
                    style={{
                      background: '#f97316',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
