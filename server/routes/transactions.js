import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get filtered transactions list
router.get('/', (req, res) => {
  const { type, category_id, search, startDate, endDate, limit } = req.query;

  try {
    let query = `
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (category_id) {
      query += ' AND t.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND t.description LIKE ?';
      params.push(`%${search}%`);
    }

    if (startDate) {
      query += ' AND t.date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND t.date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY t.date DESC, t.id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const transactions = db.prepare(query).all(...params);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', (req, res) => {
  const { date, amount, type, category_id, description, status } = req.body;

  if (!date || !amount || !type || !description) {
    return res.status(400).json({ error: 'Date, amount, type, and description are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO transactions (date, amount, type, category_id, description, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      date,
      parseFloat(amount),
      type,
      category_id || null,
      description,
      status || 'completed'
    );

    const newTx = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(info.lastInsertRowid);

    res.status(201).json(newTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { date, amount, type, category_id, description, status } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE transactions
      SET date = COALESCE(?, date),
          amount = COALESCE(?, amount),
          type = COALESCE(?, type),
          category_id = COALESCE(?, category_id),
          description = COALESCE(?, description),
          status = COALESCE(?, status)
      WHERE id = ?
    `);

    const info = stmt.run(date, amount, type, category_id, description, status, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updatedTx = db.prepare(`
      SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `).get(id);

    res.json(updatedTx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export CSV
router.get('/export/csv', (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.id, t.date, t.amount, t.type, COALESCE(c.name, 'Uncategorized') as category, t.description, t.status
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
    `).all();

    let csvContent = 'ID,Date,Amount,Type,Category,Description,Status\n';
    transactions.forEach(t => {
      const desc = `"${t.description.replace(/"/g, '""')}"`;
      csvContent += `${t.id},${t.date},${t.amount},${t.type},"${t.category}",${desc},${t.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
