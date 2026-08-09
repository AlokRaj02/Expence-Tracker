import React, { useState } from 'react';
import { Wallet, PlusCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function UpdateWalletModal({ currentBalance, onUpdateWalletBalance, onClose }) {
  const [mode, setMode] = useState('set'); // 'set' or 'add'
  const [newBalance, setNewBalance] = useState(currentBalance.toString());
  const [addAmount, setAddAmount] = useState('15000');
  const [description, setDescription] = useState('Pocket Money / Wallet Top-Up');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'set') {
      const target = parseFloat(newBalance) || 0;
      const difference = target - currentBalance;
      onUpdateWalletBalance({
        amount: Math.abs(difference),
        type: difference >= 0 ? 'income' : 'expense',
        description: `Wallet Balance Adjustment (Set to ₹${target.toLocaleString('en-IN')})`
      });
    } else {
      const amount = parseFloat(addAmount) || 0;
      if (amount <= 0) return;
      onUpdateWalletBalance({
        amount,
        type: 'income',
        description: description || 'Added Funds to Wallet'
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'rgba(99, 102, 241, 0.2)', 
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wallet size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Update Wallet Balance</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Current Net Balance: <strong style={{ color: 'var(--text-primary)' }}>₹{currentBalance.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            className={`btn ${mode === 'set' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMode('set')}
          >
            <RefreshCw size={15} /> Set Exact Balance
          </button>
          <button 
            type="button" 
            className={`btn ${mode === 'add' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setMode('add')}
          >
            <PlusCircle size={15} /> Add Funds (+₹)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'set' ? (
            <div className="form-group">
              <label>Set Total Wallet Balance (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>₹</span>
                <input 
                  type="number"
                  step="100"
                  className="form-control"
                  style={{ paddingLeft: '28px', fontSize: '1.1rem', fontWeight: '600' }}
                  placeholder="e.g. 15000"
                  required
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px', display: 'block' }}>
                This automatically logs a balance adjustment to match your exact current money.
              </small>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Amount to Add (₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>₹</span>
                  <input 
                    type="number"
                    step="100"
                    min="1"
                    className="form-control"
                    style={{ paddingLeft: '28px', fontSize: '1.1rem', fontWeight: '600' }}
                    placeholder="e.g. 15000"
                    required
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deposit Source / Description</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Monthly Pocket Money / Cash Deposit"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={16} /> Save Wallet Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
