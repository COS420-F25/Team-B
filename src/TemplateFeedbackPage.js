import React from 'react';

function TemplateFeedbackPage ({ onBack}){
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
            justifyContent: 'spcae-between',
        }}
>
        {/*Header*/}
        <header
        style={{
            display:'flex',
            ustifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            paddingBottom: '1rem',
            marginBottom: '2rem',
    }}
>
            <h1 style={{margin: 0, color: '#2F4432'}}>Gogy</h1>
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
    {/* Main Feedback Area */}
    <main
        style={{
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            padding:'2rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            flexGrow: 1,
            overFlowY: 'auto',
        }}
    >
        <h1 style={{ color:'#2F4432', marginBottom: '1rem', padding: '1rem'}}>
            QUIZ FEEDBACK TITLE
        </h1>
        <h2 style={{color: '#2F4432', marginBottom: '1rem', padding:'1rem'}}>
            Score: X / Y (Z%)
        </h2>
    </main>
</div>
    }
}
