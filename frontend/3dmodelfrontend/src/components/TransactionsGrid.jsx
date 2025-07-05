// src/components/TransactionsGrid.jsx
import React from 'react';
import Transaction from './Transaction';
import '../component design/TransactionsGrid.css';

function groupByDate(transactions) {
  return transactions.reduce((acc, tx) => {
    const dateStr = new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(tx);
    
    return acc;
  }, {});
}

function TransactionsGrid({ transactions }) {
  const sampleData = [
    { modelName: 'Sci-Fi Spaceship', price: 19.99, date: '2024-12-29', orderNumber: 'Order #111-2222222-3333333' },
    { modelName: 'Fantasy Castle', price: 34.50, date: '2025-01-06', orderNumber: 'Order #111-2222222-3333334' },
    { modelName: 'Medieval Sword', price: 12.00, date: '2025-03-31', orderNumber: 'Order #111-2222222-3333335' },
    { modelName: 'Modern Chair', price: 9.99, date: '2025-06-12', orderNumber: 'Order #111-2222222-3333336' }
  ];

  const dataToRender = transactions?.length ? transactions : sampleData;
  const grouped = groupByDate(dataToRender);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="transactions-grid" style={{ marginTop: "100px", marginBottom: "100px" }}>
      <h2 className="transactions-title">Transaction History</h2>
      {sortedDates.map(date => (
        <div key={date} className="transaction-date-group">
          <div className="transaction-date-header">{date}</div>
          {grouped[date].map((tx, idx) => (
            <Transaction
              key={idx}
              modelName={tx.modelName}
              price={tx.price}
              date={tx.date}
              orderNumber={tx.orderNumber}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TransactionsGrid;
