import React, { useState } from 'react';
import { Plus, Edit2, AlertTriangle, CheckCircle2, Tag } from 'lucide-react';

export default function Budgets({ categories, onUpdateBudget, onCreateCategory }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetLimit, setBudgetLimit] = useState('');

  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatData, setNewCatData] = useState({
    name: '',
    type: 'expense',
    allocated_budget: '',
    color: '#6366f1'
  });

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setBudgetLimit(category.allocated_budget || '');
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    onUpdateBudget(editingCategory.id, {
      allocated_budget: parseFloat(budgetLimit) || 0
    });

    setEditingCategory(null);
  };

  const handleCreateCat = (e) => {
    e.preventDefault();
    if (!newCatData.name) return;

    onCreateCategory({
      ...newCatData,
      allocated_budget: parseFloat(newCatData.allocated_budget) || 0
    });

    setNewCatData({ name: '', type: 'expense', allocated_budget: '', color: '#6366f1' });
    setShowNewCatModal(false);
  };

  const formatCurrency = (val) => `$${val.toLocaleString('en-US')}`;

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const totalAllocated = expenseCategories.reduce((acc, c) => acc + (c.allocated_budget || 0), 0);
  const totalSpent = expenseCategories.reduce((acc, c) => acc + (c.total_spent || 0), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Monthly Budget Planner</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Total Allocated: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(totalAllocated)}</strong> | 
            Total Spent: <strong style={{ color: totalSpent > totalAllocated ? '#ef4444' : '#10b981' }}>{formatCurrency(totalSpent)}</strong>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowNewCatModal(true)}>
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Budget Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {expenseCategories.map(cat => {
          const spent = cat.total_spent || 0;
          const budget = cat.allocated_budget || 0;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const isOver = spent > budget && budget > 0;
          const isWarning = percentage >= 80 && !isOver && budget > 0;
          const remaining = budget - spent;

          return (
            <div key={cat.id} className="glass-card" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{ 
                      width: '38px', 
                      height: '38px', 
                      borderRadius: '10px', 
                      background: `${cat.color || '#6366f1'}20`, 
                      color: cat.color || '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>{cat.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {cat.transaction_count || 0} transactions
                    </div>
                  </div>
                </div>

                <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(cat)}>
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
              </div>

              {/* Progress & Financial Status */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Spent: {formatCurrency(spent)}</span>
                  <span style={{ fontWeight: '600' }}>Target: {budget > 0 ? formatCurrency(budget) : 'Unset'}</span>
                </div>

                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOver ? '#ef4444' : isWarning ? '#f59e0b' : cat.color || '#6366f1'
                    }}
                  />
                </div>
              </div>

              {/* Footer Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '12px' }}>
                {budget === 0 ? (
                  <span style={{ color: 'var(--text-muted)' }}>No limit set</span>
                ) : isOver ? (
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <AlertTriangle size={14} /> Over budget by {formatCurrency(Math.abs(remaining))}
                  </span>
                ) : isWarning ? (
                  <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <AlertTriangle size={14} /> {formatCurrency(remaining)} remaining (80%+ spent)
                  </span>
                ) : (
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                    <CheckCircle2 size={14} /> {formatCurrency(remaining)} remaining
                  </span>
                )}

                <span style={{ fontWeight: '700', color: isOver ? '#ef4444' : 'var(--text-secondary)' }}>
                  {budget > 0 ? `${percentage.toFixed(0)}%` : '-'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div className="modal-overlay" onClick={() => setEditingCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Set Monthly Budget for {editingCategory.name}</h3>
            <form onSubmit={handleSaveBudget} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Monthly Allocated Limit ($)</label>
                <input 
                  type="number"
                  step="10"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 500"
                  required
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCategory(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Category Modal */}
      {showNewCatModal && (
        <div className="modal-overlay" onClick={() => setShowNewCatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Expense Category</h3>
            <form onSubmit={handleCreateCat} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="e.g. Subscriptions & Software"
                  required
                  value={newCatData.name}
                  onChange={(e) => setNewCatData({ ...newCatData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Initial Monthly Budget ($)</label>
                <input 
                  type="number"
                  step="10"
                  className="form-control"
                  placeholder="0.00"
                  value={newCatData.allocated_budget}
                  onChange={(e) => setNewCatData({ ...newCatData, allocated_budget: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Theme Color</label>
                <input 
                  type="color"
                  className="form-control"
                  style={{ height: '44px', padding: '4px', cursor: 'pointer' }}
                  value={newCatData.color}
                  onChange={(e) => setNewCatData({ ...newCatData, color: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewCatModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
