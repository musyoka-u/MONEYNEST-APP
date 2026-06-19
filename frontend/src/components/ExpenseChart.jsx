// src/components/ExpenseChart.jsx
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const ExpenseChart = ({ expenses }) => {
  // Group expenses by category
  const getCategoryData = () => {
    const categories = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    return categories;
  };

  const categoryData = getCategoryData();
  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  // Colors for charts
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7',
    '#FD79A8', '#00B894', '#0984E3', '#636E72',
    '#FDCB6E', '#E17055'
  ];

  // Pie chart data
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Spending by Category',
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Spending Breakdown',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Category Spending',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  if (expenses.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: '#888'
      }}>
        <p style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</p>
        <p>No expenses to show charts yet.</p>
        <p style={{ fontSize: '0.9rem' }}>Add some expenses to see visual insights!</p>
      </div>
    );
  }

  return (
    <div className="expense-charts">
      <div className="chart-container">
        <div className="chart-box">
          <Pie data={pieData} options={chartOptions} />
        </div>
        <div className="chart-box">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;