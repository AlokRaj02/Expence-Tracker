import React, { useState, useEffect } from 'react';
import { IndianRupee, Sparkles, CheckCircle, Zap } from 'lucide-react';

export default function OnboardingModal({ categories, onSaveInitialBudget, onClose }) {
  const expenseCats = categories.filter(c => c.type === 'expense');

  const [totalIncome, setTotalIncome] = useState('15000');
  const [totalBudget, setTotalBudget] = useState('11000');
  const [allocations, setAllocations] = useState({});

  useEffect(() => {
    // Populate initial default allocations based on expense categories
    const initialMap = {};
    expenseCats.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes('rent') || name.includes('housing')) initialMap[cat.name] = '5000';
      else if (name.includes('groceries') || name.includes('meals') || name.includes('dining')) initialMap[cat.name] = '3000';
      else if (name.includes('transport') || name.includes('fuel')) initialMap[cat.name] = '1200';
      else if (name.includes('utilities') || name.includes('mobile') || name.includes('wifi') || name.includes('bills')) initialMap[cat.name] = '800';
      else if (name.includes('outings') || name.includes('leisure') || name.includes('entertainment')) initialMap[cat.name] = '1500';
      else if (name.includes('sip') || name.includes('mutual')) initialMap[cat.name] = '2500';
      else if (name.includes('trading') || name.includes('stock')) initialMap[cat.name] = '1000';
      else initialMap[cat.name] = cat.allocated_budget ? cat.allocated_budget.toString() : '0';
    });
    setAllocations(initialMap);
  }, [categories]);

  const handlePocketMoneyPreset = () => {
    setTotalIncome('15000');
    setTotalBudget('11000');
    const presetMap = {};
    expenseCats.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes('rent') || name.includes('housing')) presetMap[cat.name] = '5000';
      else if (name.includes('groceries') || name.includes('meals') || name.includes('dining')) presetMap[cat.name] = '3000';
      else if (name.includes('transport') || name.includes('fuel')) presetMap[cat.name] = '1200';
      else if (name.includes('utilities') || name.includes('mobile') || name.includes('wifi') || name.includes('bills')) presetMap[cat.name] = '800';
      else if (name.includes('outings') || name.includes('leisure') || name.includes('entertainment')) presetMap[cat.name] = '1500';
      else if (name.includes('sip') || name.includes('mutual')) presetMap[cat.name] = '2500';
      else if (name.includes('trading') || name.includes('stock')) presetMap[cat.name] = '1000';
      else presetMap[cat.name] = '0';
    });
    setAllocations(presetMap);
  };

  const handleAutoDistribute = (budgetValue) => {
    const b = parseFloat(budgetValue) || 0;
    const newMap = {};
    expenseCats.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes('rent') || name.includes('housing')) newMap[cat.name] = Math.round(b * 0.40).toString();
      else if (name.includes('groceries') || name.includes('meals') || name.includes('dining')) newMap[cat.name] = Math.round(b * 0.25).toString();
      else if (name.includes('transport') || name.includes('fuel')) newMap[cat.name] = Math.round(b * 0.10).toString();
      else if (name.includes('utilities') || name.includes('mobile') || name.includes('wifi') || name.includes('bills')) newMap[cat.name] = Math.round(b * 0.08).toString();
      else if (name.includes('outings') || name.includes('leisure') || name.includes('entertainment')) newMap[cat.name] = Math.round(b * 0.10).toString();
      else if (name.includes('sip') || name.includes('mutual')) newMap[cat.name] = '2500';
      else if (name.includes('trading') || name.includes('stock')) newMap[cat.name] = '1000';
      else newMap[cat.name] = '0';
    });
    setAllocations(newMap);
  };

  const handleBudgetChange = (e) => {
    const val = e.target.value;
    setTotalBudget(val);
    handleAutoDistribute(val);
  };

  const handleAllocationChange = (catName, val) => {
    setAllocations(prev => ({ ...prev, [catName]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveInitialBudget({
      totalIncome: parseFloat(totalIncome) || 0,
      totalBudget: parseFloat(totalBudget) || 0,
      allocations
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
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
            <IndianRupee size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem' }}>Welcome to FinancePulse 🇮🇳</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Set up your starting monthly budget, rent limits, and SIP/Trading investment targets.
          </p>

          <div style={{ marginTop: '14px' }}>
            <button 
              type="button"
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
              onClick={handlePocketMoneyPreset}
            >
              <Zap size={16} /> ⚡ Apply ₹15,000 Pocket Money Plan
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Income / Allowance (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>₹</span>
                <input 
                  type="number" 
                  step="500"
                  className="form-control" 
                  style={{ paddingLeft: '28px' }}
                  placeholder="e.g. 15000"
                  required
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Living Expense Target (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>₹</span>
                <input 
                  type="number" 
                  step="500"
                  className="form-control" 
                  style={{ paddingLeft: '28px' }}
                  placeholder="e.g. 11000"
                  required
                  value={totalBudget}
                  onChange={handleBudgetChange}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Category Allocations (Rent, Expenses, SIP & Trading)
              </label>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleAutoDistribute(totalBudget)}
              >
                <Sparkles size={14} /> Auto Split
              </button>
            </div>

            <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expenseCats.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '500' }}>{cat.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '130px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹</span>
                    <input 
                      type="number"
                      step="100"
                      className="form-control"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={allocations[cat.name] || '0'}
                      onChange={(e) => handleAllocationChange(cat.name, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle size={18} />
              <span>Save & Launch Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
