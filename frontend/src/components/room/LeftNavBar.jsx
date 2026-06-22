import React, { useState } from 'react';
import { Mic, MicOff, Users, StickyNote, Info, Settings, MessageSquare, ArrowLeft, FileCode2, Target, PanelLeftClose, PanelLeftOpen, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LeftNavBar({ 
  activeTab,
  micOn, 
  onToggleMic, 
  onLeave,
  onShowFiles,
  onShowProblem,
  onShowUsers,
  onShowNotes,
  showPreviewButton,
  onShowFullPreview
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`left-nav-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="nav-logo" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Collapse" : "Expand"}>
        <div className="logo-icon">
          {isExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </div>
      </div>

      <div className="nav-items-top">
        <button 
          className={`nav-item ${!micOn ? 'mic-off' : ''}`} 
          onClick={onToggleMic}
          title={micOn ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          <span>{micOn ? 'Mic On' : 'Mic Off'}</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'files' ? 'active' : ''}`} 
          onClick={onShowFiles} 
          title="Explorer"
        >
          <div className="icon-wrapper"><FileCode2 size={20} /></div>
          <span>Explorer</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'problem' ? 'active' : ''}`} 
          onClick={onShowProblem} 
          title="Problem"
        >
          <div className="icon-wrapper"><Target size={20} /></div>
          <span>Problem</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={onShowUsers} 
          title="Users"
        >
          <div className="icon-wrapper"><Users size={20} /></div>
          <span>Users</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} 
          onClick={onShowNotes} 
          title="Notes"
        >
          <div className="icon-wrapper"><StickyNote size={20} /></div>
          <span>Notes</span>
        </button>

        {showPreviewButton && (
          <button 
            className={`nav-item ${activeTab === 'preview' ? 'active' : ''}`} 
            onClick={onShowFullPreview} 
            title="Full Preview"
          >
            <div className="icon-wrapper"><Monitor size={20} /></div>
            <span>Preview</span>
          </button>
        )}
      </div>

      <div className="nav-items-bottom">
        <button className="nav-item leave-btn" onClick={onLeave} title="Leave Room">
          <ArrowLeft size={20} />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}
