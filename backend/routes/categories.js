import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
             COALESCE(SUM(t.amount), 0) as total_spent,
             COUNT(t.id) as transaction_count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
      GROUP BY c.id
      ORDER BY c.type ASC, c.name ASC
    `).all();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  const { name, type, color, icon, allocated_budget } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Name and type are required' });
  }

  try {
    const stmt = db.prepare(
      'INSERT INTO categories (name, type, color, icon, allocated_budget) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(
      name,
      type,
      color || '#6366f1',
      icon || 'Tag',
      allocated_budget || 0
    );

    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, color, icon, allocated_budget } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE categories 
      SET name = COALESCE(?, name),
          type = COALESCE(?, type),
          color = COALESCE(?, color),
          icon = COALESCE(?, icon),
          allocated_budget = COALESCE(?, allocated_budget)
      WHERE id = ?
    `);

    const info = stmt.run(name, type, color, icon, allocated_budget, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
