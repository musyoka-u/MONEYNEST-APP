// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import ExpenseChart from './components/ExpenseChart';
import MonthlyBudget from './components/MonthlyBudget';

// Use environment variable OR localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/expenses`);
      const data = await response.json();
      setExpenses(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      const data = await response.json();
      setExpenses([data.data, ...expenses]);
      return { success: true };
    } catch (err) {
      console.error('Error adding expense:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE'
      });
      setExpenses(expenses.filter(expense => expense.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting expense:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 MoneyNest</h1>
        <p>Track your expenses smartly</p>
      </header>

      <div className="container">
        <Dashboard expenses={expenses} />
        <MonthlyBudget expenses={expenses} />
        <ExpenseChart expenses={expenses} />
        
        <div className="form-section">
          <h2>Add New Expense</h2>
          <ExpenseForm onAddExpense={addExpense} />
        </div>

        <div className="list-section">
          <h2>Your Expenses</h2>
          {loading ? (
            <p>Loading expenses...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;