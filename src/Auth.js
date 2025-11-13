import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthForm = () => {
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '30px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#2F4432', marginBottom: '20px' }}>
        Welcome to TEAM B
      </h2>
      
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Sign in to continue
      </p>
      
      <button
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          color: '#444',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontWeight: '500'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
          <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.71.48-1.62.77-2.7.77-2.07 0-3.83-1.4-4.45-3.28H2.18v2.07A7.98 7.98 0 0 0 8.98 17z"/>
          <path fill="#FBBC05" d="M4.53 10.54a4.8 4.8 0 0 1 0-3.08V5.39H2.18a7.98 7.98 0 0 0 0 7.22l2.35-2.07z"/>
          <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.98 7.98 0 0 0 2.18 5.39l2.35 2.07c.62-1.88 2.38-3.28 4.45-3.28z"/>
        </svg>
        Sign in with Google
      </button>
      
      {error && (
        <p style={{ 
          color: 'red', 
          fontSize: '14px', 
          marginTop: '15px' 
        }}>
          {error}
        </p>
      )}
    </div>
  );
};
