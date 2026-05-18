import Editor from "@monaco-editor/react";
import { Activity, Download, FileCode2, Plus, Upload, X, CheckCircle2, Save, AlignLeft, MoreHorizontal, Play, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { socket } from "../../lib/socket";
import JSZip from "jszip";

const FILE_TYPES = [
  { label: "JavaScript", language: "javascript", extension: ".js" },
  { label: "TypeScript", language: "typescript", extension: ".ts" },
  { label: "Python", language: "python", extension: ".py" },
  { label: "Java", language: "java", extension: ".java" },
  { label: "C", language: "c", extension: ".c" },
  { label: "C++", language: "cpp", extension: ".cpp" },
  { label: "C#", language: "csharp", extension: ".cs" },
  { label: "Go", language: "go", extension: ".go" },
  { label: "Rust", language: "rust", extension: ".rs" },
  { label: "PHP", language: "php", extension: ".php" },
  { label: "Ruby", language: "ruby", extension: ".rb" },
  { label: "Swift", language: "swift", extension: ".swift" },
  { label: "HTML", language: "html", extension: ".html" },
  { label: "CSS", language: "css", extension: ".css" },
  { label: "SQL", language: "sql", extension: ".sql" }
];

export function EditorPanel({ roomId, files, activeFile, activeName, setActiveName, users, typing, typingCursors, permissions, onChange, onCreateFile, onDeleteFile, onSaveWork, onRun, onSubmit, isRunningCode, isSubmittingCode, canSubmit }) {
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState(FILE_TYPES[0].language);
  const [pendingDeleteFile, setPendingDeleteFile] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [editorInstance, setEditorInstance] = useState(null);
  const [editorTick, setEditorTick] = useState(0);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const editorDisposables = useRef([]);
  const activeFileNameRef = useRef(activeFile?.name);
  const typingCursorsRef = useRef(typingCursors);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    typingCursorsRef.current = typingCursors;
  }, [typingCursors]);

  useEffect(() => {
    activeFileNameRef.current = activeFile?.name;
  }, [activeFile?.name]);

  function createFile() {
    const selectedType = FILE_TYPES.find((type) => type.language === newFileType) || FILE_TYPES[0];
    const cleanName = newFileName.trim();
    if (!cleanName) return;
    const fileName = cleanName.includes(".") ? cleanName : `${cleanName}${selectedType.extension}`;
    onCreateFile(fileName, selectedType.language);
    setNewFileName("");
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const fileName = file.name;
      // Infer language from extension
      const ext = `.${fileName.split('.').pop()}`;
      const typeMatch = FILE_TYPES.find(t => t.extension === ext);
      onCreateFile(fileName, typeMatch?.language || "javascript", content);
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset
  }

  async function handleExport() {
    if (selectedFiles.length === 0) return;
    setIsExporting(true);

    try {
      if (selectedFiles.length === 1) {
        // Single file download
        const fileName = selectedFiles[0];
        const file = files.find(f => f.name === fileName);
        if (file) {
          const blob = new Blob([file.code || ""], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // Multi-file ZIP
        const zip = new JSZip();
        selectedFiles.forEach(fileName => {
          const file = files.find(f => f.name === fileName);
          if (file) {
            zip.file(fileName, file.code || "");
          }
        });
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codefora_export_${roomId || "room"}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setShowExportModal(false);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleSaveWork() {
    if (!onSaveWork) return;
    setIsSaving(true);
    setSaveMessage("");
    const result = await onSaveWork(`Project in ${roomId}`);
    if (result.success) {
      setSaveMessage("Saved!");
    } else {
      setSaveMessage("Error");
      alert(result.error || "Failed to save work");
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  }

  function toggleFileSelection(fileName) {
    setSelectedFiles(prev => 
      prev.includes(fileName) ? prev.filter(f => f !== fileName) : [...prev, fileName]
    );
  }

  const otherUsers = users.filter((user) => user.socketId !== socket.id);

  useEffect(() => {
    return () => {
      editorDisposables.current.forEach((disposable) => disposable.dispose());
      editorDisposables.current = [];
    };
  }, []);

  useEffect(() => {
    if (!editorInstance) return;

    const refresh = () => setEditorTick((value) => value + 1);
    const currentFileName = activeFile?.name;

    const disposables = [
      editorInstance.onDidScrollChange(refresh),
      editorInstance.onDidLayoutChange(refresh),
      editorInstance.onDidChangeModelContent(() => {
        refresh();
        if (isRemoteUpdate.current) return;
        const position = editorInstance.getPosition();
        if (!position || !currentFileName) return;
        socket.emit("typing", {
          roomId,
          fileName: currentFileName,
          position: { lineNumber: position.lineNumber, column: position.column },
          isTyping: true
        });
      }),
      editorInstance.onDidChangeCursorPosition((event) => {
        refresh();
        if (isRemoteUpdate.current) return;
        if (currentFileName) {
          socket.emit("cursor:update", {
            roomId,
            fileName: currentFileName,
            position: { lineNumber: event.position.lineNumber, column: event.position.column },
            isTyping: false
          });
        }
      })
    ];

    editorDisposables.current.forEach((disposable) => disposable.dispose());
    editorDisposables.current = disposables;

    return () => {
      disposables.forEach((disposable) => disposable.dispose());
    };
  }, [editorInstance, activeFile?.name, roomId]);

  const visibleTypingCursors = typingCursors;
  
  // Watch for remote code updates and preserve cursor/scroll
  useEffect(() => {
    if (!editorInstance || !activeFile) return;
    
    const model = editorInstance.getModel();
    if (!model) return;

    const currentModelValue = model.getValue();
    const targetCode = activeFile.code || "";
    if (currentModelValue !== targetCode) {
      isRemoteUpdate.current = true;
      // Capture the exact state of the editor (cursor, selection, scroll)
      const viewState = editorInstance.saveViewState();
      
      // Apply the change
      // Use pushEditOperations to maintain undo history and markers
      model.pushEditOperations(
        [],
        [{
          range: model.getFullModelRange(),
          text: targetCode,
          forceMoveMarkers: true
        }],
        () => null
      );
      
      // Immediately restore the exact view state to prevent any jumping
      if (viewState) {
        editorInstance.restoreViewState(viewState);
      }
      
      // Delay resetting the flag slightly to allow Monaco events to process
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 50);
    }
  }, [activeFile?.code, activeFile?.name, editorInstance]);

  return (
    <section className="editor-panel">
      <div className="file-tabs">
        {files.map((file) => (
          <div className={`file-tab ${activeName === file.name ? "active" : ""}`} key={file.name}>
            <button
              className="file-tab-main"
              onClick={() => setActiveName(file.name)}
              type="button"
            >
              <FileCode2 size={14} />
              <span>{file.name}</span>
            </button>
            <button
              className="file-tab-close"
              type="button"
              disabled={!permissions.canEdit || files.length <= 1}
              onClick={() => setPendingDeleteFile(file.name)}
              aria-label={`Delete ${file.name}`}
              title="Delete file"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="collab-strip">
        <div className="typing-indicator" />
        <div className="cursor-tags">
          {otherUsers.slice(0, 3).map((user) => (
            <span
              style={{ "--tag": user.color || "#8be9fd" }}
              key={user.socketId}
              title={`${user.name} is online`}
            >
              {user.name}
            </span>
          ))}
          {otherUsers.length > 3 && <span className="more-users">+{otherUsers.length - 3}</span>}
        </div>
      </div>

      <div className="file-tools" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: '6px 12px',
        width: '100%',
        justifyContent: 'space-between',
        position: 'relative',
        background: '#0a0e17',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Left Side: Language Indicator Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="file-type-select"
            disabled={!permissions.canEdit}
            value={activeFile?.language || "javascript"}
            onChange={(event) => {
              // Map language selection
            }}
            style={{
              background: '#121822',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '12px',
              padding: '4px 10px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {FILE_TYPES.map((type) => (
              <option key={type.language} value={type.language}>
                {type.label === "Java" ? "Java (17)" : type.label === "Python" ? "Python (3)" : type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: Format, More, Run Code, Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Format Button */}
          <button 
            className="button compact secondary"
            style={{
              height: '30px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              padding: '0 12px'
            }}
            onClick={() => {
              if (editorInstance) {
                editorInstance.trigger('editor', 'editor.action.formatDocument');
              }
            }}
            title="Format Code"
          >
            <AlignLeft size={13} />
            <span>Format</span>
          </button>

          {/* More Menu Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              className="button compact secondary"
              style={{
                height: '30px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0 12px'
              }}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="More Actions"
            >
              <MoreHorizontal size={13} />
              <span>More</span>
            </button>

            {showMoreMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '36px',
                background: '#121822',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px',
                zIndex: 100,
                width: '220px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ padding: '2px 6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>File Operations</div>
                
                {/* Create File Section */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                  <input
                    disabled={!permissions.canEdit}
                    value={newFileName}
                    onChange={(event) => setNewFileName(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && createFile()}
                    placeholder="new-file.py"
                    style={{
                      flex: 1,
                      background: '#0a0e17',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '4px 6px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    disabled={!permissions.canEdit}
                    onClick={() => {
                      createFile();
                      setShowMoreMenu(false);
                    }}
                    style={{
                      background: 'var(--primary-orange)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#000',
                      padding: '0 8px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

                <button 
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowMoreMenu(false);
                  }}
                  disabled={!permissions.canEdit}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    padding: '6px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                >
                  <Upload size={12} />
                  <span>Import File</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImport} 
                />

                <button 
                  onClick={() => {
                    setSelectedFiles(files.map(f => f.name));
                    setShowExportModal(true);
                    setShowMoreMenu(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    padding: '6px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                >
                  <Download size={12} />
                  <span>Export Files</span>
                </button>

                <button 
                  onClick={() => {
                    handleSaveWork();
                    setShowMoreMenu(false);
                  }}
                  disabled={isSaving}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    padding: '6px 8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                >
                  <Save size={12} />
                  <span>{isSaving ? "Saving Workspace..." : saveMessage || "Save Workspace"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Run Code Button */}
          <button 
            className="button compact secondary"
            style={{
              height: '30px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: isRunningCode ? 'not-allowed' : 'pointer',
              padding: '0 12px',
              opacity: isRunningCode ? 0.6 : 1
            }}
            onClick={onRun}
            disabled={isRunningCode}
            title="Run Code"
          >
            <Play size={13} />
            <span>{isRunningCode ? "Running..." : "Run Code"}</span>
          </button>

          {/* Submit Button */}
          <button 
            className="button compact"
            style={{
              height: '30px',
              borderRadius: '6px',
              background: 'var(--primary-orange)',
              border: 'none',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: (!canSubmit || isSubmittingCode) ? 'not-allowed' : 'pointer',
              padding: '0 14px',
              opacity: isSubmittingCode ? 0.6 : 1
            }}
            onClick={onSubmit}
            disabled={!canSubmit || isSubmittingCode}
            title="Submit Code"
          >
            <Send size={13} style={{ color: '#000' }} />
            <span>{isSubmittingCode ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </div>

      <div className="editor-wrap">
        <Editor
          height="100%"
          theme={theme === "dark" ? "vs-dark" : "light"}
          language={activeFile?.language || "javascript"}
          path={activeFile?.name || "main.js"}
          onMount={(editor) => {
            setEditorInstance(editor);
          }}
          onChange={(value) => {
            if (isRemoteUpdate.current) return;
            if (onChange) onChange(value);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            readOnly: !permissions.canEdit,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
          }}
        />
      </div>

      {showExportModal && (
        <div className="file-delete-overlay" role="dialog" aria-modal="true" aria-label="Export files modal">
          <div className="file-delete-card export-modal">
            <div className="export-modal-header">
              <h3>Export Files</h3>
              <button className="button compact ghost" onClick={() => setShowExportModal(false)}><X size={16} /></button>
            </div>
            <p className="export-subtitle">Select the files you want to download.</p>
            
            <div className="export-file-list">
              {files.map(file => (
                <label key={file.name} className="export-file-item">
                  <input 
                    type="checkbox" 
                    checked={selectedFiles.includes(file.name)}
                    onChange={() => toggleFileSelection(file.name)}
                  />
                  <FileCode2 size={14} />
                  <span>{file.name}</span>
                </label>
              ))}
            </div>

            <div className="file-delete-actions">
              <div className="export-actions-left">
                <button 
                  className="button ghost compact" 
                  onClick={() => setSelectedFiles(files.map(f => f.name))}
                >
                  Select All
                </button>
                <button 
                  className="button ghost compact" 
                  onClick={() => setSelectedFiles([])}
                >
                  Clear
                </button>
              </div>
              <button 
                type="button" 
                className="button success compact" 
                disabled={selectedFiles.length === 0 || isExporting}
                onClick={handleExport}
              >
                {isExporting ? "Exporting..." : `Download ${selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : "File"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteFile && (
        <div className="file-delete-overlay" role="dialog" aria-modal="true" aria-label="Delete file confirmation">
          <div className="file-delete-card">
            <h3>Delete file?</h3>
            <p>Do you want to delete <strong>{pendingDeleteFile}</strong>?</p>
            <div className="file-delete-actions">
              <button type="button" className="button secondary compact" onClick={() => setPendingDeleteFile(null)}>
                No
              </button>
              <button
                type="button"
                className="button danger compact"
                onClick={() => {
                  onDeleteFile(pendingDeleteFile);
                  setPendingDeleteFile(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
