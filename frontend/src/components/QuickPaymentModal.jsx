import React, { useState } from 'react';
import { IndianRupee, CheckCircle, Zap, Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function QuickPaymentModal({ categories, onAddTransaction, onClose }) {
  const [type, setType] = useState('expense');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const availableCategories = categories.filter(c => c.type === type);

  const quickAmounts = type === 'expense' ? [50, 100, 200, 500, 1000] : [1000, 2000, 5000, 10000, 15000];

  const handleQuickAmountClick = (val) => {
    setAmount(val.toString());
  };

  const handleCategoryChipClick = (cat) => {
    setCategoryId(cat.id.toString());
    if (!description) {
      setDescription(`${cat.name} payment`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || parseFloat(amount) <= 0) return;

    onAddTransaction({
      amount: parseFloat(amount),
      type,
      category_id: categoryId ? parseInt(categoryId) : null,
      description: `[${paymentMode}] ${description}`,
      date,
      status: 'completed'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '12px', 
                background: type === 'expense' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: type === 'expense' ? '#ef4444' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {type === 'expense' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Quick Payment Entry 🇮🇳</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Instantly updates balance, charts & category budget limits.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Income vs Expense Selector */}
          <div className="form-group">
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className={`btn ${type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center', background: type === 'expense' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '' }}
                onClick={() => { setType('expense'); setCategoryId(''); }}
              >
                Expense Payment (₹)
              </button>
              <button 
                type="button" 
                className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, justifyContent: 'center', background: type === 'income' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '' }}
                onClick={() => { setType('income'); setCategoryId(''); }}
              >
                Income / Pocket Money (₹)
              </button>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="form-group">
            <label>Payment Mode</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['UPI', 'Cash', 'Card', 'NetBanking'].map(mode => (
                <button 
                  key={mode}
                  type="button" 
                  className={`btn ${paymentMode === mode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setPaymentMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Field + Quick Amount Buttons */}
          <div className="form-group">
            <label>Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>₹</span>
              <input 
                type="number"
                step="1"
                min="1"
                className="form-control"
                style={{ paddingLeft: '28px', fontSize: '1.2rem', fontWeight: '700' }}
                placeholder="e.g. 150"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            {/* Quick Amount Chips */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {quickAmounts.map(q => (
                <button 
                  key={q} 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                  onClick={() => handleQuickAmountClick(q)}
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips */}
          <div className="form-group">
            <label>Select Category</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '100px', overflowY: 'auto', padding: '4px' }}>
              {availableCategories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`btn ${categoryId === c.id.toString() ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                  onClick={() => handleCategoryChipClick(c)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Date */}
          <div className="form-row">
            <div className="form-group">
              <label>Description / Note</label>
              <input 
                type="text"
                className="form-control"
                placeholder="e.g. Chai, Auto Fare, Zomato"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ maxWidth: '140px' }}>
              <label>Date</label>
              <input 
                type="date"
                className="form-control"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <CheckCircle size={18} /> Log & Update Balance Immediately
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
