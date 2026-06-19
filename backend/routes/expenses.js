const express = require('express');
const router = express.Router();

// Temporary in-memory storage (we'll connect to MongoDB later)
let expenses = [];
let idCounter = 1;

// GET all expenses
router.get('/', (req, res) => {
  res.json({ success: true, data: expenses });
});

// POST a new expense
router.post('/', (req, res) => {
  const { title, amount, category, description } = req.body;
  
  if (!title || !amount) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide title and amount' 
    });
  }

  const newExpense = {
    id: idCounter++,
    title,
    amount: parseFloat(amount),
    category: category || 'Other',
    description: description || '',
    date: new Date()
  };

  expenses.push(newExpense);
  res.status(201).json({ success: true, data: newExpense });
});

// GET a single expense by ID
router.get('/:id', (req, res) => {
  const expense = expenses.find(e => e.id === parseInt(req.params.id));
  
  if (!expense) {
    return res.status(404).json({ 
      success: false, 
      error: 'Expense not found' 
    });
  }
  
  res.json({ success: true, data: expense });
});

// PUT (update) an expense
router.put('/:id', (req, res) => {
  const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id));
  
  if (expenseIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Expense not found' 
    });
  }

  const { title, amount, category, description } = req.body;
  
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    title: title || expenses[expenseIndex].title,
    amount: amount ? parseFloat(amount) : expenses[expenseIndex].amount,
    category: category || expenses[expenseIndex].category,
    description: description || expenses[expenseIndex].description
  };

  res.json({ success: true, data: expenses[expenseIndex] });
});

// DELETE an expense
router.delete('/:id', (req, res) => {
  const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id));
  
  if (expenseIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      error: 'Expense not found' 
    });
  }

  expenses.splice(expenseIndex, 1);
  res.json({ success: true, data: {} });
});

module.exports = router;