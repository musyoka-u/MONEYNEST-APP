// frontend/src/components/ExpenseList.jsx
import React from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Food': '🍔',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Entertainment': '🎮',
      'Healthcare': '🏥',
      'Education': '📚',
      'Other': '📌'
    };
    return emojis[category] || '📌';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#ff6b6b',
      'Transport': '#4ecdc4',
      'Shopping': '#ffd93d',
      'Bills': '#6c5ce7',
      'Entertainment': '#fd79a8',
      'Healthcare': '#00b894',
      'Education': '#0984e3',
      'Other': '#636e72'
    };
    return colors[category] || '#636e72';
  };

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No expenses yet</p>
        <p className="empty-subtext">Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <div className="expense-header">
        <span>Title</span>
        <span>Category</span>
        <span>Amount</span>
        <span>Date</span>
        <span>Action</span>
      </div>
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-item">
          <div className="expense-title">
            <strong>{expense.title}</strong>
            {expense.description && (
              <span className="expense-description"> - {expense.description}</span>
            )}
          </div>
          <div className="expense-category" style={{ color: getCategoryColor(expense.category) }}>
            {getCategoryEmoji(expense.category)} {expense.category}
          </div>
          <div className="expense-amount">
            ${expense.amount.toFixed(2)}
          </div>
          <div className="expense-date">
            {formatDate(expense.date)}
          </div>
          <button 
            className="delete-btn"
            onClick={() => onDelete(expense.id)}
            title="Delete expense"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;