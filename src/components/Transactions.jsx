import React, { useState } from 'react';
import { Search, Download, Trash2, Plus, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id ? parseInt(formData.category_id) : null
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

  const formatCurrency = (val) => `$${parseFloat(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const availableCategories = categories.filter(c => c.type === formData.type);

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2>Transactions History</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search description..."
              className="form-control"
              style={{ paddingLeft: '38px' }}
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Type Filter */}
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

          {/* Category Filter */}
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

          {/* Reset Filters */}
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
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
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

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Add New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                  >
                    Expense
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Grocery store purchase"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    className="form-control" 
                    placeholder="0.00"
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
