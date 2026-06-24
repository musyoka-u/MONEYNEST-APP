// backend/models/Expense.js
const mongoose = require('mongoose');

// Define the schema (structure) for an expense
const expenseSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Title of the expense (e.g., "Groceries", "Rent")
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  
  // Amount spent
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  
  // Category of expense
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'],
    default: 'Other'
  },
  
  // Date when expense occurred
  date: {
    type: Date,
    default: Date.now
  },
  
  // Optional description
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create and export the model
module.exports = mongoose.model('Expense', expenseSchema);