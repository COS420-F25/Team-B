import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage'
import React, { useState } from 'react';


function AppContent() {
  const { user, logout } = useAuth();
  const [showInfo, setShowInfo] = useState(false);


  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
  return <InfoPage onBack={() => setShowInfo(false)} />;
}

  return (
    <div className="App"> 
      <div style={{ backgroundColor: "white", minHeight: "50vh", padding: "10vh", color: "#2F4432"}}>
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span style={{ marginRight: '15px' }}>Welcome, {user.name}!</span>
          <button 
            onClick={logout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2F4432',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
          <button 
          onClick={() => setShowInfo(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#E0E0E0',
            color: '#2F4432',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Info Page
        </button>
        </div>
        
        <h1>TEAM B</h1>

        <div style={{backgroundColor: "#2F4432", minHeight: "5vh", padding: "10vh"}}>
          <h2 style={{color: "white"}}>
            Bridging the gap between innovation and comprehension on Artificial Intelligence
          </h2>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
