import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthForm />;
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
