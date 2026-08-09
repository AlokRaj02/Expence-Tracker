import db, { initDb } from './db.js';

export function seedData() {
  initDb();

  const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (existingCategories.count > 0) {
    console.log('Database already contains data, skipping seed.');
    return;
  }

  console.log('Seeding initial finance tracker data with Pocket Money & Investment Categories (₹)...');

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, type, color, icon, allocated_budget) VALUES (?, ?, ?, ?, ?)'
  );

  const categories = [
    { name: 'Pocket Money / Allowance', type: 'income', color: '#10b981', icon: 'Wallet', allocated_budget: 0 },
    { name: 'Salary & Internships', type: 'income', color: '#06b6d4', icon: 'Briefcase', allocated_budget: 0 },
    { name: 'Freelance & Side Hustles', type: 'income', color: '#8b5cf6', icon: 'Laptop', allocated_budget: 0 },
    { name: 'Housing & Rent', type: 'expense', color: '#ef4444', icon: 'Home', allocated_budget: 5000 },
    { name: 'Groceries & Daily Meals', type: 'expense', color: '#f59e0b', icon: 'Utensils', allocated_budget: 3000 },
    { name: 'Transportation & Fuel', type: 'expense', color: '#3b82f6', icon: 'Car', allocated_budget: 1200 },
    { name: 'Utilities, Mobile & Wifi', type: 'expense', color: '#ec4899', icon: 'Zap', allocated_budget: 800 },
    { name: 'Outings & Leisure', type: 'expense', color: '#a855f7', icon: 'Film', allocated_budget: 1500 },
    { name: 'Mutual Fund SIP', type: 'expense', color: '#10b981', icon: 'TrendingUp', allocated_budget: 2500 },
    { name: 'Stock & Trading Capital', type: 'expense', color: '#06b6d4', icon: 'Activity', allocated_budget: 1000 }
  ];

  const catMap = {};
  for (const cat of categories) {
    const res = insertCategory.run(cat.name, cat.type, cat.color, cat.icon, cat.allocated_budget);
    catMap[cat.name] = res.lastInsertRowid;
  }

  const insertTx = db.prepare(
    'INSERT INTO transactions (date, amount, type, category_id, description, status) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const now = new Date();
  const getPastDate = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const sampleTransactions = [
    { date: getPastDate(1), amount: 15000.00, type: 'income', category_id: catMap['Pocket Money / Allowance'], description: 'Monthly Pocket Money Deposit (UPI)', status: 'completed' },
    { date: getPastDate(2), amount: 5000.00, type: 'expense', category_id: catMap['Housing & Rent'], description: 'PG Accommodation Rent Payment', status: 'completed' },
    { date: getPastDate(3), amount: 2500.00, type: 'expense', category_id: catMap['Mutual Fund SIP'], description: 'Nifty 50 Index Fund Monthly SIP', status: 'completed' },
    { date: getPastDate(4), amount: 1000.00, type: 'expense', category_id: catMap['Stock & Trading Capital'], description: 'Added Funds to Trading Account (Zerodha/Groww)', status: 'completed' },
    { date: getPastDate(5), amount: 800.00, type: 'expense', category_id: catMap['Utilities, Mobile & Wifi'], description: 'Mobile Recharge (5G Annual Plan) & Wifi', status: 'completed' },
    { date: getPastDate(7), amount: 650.00, type: 'expense', category_id: catMap['Transportation & Fuel'], description: 'Petrol Refill & Bus Pass', status: 'completed' },
    { date: getPastDate(9), amount: 1250.00, type: 'expense', category_id: catMap['Groceries & Daily Meals'], description: 'Mess / Canteen & Snacks', status: 'completed' },
    { date: getPastDate(12), amount: 450.00, type: 'expense', category_id: catMap['Outings & Leisure'], description: 'Weekend Coffee & Movie Night', status: 'completed' }
  ];

  for (const tx of sampleTransactions) {
    insertTx.run(tx.date, tx.amount, tx.type, tx.category_id, tx.description, tx.status);
  }

  const insertGoal = db.prepare(
    'INSERT INTO goals (title, target_amount, current_amount, target_date, color, category) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const sampleGoals = [
    { title: 'Emergency Cash Cushion', target_amount: 15000.00, current_amount: 9500.00, target_date: '2026-12-31', color: '#10b981', category: 'Safety Net' },
    { title: 'Trading Capital Target', target_amount: 25000.00, current_amount: 12000.00, target_date: '2026-10-30', color: '#06b6d4', category: 'Investing' },
    { title: 'Weekend Roadtrip', target_amount: 8000.00, current_amount: 5200.00, target_date: '2026-09-15', color: '#3b82f6', category: 'Travel' }
  ];

  for (const g of sampleGoals) {
    insertGoal.run(g.title, g.target_amount, g.current_amount, g.target_date, g.color, g.category);
  }

  console.log('Database seeded with ₹15,000 Pocket Money & Investment breakdown!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData();
}
