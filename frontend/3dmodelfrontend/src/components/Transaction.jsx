// src/components/Transaction.jsx
import React from 'react';
import '../component design/Transaction.css';

function Transaction({ modelName, price, orderNumber }) {
  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <strong>{modelName}</strong>
        <span className="transaction-price">${price.toFixed(2)}</span>
      </div>
      <div className="transaction-order-number">{orderNumber || 'Order #111-2222222-3333333'}</div>
    </div>
  );
}

export default Transaction;
