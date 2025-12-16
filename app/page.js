'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>Expense Tracker</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Track your personal expenses</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Total Spent</div>
          <div style={{ fontSize: '28px', fontWeight: '600' }}>${total.toFixed(2)}</div>
        </div>
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <div key={cat} style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{cat}</div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>${amt.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <form onSubmit={addExpense} style={{ marginBottom: '40px', padding: '24px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Add Expense</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white' }}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>
          <button
            type="submit"
            style={{ padding: '12px', background: '#000', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            Add Expense
          </button>
        </div>
      </form>

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>No expenses yet. Add your first expense above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {expenses.map(expense => (
              <div
                key={expense.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', border: '1px solid #eee', borderRadius: '6px' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{expense.description}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {expense.category} • {expense.date}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>${expense.amount.toFixed(2)}</div>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    style={{ padding: '6px 12px', background: '#fee', color: '#c00', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
