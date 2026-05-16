import { Eraser, Minus, Square, Type, X, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function NotesModal({ isOpen, onClose, notes, onUpdateText, onDraw, permissions }) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("draw"); // 'draw' or 'text'
  const [isDrawing, setIsDrawing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Clear and redraw all paths
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    notes.draws.forEach(path => {
      if (path.points && path.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
    });
  }, [isOpen, notes.draws, isExpanded]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    if (mode !== "draw" || !permissions.canEdit) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    lastPos.current = { x, y };
  };

  const draw = (e) => {
    if (!isDrawing || mode !== "draw" || !permissions.canEdit) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // We collect points for synchronization
    // To optimize, we'll emit the path when done drawing
    // But for a simple implementation, we can just track the current path
    if (!currentPath.current) currentPath.current = [];
    currentPath.current.push({ x, y });

    lastPos.current = { x, y };
  };

  const currentPath = useRef([]);

  const stopDrawing = () => {
    if (isDrawing && permissions.canEdit) {
      if (currentPath.current.length > 0) {
        onDraw({ points: currentPath.current });
        currentPath.current = [];
      }
    }
    setIsDrawing(false);
  };

  return (
    <div className={`notes-overlay ${isExpanded ? 'expanded' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`notes-card ${isExpanded ? 'expanded' : ''}`}>
        <div className="notes-header">
          <div className="notes-title">
            <Type size={18} />
            <h3>Rough Notes / Scratchpad</h3>
          </div>
          <div className="notes-actions">
            <button 
              className={`button compact ghost ${mode === 'draw' ? 'active' : ''}`} 
              onClick={() => setMode('draw')}
              title="Doodle Mode"
            >
              <Eraser size={16} />
            </button>
            <button 
              className={`button compact ghost ${mode === 'text' ? 'active' : ''}`} 
              onClick={() => setMode('text')}
              title="Type Mode"
            >
              <Type size={16} />
            </button>
            <button 
              className="button compact ghost" 
              onClick={() => onDraw('clear')}
              title="Clear Board"
              disabled={!permissions.canEdit}
            >
              <Eraser size={16} />
            </button>
            <div className="notes-divider" />
            <button 
              className="button compact ghost" 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button className="button compact ghost close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="notes-content">
          <div className={`notes-canvas-container ${mode === 'draw' ? 'active' : ''}`}>
            <canvas
              ref={canvasRef}
              width={isExpanded ? 1000 : 600}
              height={isExpanded ? 700 : 400}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          <div className={`notes-text-container ${mode === 'text' ? 'active' : ''}`}>
            <textarea
              placeholder="Type your notes here... everyone can see and edit."
              value={notes.text}
              onChange={(e) => onUpdateText(e.target.value)}
              disabled={!permissions.canEdit}
            />
          </div>
        </div>
        <div className="notes-footer">
          <p>This is a shared scratchpad. All members can doodle or type live.</p>
        </div>
      </div>
    </div>
  );
}
