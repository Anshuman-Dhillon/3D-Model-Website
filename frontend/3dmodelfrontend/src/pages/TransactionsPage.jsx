import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetTransactions, apiConfirmCheckout } from '../api';
import TransactionsGrid from '../components/TransactionsGrid';

export default function TransactionsPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        async function load() {
            // If redirected from Stripe, confirm the checkout
            const sessionId = searchParams.get('session_id');
            if (sessionId) {
                try {
                    const result = await apiConfirmCheckout(sessionId);
                    if (result.ok) {
                        setMessage('Payment successful! Your models are now available.');
                    }
                } catch {
                    // Webhook may have already fulfilled it
                }
            }

            const data = await apiGetTransactions();
            setTransactions(Array.isArray(data) ? data : []);
            setLoading(false);
        }
        load();
    }, [user, searchParams]);

    if (loading) return <p className="text-center text-light mt-5">Loading...</p>;

    return (
        <div>
            {message && (
                <div className="alert alert-success text-center mx-auto mt-3" style={{ maxWidth: 600 }}>
                    {message}
                </div>
            )}
            <TransactionsGrid transactions={transactions} />
        </div>
    );
}

