import React, { useState } from 'react';
import { Plus, Target, IndianRupee, Calendar, CheckCircle2, Trash2 } from 'lucide-react';

export default function Goals({ goals, onCreateGoal, onDepositGoal, onDeleteGoal }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [depositingGoal, setDepositingGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    current_amount: '0',
    target_date: '',
    category: 'General',
    color: '#10b981'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target_amount || !newGoal.target_date) return;

    onCreateGoal({
      ...newGoal,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: parseFloat(newGoal.current_amount) || 0
    });

    setNewGoal({ title: '', target_amount: '', current_amount: '0', target_date: '', category: 'General', color: '#10b981' });
    setShowCreateModal(false);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositingGoal || !depositAmount) return;

    onDepositGoal(depositingGoal.id, parseFloat(depositAmount));
    setDepositingGoal(null);
    setDepositAmount('');
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Savings & Financial Goals (INR)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Set custom targets for major purchases, emergency funds, and future plans in Rupees (₹).
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {goals && goals.length > 0 ? (
          goals.map(goal => {
            const current = goal.current_amount || 0;
            const target = goal.target_amount || 1;
            const percentage = Math.min((current / target) * 100, 100);
            const isCompleted = current >= target;

            return (
              <div key={goal.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: goal.color || '#10b981', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em' 
                        }}
                      >
                        {goal.category || 'General'}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', marginTop: '2px' }}>{goal.title}</h3>
                    </div>

                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteGoal(goal.id)}
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ margin: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Saved: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(current)}</strong></span>
                      <span style={{ fontWeight: '600' }}>Goal: {formatCurrency(target)}</span>
                    </div>

                    <div className="progress-bar-bg" style={{ height: '12px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: isCompleted ? '#10b981' : goal.color || '#6366f1'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> Target: {goal.target_date}
                    </span>
                    <span style={{ fontWeight: '700', color: isCompleted ? '#10b981' : 'var(--text-primary)' }}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  {isCompleted ? (
                    <div style={{ 
                      padding: '10px', 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      borderRadius: '10px', 
                      color: '#10b981', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '6px',
                      fontWeight: '600',
                      fontSize: '0.88rem'
                    }}>
                      <CheckCircle2 size={18} /> Goal Achieved!
                    </div>
                  ) : (
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setDepositingGoal(goal)}
                    >
                      <IndianRupee size={16} />
                      <span>Add Contribution</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No savings goals set yet. Click "New Goal" above to start tracking your targets!
          </div>
        )}
      </div>

      {depositingGoal && (
        <div className="modal-overlay" onClick={() => setDepositingGoal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Deposit to "{depositingGoal.title}" (₹)</h3>
            <form onSubmit={handleDepositSubmit} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Deposit Amount (₹)</label>
                <input 
                  type="number"
                  step="500"
                  min="100"
                  className="form-control"
                  placeholder="e.g. 5000"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setDepositingGoal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create Financial Goal (₹)</h3>
            <form onSubmit={handleCreateSubmit} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Goal Title</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Goa Vacation"
                  required
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Goal Amount (₹)</label>
                  <input 
                    type="number"
                    step="1000"
                    min="1000"
                    className="form-control"
                    placeholder="e.g. 50000"
                    required
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Starting Amount (₹)</label>
                  <input 
                    type="number"
                    step="500"
                    min="0"
                    className="form-control"
                    placeholder="0"
                    value={newGoal.current_amount}
                    onChange={(e) => setNewGoal({ ...newGoal, current_amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Completion Date</label>
                  <input 
                    type="date"
                    className="form-control"
                    required
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-control"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  >
                    <option value="General">General</option>
                    <option value="Safety Net">Safety Net</option>
                    <option value="Travel">Travel</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Gadgets">Gadgets</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
