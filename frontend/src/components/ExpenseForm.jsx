// src/components/ExpenseForm.jsx
import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      setMessage('Please fill in title and amount');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const result = await onAddExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      if (result.success) {
        setMessage('✅ Expense added successfully!');
        setFormData({
          title: '',
          amount: '',
          category: 'Other',
          description: ''
        });
      } else {
        setMessage('❌ Failed to add expense: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Groceries"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">📄 Bills</option>
            <option value="Entertainment">🎮 Entertainment</option>
            <option value="Healthcare">🏥 Healthcare</option>
            <option value="Education">📚 Education</option>
            <option value="Other">📌 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
          />
        </div>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Expense 💰'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default ExpenseForm;