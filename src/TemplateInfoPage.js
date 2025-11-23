// InfoPage.js
import React from 'react';

function InfoPage({onBack}) {
  return (
    <div 
      style={{
        backgroundColor: '#FFFFFF',
        color: '#2F4432',
        minHeight: '100vh',
        padding: '5vh 10vw',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Header */}
      <header 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #ccc',
          paddingBottom: '1rem',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ margin: 0, color: '#2F4432' }}>Gogy</h1>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#E0E0E0',
            color: '#2F4432',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ← Back to Main Page
        </button>
      </header>

      {/* Main Content Area */}
      <main 
        style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          flexGrow: 1
        }}
      >
        <h1 style={{ color: '#2F4432', marginBottom: '1rem', padding: '1rem' }}>
          SECTION TITLE
        </h1>

        <h2 style={{ color: '#2F4432', marginBottom: '1rem', padding: '1rem' }}>
          SUBSECTION TITLE
        </h2>

        <p style={{ color: '#333', padding: '1rem' }}>
          ADD SECTION TEXT
        </p>
      </main>

      {/* Bottom Quiz Section */}
      <footer 
        style={{
          backgroundColor: '#f4f4f4',
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ color: '#2F4432', marginBottom: '1rem' }}>
          Ready to test your knowledge? (SECTION) Quiz
        </h3>
        <button
          onClick={() => {}}
          style={{
            backgroundColor: '#2F4432',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Take Quiz
        </button>
      </footer>
    </div>
  );
}

export default InfoPage;
