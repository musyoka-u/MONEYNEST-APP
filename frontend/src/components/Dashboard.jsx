// src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css';

const Dashboard = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense = expenses.length > 0 ? (totalExpenses / expenses.length) : 0;

  const getCategoryTotals = () => {
    const totals = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  };

  const categoryTotals = getCategoryTotals();
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const latestExpense = expenses.length > 0 ? expenses[0] : null;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Expenses</p>
            <p className="stat-value">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Total Transactions</p>
            <p className="stat-value">{expenses.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <p className="stat-label">Average Expense</p>
            <p className="stat-value">${averageExpense.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <p className="stat-label">Top Category</p>
            <p className="stat-value">
              {topCategories.length > 0 ? topCategories[0][0] : 'None'}
            </p>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="category-breakdown">
          <h3>Top Spending Categories</h3>
          <div className="category-bars">
            {topCategories.map(([category, total]) => {
              const percentage = (total / totalExpenses) * 100;
              return (
                <div key={category} className="category-bar">
                  <span className="category-name">{category}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="category-total">${total.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {latestExpense && (
        <div className="latest-expense">
          <h3>Latest Transaction</h3>
          <p>
            <strong>{latestExpense.title}</strong> - ${latestExpense.amount.toFixed(2)}
            <span className="latest-date"> ({new Date(latestExpense.date).toLocaleDateString()})</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;