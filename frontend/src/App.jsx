// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import ExpenseChart from './components/ExpenseChart';
import MonthlyBudget from './components/MonthlyBudget';
import Login from './pages/Login';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const { user, logout } = useAuth();  // ← Remove 'token' from here
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get token
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const token = getToken();  // ← Get token directly
      console.log('Loading expenses with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_URL}/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to load expenses');
      }
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const token = getToken();  // ← Get token directly
      console.log('Adding expense with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        console.error('No token found!');
        return { success: false, error: 'Not logged in' };
      }

      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });
      const data = await response.json();
      console.log('Add expense response:', data);
      
      if (data.success) {
        setExpenses([data.data, ...expenses]);
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to add expense' };
    } catch (err) {
      console.error('Error adding expense:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token = getToken();  // ← Get token directly
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(expenses.filter(expense => expense.id !== id));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Error deleting expense:', err);
      return { success: false, error: err.message };
    }
  };

  // If not logged in, show login page
  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>💰 MoneyNest</h1>
            <p>Track your expenses smartly</p>
          </div>
          <div className="header-right">
            <span className="user-name">👋 {user.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
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