import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/client';
import { API_URL } from '../config';
import { UserMinus, X, MessageSquare, ExternalLink } from 'lucide-react';
import defaultAvatar from "../../assets/scene1.jpeg";

export function PublicProfileModal({ userId, onClose, onRemoveFriend, isFriend }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await getProfile(userId);
        if (active) setProfile(data || {});
      } catch (err) {
        console.error("Failed to load public profile", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => { active = false; };
  }, [userId]);

  const handleRemoveClick = () => {
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    setRemoving(true);
    try {
      await onRemoveFriend(userId);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to remove friend.");
    } finally {
      setRemoving(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel admin-modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', color: 'white' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  const emotionImage = profile?.emotionId ? `${API_URL}/api/emotions/${profile.emotionId}/image` : null;

  return (
    <div className="admin-panel admin-modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
      <div className="admin-modal-card" style={{ width: '500px', padding: 0, overflow: 'hidden', position: 'relative' }}>
        
        {/* Banner */}
        <div style={{ height: '120px', backgroundImage: `url(${defaultAvatar})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '4px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', paddingTop: '0', position: 'relative', background: '#0f172a' }}>
          
          {/* Avatar */}
          <div style={{ marginTop: '-40px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #0f172a',
              background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative', zIndex: 2
            }}>
              {emotionImage ? (
                <img src={emotionImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: 'var(--primary-accent)' }}>
                  {profile?.displayName ? profile.displayName[0].toUpperCase() : '?'}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-icon" title="Message" style={{ padding: '6px' }} disabled>
                <MessageSquare size={16} />
              </button>
              <button className="btn-icon" title="Invite to Room" style={{ padding: '6px' }} disabled>
                <ExternalLink size={16} />
              </button>
              {isFriend && (
                <button className="btn-secondary" style={{ padding: '6px 12px', border: '1px solid #ef4444', color: '#ef4444' }} onClick={handleRemoveClick}>
                  <UserMinus size={16} /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: 0, color: 'white', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profile?.displayName || "Unknown User"}
              <span className="status-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'monospace', marginTop: '4px' }}>
              Friend Code: {profile?.friendCode || "..."}
            </div>
          </div>

          <div style={{ color: 'white', fontSize: '14px', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            "{profile?.bio || "No bio provided."}"
          </div>
        </div>

        {/* Confirmation Modal overlaying the main modal */}
        {showConfirm && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '20px' }}>
            <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '8px', textAlign: 'center', width: '100%' }}>
              <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Remove Friend?</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
                Are you sure you want to remove {profile?.displayName || "this user"} from your friends list?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn-secondary" onClick={() => setShowConfirm(false)} disabled={removing}>
                  Cancel
                </button>
                <button className="btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={confirmRemove} disabled={removing}>
                  {removing ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
