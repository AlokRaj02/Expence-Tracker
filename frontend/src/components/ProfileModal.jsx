import React, { useState } from 'react';
import { User, Mail, Shield, LogOut, Check, RefreshCw, Award, HeartHandshake } from 'lucide-react';

export default function ProfileModal({ user, summary, onUpdateProfile, onLogout, onClose }) {
  const [name, setName] = useState(user?.name || 'Alok Raj');
  const [email, setEmail] = useState(user?.email || 'alok.raj@financepulse.in');
  const [avatar, setAvatar] = useState(user?.avatar || '👨‍💻');
  const [isEditing, setIsEditing] = useState(false);

  const avatars = ['👨‍💻', '👩‍💼', '🚀', '👑', '🦸‍♂️', '🎯'];

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      email,
      avatar
    });
    setIsEditing(false);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div 
            style={{ 
              fontSize: '2.5rem', 
              width: '64px', 
              height: '64px', 
              borderRadius: '20px', 
              background: 'rgba(99, 102, 241, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px solid var(--accent-color)'
            }}
          >
            {avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{name}</h3>
              <span className="badge badge-income" style={{ fontSize: '0.7rem' }}>
                <Shield size={10} inline="true" /> Verified Member
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{email}</p>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Member since {user?.memberSince || 'August 2026'} • Currency: INR (₹)
            </p>
          </div>
        </div>

        {/* Financial Summary Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: '600', textTransform: 'uppercase' }}>Recorded Income</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
              {formatCurrency(summary?.totalIncome)}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ fontSize: '0.76rem', color: '#ef4444', fontWeight: '600', textTransform: 'uppercase' }}>Recorded Expenses</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ef4444', marginTop: '2px' }}>
              {formatCurrency(summary?.totalExpense)}
            </div>
          </div>
        </div>

        {/* Edit Form or Account Info */}
        {isEditing ? (
          <form onSubmit={handleSave} style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label>Select Avatar</label>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                {avatars.map(av => (
                  <button
                    key={av}
                    type="button"
                    style={{
                      fontSize: '1.5rem',
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: avatar === av ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                      background: avatar === av ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setAvatar(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              style={{ justifyContent: 'center' }}
              onClick={() => setIsEditing(true)}
            >
              <User size={16} /> Edit Profile Details
            </button>
          </div>
        )}

        {/* Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          <button type="button" className="btn btn-danger" onClick={onLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
