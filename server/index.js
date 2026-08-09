import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDb } from './db.js';
import { seedData } from './seed.js';

import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';
import goalsRouter from './routes/goals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize DB and Seed Data
initDb();
seedData();

// API Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/goals', goalsRouter);

// Comprehensive Financial Summary API
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

    // Monthly breakdown (last 6 months)
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

    // Expense spending breakdown by category
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

    // Budget utilization list
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

// Serve frontend dist if built
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.listen(PORT, () => {
  console.log(`🚀 Personal Finance Server running on http://localhost:${PORT}`);
});
