// src/components/MonthlyBudget.jsx
import React, { useState, useEffect } from 'react';
import './MonthlyBudget.css';

const MonthlyBudget = ({ expenses }) => {
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? parseFloat(saved) : 500;
  });
  
  const [editing, setEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget);

  // Get current month's expenses
  const getMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && 
               expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const monthlyTotal = getMonthlyTotal();
  const remaining = budget - monthlyTotal;
  const percentUsed = budget > 0 ? (monthlyTotal / budget) * 100 : 0;

  // Get color based on usage
  const getStatusColor = () => {
    if (percentUsed < 70) return '#00b894';
    if (percentUsed < 90) return '#fdcb6e';
    if (percentUsed < 100) return '#e17055';
    return '#d63031';
  };

  // Get status text
  const getStatusText = () => {
    if (percentUsed < 70) return '✅ On Track';
    if (percentUsed < 90) return '⚠️ Getting Close';
    if (percentUsed < 100) return '⚠️ Almost Over';
    return '🚨 Over Budget!';
  };

  const handleSaveBudget = () => {
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
      localStorage.setItem('monthlyBudget', newBudget.toString());
      setEditing(false);
    }
  };

  return (
    <div className="monthly-budget">
      <div className="budget-header">
        <div className="budget-title">
          <h3>💰 Monthly Budget</h3>
          <span className="budget-month">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="budget-edit">
          {editing ? (
            <div className="edit-budget">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                min="0"
                step="10"
                autoFocus
              />
              <button onClick={handleSaveBudget} className="save-btn">Save</button>
              <button onClick={() => setEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          ) : (
            <button onClick={() => {
              setTempBudget(budget);
              setEditing(true);
            }} className="edit-budget-btn">
              ✏️ Edit Budget
            </button>
          )}
        </div>
      </div>

      <div className="budget-stats">
        <div className="budget-stat">
          <span className="stat-label">Budget</span>
          <span className="stat-value">${budget.toFixed(2)}</span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Spent</span>
          <span className="stat-value" style={{ color: '#dc3545' }}>
            ${monthlyTotal.toFixed(2)}
          </span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Remaining</span>
          <span className="stat-value" style={{ color: remaining >= 0 ? '#00b894' : '#dc3545' }}>
            ${remaining.toFixed(2)}
          </span>
        </div>
        <div className="budget-stat">
          <span className="stat-label">Status</span>
          <span className="stat-value" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="budget-bar">
        <div className="bar-track">
          <div 
            className="bar-fill" 
            style={{ 
              width: `${Math.min(percentUsed, 100)}%`,
              background: `linear-gradient(90deg, #667eea, ${getStatusColor()})`
            }}
          ></div>
        </div>
        <div className="bar-labels">
          <span>0%</span>
          <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
            {percentUsed.toFixed(0)}% Used
          </span>
          <span>100%</span>
        </div>
      </div>

      <div className="budget-tip">
        <span className="tip-icon">💡</span>
        <span className="tip-text">
          {percentUsed < 70 ? 'You\'re doing great! Keep it up!' :
           percentUsed < 90 ? 'You\'re getting close to your budget limit.' :
           percentUsed <= 100 ? 'Careful! You\'re about to exceed your budget.' :
           'You\'ve exceeded your budget. Consider adjusting your spending.'}
        </span>
      </div>
    </div>
  );
};

export default MonthlyBudget;