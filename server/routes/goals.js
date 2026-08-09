import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all savings goals
router.get('/', (req, res) => {
  try {
    const goals = db.prepare('SELECT * FROM goals ORDER BY target_date ASC').all();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new goal
router.post('/', (req, res) => {
  const { title, target_amount, current_amount, target_date, color, category } = req.body;

  if (!title || !target_amount || !target_date) {
    return res.status(400).json({ error: 'Title, target amount, and target date are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO goals (title, target_amount, current_amount, target_date, color, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      title,
      target_amount,
      current_amount || 0,
      target_date,
      color || '#6366f1',
      category || 'General'
    );

    const newGoal = db.prepare('SELECT * FROM goals WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal details
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, target_amount, current_amount, target_date, color, category } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE goals
      SET title = COALESCE(?, title),
          target_amount = COALESCE(?, target_amount),
          current_amount = COALESCE(?, current_amount),
          target_date = COALESCE(?, target_date),
          color = COALESCE(?, color),
          category = COALESCE(?, category)
      WHERE id = ?
    `);

    const info = stmt.run(title, target_amount, current_amount, target_date, color, category, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updatedGoal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add contribution deposit to goal
router.patch('/:id/deposit', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid deposit amount required' });
  }

  try {
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const newAmount = goal.current_amount + parseFloat(amount);
    db.prepare('UPDATE goals SET current_amount = ? WHERE id = ?').run(newAmount, id);

    const updatedGoal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a goal
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM goals WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
