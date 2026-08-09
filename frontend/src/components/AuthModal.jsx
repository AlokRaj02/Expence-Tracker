import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthModal({ onLogin, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('👨‍💻');

  const avatars = ['👨‍💻', '👩‍💼', '🚀', '👑', '🦸‍♂️', '🎯'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) return;

    const userObj = {
      name: isSignUp ? name : (email.split('@')[0] || 'Alok Raj'),
      email,
      avatar,
      currency: 'INR (₹)',
      memberSince: 'August 2026',
      token: 'fp_auth_token_' + Date.now()
    };

    onLogin(userObj);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Alok Raj',
      email: 'alok.raj@financepulse.in',
      avatar: '👨‍💻',
      currency: 'INR (₹)',
      memberSince: 'August 2026',
      token: 'fp_demo_token_12345'
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div 
            style={{ 
              width: '52px', 
              height: '52px', 
              borderRadius: '16px', 
              background: 'var(--accent-gradient)', 
              color: '#fff', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '10px',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
            {isSignUp ? 'Join FinancePulse to track budgets & investments in INR (₹)' : 'Sign in to access your personal finance dashboard'}
          </p>

          {/* Quick Demo Login Button */}
          <div style={{ marginTop: '14px' }}>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              onClick={handleDemoLogin}
            >
              <Sparkles size={14} /> ⚡ 1-Click Demo Login (Alok Raj)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label>Choose Profile Avatar</label>
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
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. Alok Raj"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '38px' }}
                placeholder="e.g. alok@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button 
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
