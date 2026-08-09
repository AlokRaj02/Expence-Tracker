import express from 'express';
import cors from 'cors';
import db, { initDb } from '../backend/db.js';
import { seedData } from '../backend/seed.js';

import transactionsRouter from '../backend/routes/transactions.js';
import categoriesRouter from '../backend/routes/categories.js';
import goalsRouter from '../backend/routes/goals.js';

const app = express();

app.use(cors());
app.use(express.json());

initDb();
seedData();

app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/goals', goalsRouter);

app.get('/api/summary', (req, res) => {
  try {
    const totalIncome = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'"
    ).get().total;

    const totalExpense = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'"
    ).get().total;

    const totalBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;

    const monthlyCashflow = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month ASC
      LIMIT 6
    `).all();

    const expenseBreakdown = db.prepare(`
      SELECT 
        c.name as category,
        c.color,
        c.icon,
        c.allocated_budget,
        COALESCE(SUM(t.amount), 0) as total_spent
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id AND t.type = 'expense'
      WHERE c.type = 'expense'
      GROUP BY c.id
      HAVING total_spent > 0
      ORDER BY total_spent DESC
    `).all();

    const budgetStatus = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.color,
        c.icon,
        c.allocated_budget,
        COALESCE(SUM(t.amount), 0) as spent,
        CASE 
          WHEN c.allocated_budget > 0 THEN (COALESCE(SUM(t.amount), 0) / c.allocated_budget) * 100 
          ELSE 0 
        END as percentage_used
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id AND t.type = 'expense'
      WHERE c.type = 'expense' AND c.allocated_budget > 0
      GROUP BY c.id
      ORDER BY percentage_used DESC
    `).all();

    res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      savingsRate: parseFloat(savingsRate),
      monthlyCashflow,
      expenseBreakdown,
      budgetStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;
