// src/components/TransactionsGrid.jsx
import React from 'react';
import Transaction from './Transaction';
import '../component design/TransactionsGrid.css';

function groupByDate(transactions) {
  return transactions.reduce((acc, tx) => {
    const d = tx.date || tx.createdAt || tx.updatedAt;
    const dateStr = new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(tx);
    return acc;
  }, {});
}

function TransactionsGrid({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="transactions-grid" style={{ marginTop: "100px", marginBottom: "100px" }}>
        <h2 className="transactions-title">Transaction History</h2>
        <p className="text-center text-light">No transactions yet.</p>
      </div>
    );
  }

  const grouped = groupByDate(transactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="transactions-grid" style={{ marginTop: "100px", marginBottom: "100px" }}>
      <h2 className="transactions-title">Transaction History</h2>
      {sortedDates.map(date => (
        <div key={date} className="transaction-date-group">
          <div className="transaction-date-header">{date}</div>
          {grouped[date].map((tx, idx) => (
            <Transaction
              key={tx._id || idx}
              modelName={tx.modelName}
              price={tx.amount}
              date={tx.date || tx.createdAt}
              orderNumber={tx._id ? `Order #${tx._id.slice(-8).toUpperCase()}` : ''}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TransactionsGrid;
