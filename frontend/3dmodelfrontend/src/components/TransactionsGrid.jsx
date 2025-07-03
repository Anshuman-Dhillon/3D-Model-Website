// src/components/TransactionsGrid.jsx
import React from 'react';
import Transaction from './Transaction';
import '../component design/TransactionsGrid.css';

function TransactionsGrid({ transactions }) {
  const sampleData = [
    { modelName: 'Sci-Fi Spaceship', price: 19.99, date: '2025-06-29' },
    { modelName: 'Fantasy Castle', price: 34.50, date: '2025-06-15' },
    { modelName: 'Medieval Sword', price: 12.00, date: '2025-06-10' },
    { modelName: 'Modern Chair', price: 9.99, date: '2025-06-01' }
  ];

  const dataToRender = transactions?.length ? transactions : sampleData;

  return (
    <div className="transactions-grid">
      {dataToRender.map((tx, index) => (
        <Transaction
          key={index}
          modelName={tx.modelName}
          price={tx.price}
          date={tx.date}
        />
      ))}
    </div>
  );
}

export default TransactionsGrid;
