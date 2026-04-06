import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function GoogleSignInButton({ onError }) {
    const buttonRef = useRef(null);
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;

        function handleResponse(response) {
            handleCredentialResponse(response);
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (!window.google) return;
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleResponse,
            });
            if (buttonRef.current) {
                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: 'filled_blue',
                    size: 'large',
                    width: 300,
                    text: 'continue_with',
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup script if component unmounts
            const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (existing) existing.remove();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleCredentialResponse(response) {
        try {
            const result = await googleLogin(response.credential);
            if (result.ok) {
                navigate('/catalog');
            } else {
                onError?.(result.data?.message || 'Google sign-in failed');
            }
        } catch {
            onError?.('Google sign-in failed. Please try again.');
        }
    }

    if (!GOOGLE_CLIENT_ID) return null;

    return (
        <div className="mt-3 d-flex flex-column align-items-center">
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' }}>or</div>
            <div ref={buttonRef}></div>
        </div>
    );
}

export default GoogleSignInButton;
