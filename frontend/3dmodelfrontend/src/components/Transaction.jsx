// src/components/Transaction.jsx
import React from 'react';
import '../component design/Transaction.css';

function Transaction({ modelName, price, date }) {
  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <strong>{modelName}</strong>
        <span className="transaction-price">${price.toFixed(2)}</span>
      </div>
      <div className="transaction-date">{new Date(date).toLocaleDateString()}</div>
    </div>
  );
}

export default Transaction;
