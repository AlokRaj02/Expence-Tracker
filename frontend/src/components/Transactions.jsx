import React, { useState } from 'react';
import { Search, Download, Trash2, Plus, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

export default function Transactions({ 
  transactions, 
  categories, 
  onAddTransaction, 
  onDeleteTransaction,
  filters,
  setFilters,
  onExportCSV
}) {
  const [showModal, setShowModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleQuickChipSelect = (cat) => {
    setFormData({
      ...formData,
      type: cat.type,
      category_id: cat.id.toString(),
      description: `${cat.name} Payment`
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      description: `[${paymentMode}] ${formData.description}`
    });

    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category_id: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const availableCategories = categories.filter(c => c.type === formData.type);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Daily Payment Entry (INR 🇮🇳)</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Log daily UPI payments, cash entries, SIPs, and trading allocations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span>+ Add Payment</span>
          </button>
        </div>
      </div>

      {/* Quick Entry Chips */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '14px 18px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={15} color="#f59e0b" /> Quick 1-Click Payment Logger:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c.id}
              className="btn btn-secondary btn-sm"
              style={{ 
                borderColor: c.color || 'var(--border-color)', 
                background: `${c.color || '#6366f1'}15`,
                fontSize: '0.82rem'
              }}
              onClick={() => handleQuickChipSelect(c)}
            >
              + {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search payment or description..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <select 
            className="form-control" 
            style={{ width: '150px' }}
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            className="form-control" 
            style={{ width: '200px' }}
            value={filters.category_id || ''}
            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {(filters.search || filters.type || filters.category_id) && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setFilters({ search: '', type: '', category_id: '' })}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description / Note</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{tx.date}</td>
                  <td style={{ fontWeight: '600' }}>{tx.description}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        background: `${tx.category_color || '#6366f1'}20`,
                        color: tx.category_color || '#6366f1'
                      }}
                    >
                      {tx.category_name || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {tx.type === 'income' ? <ArrowUpRight size={12} inline="true" /> : <ArrowDownRight size={12} inline="true" />}
                      {' '}{tx.type}
                    </span>
                  </td>
                  <td style={{ 
                    fontWeight: '700', 
                    color: tx.type === 'income' ? '#10b981' : 'var(--text-primary)' 
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="Delete Transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No transactions matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Log Payment / Transaction (₹)</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Payment Mode</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['UPI', 'Cash', 'Card', 'NetBanking'].map(mode => (
                    <button 
                      key={mode}
                      type="button" 
                      className={`btn ${paymentMode === mode ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ flex: 1 }}
                      onClick={() => setPaymentMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                  >
                    Expense / Investment
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                  >
                    Income / Allowance
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Description / Note</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Lunch at Mess, Petrol Refill, SIP Investment"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    step="1"
                    min="1"
                    className="form-control" 
                    placeholder="e.g. 180"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-control"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
