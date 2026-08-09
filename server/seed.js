import db, { initDb } from './db.js';

export function seedData() {
  initDb();

  // Check if categories exist
  const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (existingCategories.count > 0) {
    console.log('Database already contains data, skipping seed.');
    return;
  }

  console.log('Seeding initial finance tracker data...');

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, type, color, icon, allocated_budget) VALUES (?, ?, ?, ?, ?)'
  );

  const categories = [
    { name: 'Salary', type: 'income', color: '#10b981', icon: 'Briefcase', allocated_budget: 0 },
    { name: 'Freelance & Side Hustles', type: 'income', color: '#06b6d4', icon: 'Laptop', allocated_budget: 0 },
    { name: 'Investments & Dividends', type: 'income', color: '#8b5cf6', icon: 'TrendingUp', allocated_budget: 0 },
    { name: 'Housing & Rent', type: 'expense', color: '#ef4444', icon: 'Home', allocated_budget: 1800 },
    { name: 'Groceries & Dining', type: 'expense', color: '#f59e0b', icon: 'Utensils', allocated_budget: 650 },
    { name: 'Transportation & Fuel', type: 'expense', color: '#3b82f6', icon: 'Car', allocated_budget: 350 },
    { name: 'Utilities & Bills', type: 'expense', color: '#ec4899', icon: 'Zap', allocated_budget: 300 },
    { name: 'Entertainment & Leisure', type: 'expense', color: '#8b5cf6', icon: 'Film', allocated_budget: 250 },
    { name: 'Health & Fitness', type: 'expense', color: '#14b8a6', icon: 'Activity', allocated_budget: 200 },
    { name: 'Shopping & Electronics', type: 'expense', color: '#6366f1', icon: 'ShoppingBag', allocated_budget: 400 }
  ];

  const catMap = {};
  for (const cat of categories) {
    const res = insertCategory.run(cat.name, cat.type, cat.color, cat.icon, cat.allocated_budget);
    catMap[cat.name] = res.lastInsertRowid;
  }

  // Insert Transactions
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
    { date: getPastDate(1), amount: 4850.00, type: 'income', category_id: catMap['Salary'], description: 'Tech Corp Monthly Salary', status: 'completed' },
    { date: getPastDate(2), amount: 1200.00, type: 'income', category_id: catMap['Freelance & Side Hustles'], description: 'Client Web Design Retainer', status: 'completed' },
    { date: getPastDate(3), amount: 1750.00, type: 'expense', category_id: catMap['Housing & Rent'], description: 'Monthly Apartment Rent Payment', status: 'completed' },
    { date: getPastDate(4), amount: 142.50, type: 'expense', category_id: catMap['Groceries & Dining'], description: 'Whole Foods Market', status: 'completed' },
    { date: getPastDate(5), amount: 65.00, type: 'expense', category_id: catMap['Transportation & Fuel'], description: 'Gasoline refill', status: 'completed' },
    { date: getPastDate(7), amount: 89.99, type: 'expense', category_id: catMap['Utilities & Bills'], description: 'High-speed Fiber Internet', status: 'completed' },
    { date: getPastDate(8), amount: 125.00, type: 'expense', category_id: catMap['Entertainment & Leisure'], description: 'Concert Tickets & Dinner', status: 'completed' },
    { date: getPastDate(10), amount: 185.20, type: 'expense', category_id: catMap['Groceries & Dining'], description: 'Trader Joe Weekly Run', status: 'completed' },
    { date: getPastDate(12), amount: 310.00, type: 'income', category_id: catMap['Investments & Dividends'], description: 'Quarterly Stock Dividend', status: 'completed' },
    { date: getPastDate(14), amount: 120.00, type: 'expense', category_id: catMap['Health & Fitness'], description: 'Gym Membership & Supplements', status: 'completed' },
    { date: getPastDate(16), amount: 249.99, type: 'expense', category_id: catMap['Shopping & Electronics'], description: 'Wireless Noise Canceling Headphones', status: 'completed' },
    { date: getPastDate(18), amount: 145.00, type: 'expense', category_id: catMap['Utilities & Bills'], description: 'Electric & Power Bill', status: 'completed' },
    { date: getPastDate(20), amount: 78.30, type: 'expense', category_id: catMap['Groceries & Dining'], description: 'Local Bakery & Coffee Shops', status: 'completed' },
    { date: getPastDate(22), amount: 110.00, type: 'expense', category_id: catMap['Transportation & Fuel'], description: 'Monthly Transit Pass', status: 'completed' },
    { date: getPastDate(25), amount: 4850.00, type: 'income', category_id: catMap['Salary'], description: 'Tech Corp Monthly Salary', status: 'completed' }
  ];

  for (const tx of sampleTransactions) {
    insertTx.run(tx.date, tx.amount, tx.type, tx.category_id, tx.description, tx.status);
  }

  // Insert Savings Goals
  const insertGoal = db.prepare(
    'INSERT INTO goals (title, target_amount, current_amount, target_date, color, category) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const sampleGoals = [
    { title: 'Emergency Reserve Fund', target_amount: 15000.00, current_amount: 10500.00, target_date: '2026-12-31', color: '#10b981', category: 'Safety Net' },
    { title: 'Tokyo Summer Vacation', target_amount: 4500.00, current_amount: 3200.00, target_date: '2026-09-15', color: '#3b82f6', category: 'Travel' },
    { title: 'Electric Vehicle Downpayment', target_amount: 8000.00, current_amount: 4200.00, target_date: '2027-03-31', color: '#8b5cf6', category: 'Vehicle' },
    { title: 'New Home Office Setup', target_amount: 2500.00, current_amount: 1950.00, target_date: '2026-10-30', color: '#f59e0b', category: 'Gadgets' }
  ];

  for (const g of sampleGoals) {
    insertGoal.run(g.title, g.target_amount, g.current_amount, g.target_date, g.color, g.category);
  }

  console.log('Database successfully seeded with realistic sample data!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedData();
}
