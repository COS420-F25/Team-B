import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import { useState } from 'react';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'chapter1', 'quiz1', etc.
  const [completedModules, setCompletedModules] = useState([]); // Track completed modules
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  // Quiz questions for each module
  const quizData = {
    1: [
      {
        question: "What does AI stand for?",
        options: ["Artificial Intelligence", "Advanced Internet", "Automated Information", "Applied Innovation"],
        correct: 0
      },
      {
        question: "Which of these is an example of AI?",
        options: ["A calculator", "A voice assistant like Siri", "A text editor", "A web browser"],
        correct: 1
      }
    ],
    2: [
      {
        question: "What is machine learning?",
        options: ["Teaching machines to learn from data", "Programming robots", "Creating websites", "Building computers"],
        correct: 0
      },
      {
        question: "Which company developed ChatGPT?",
        options: ["Google", "Microsoft", "OpenAI", "Apple"],
        correct: 2
      }
    ],
    3: [
      {
        question: "What is neural network inspired by?",
        options: ["Computer circuits", "The human brain", "The internet", "Math equations"],
        correct: 1
      },
      {
        question: "What does NLP stand for in AI?",
        options: ["Natural Language Processing", "New Learning Protocol", "Neural Link Program", "Network Language Platform"],
        correct: 0
      }
    ],
    4: [
      {
        question: "What is deep learning?",
        options: ["Learning underwater", "A subset of machine learning", "A type of database", "A programming language"],
        correct: 1
      },
      {
        question: "Which AI can generate images from text?",
        options: ["Excel", "PowerPoint", "DALL-E", "Photoshop"],
        correct: 2
      }
    ],
    5: [
      {
        question: "What is the main concern about AI ethics?",
        options: ["Cost", "Bias and fairness", "Speed", "Size"],
        correct: 1
      },
      {
        question: "What is reinforcement learning?",
        options: ["Learning by trial and error", "Learning from books", "Learning languages", "Learning to code"],
        correct: 0
      }
    ]
  };

  // Module data
  const modules = [
    { chapter: 1, completed: completedModules.includes(1) },
    { chapter: 2, completed: completedModules.includes(2) },
    { chapter: 3, completed: completedModules.includes(3) },
    { chapter: 4, completed: completedModules.includes(4) },
    { chapter: 5, completed: completedModules.includes(5) },
  ];

  // Render chapter view
  if (currentView.startsWith('chapter')) {
    const chapterNum = currentView.replace('chapter', '');
    return (
      <div className="App">
        <div style={{ 
          backgroundColor: "white", 
          minHeight: "100vh", 
          padding: "40px",
          color: "#2F4432"
        }}>
          <button 
            onClick={() => setCurrentView('home')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2F4432',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '30px'
            }}
          >
            ← Back to Home
          </button>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>
              Chapter {chapterNum}
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
              This is the content for Chapter {chapterNum}. You can add your module content here - 
              text, images, videos, interactive elements, etc.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginTop: '20px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render quiz view
  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = quizData[quizNum] || [];

    const handleAnswerSelect = (questionIndex, optionIndex) => {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex
      });
    };

    const handleSubmit = () => {
      setShowResults(true);
      
      // Check if all answers are correct
      const allCorrect = questions.every((q, idx) => selectedAnswers[idx] === q.correct);
      
      if (allCorrect) {
        // Mark this module as completed
        if (!completedModules.includes(quizNum)) {
          setCompletedModules([...completedModules, quizNum]);
        }
      }
    };

    const allCorrect = showResults && questions.every((q, idx) => selectedAnswers[idx] === q.correct);
    const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

    return (
      <div className="App">
        <div style={{ 
          backgroundColor: "white", 
          minHeight: "100vh", 
          padding: "40px",
          color: "#2F4432"
        }}>
          <button 
            onClick={() => {
              setCurrentView('home');
              setShowResults(false);
              setSelectedAnswers({});
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2F4432',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '30px'
            }}
          >
            ← Back to Home
          </button>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>
              Mini Quiz {quizNum}
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
              Test your knowledge from Chapter {quizNum}!
            </p>
            
            {/* Quiz questions */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '30px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginBottom: '20px' }}>Question {qIndex + 1}:</h3>
                <p style={{ marginBottom: '20px' }}>{q.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[qIndex] === oIndex;
                    const isCorrect = q.correct === oIndex;
                    let backgroundColor = 'white';
                    let borderColor = '#ddd';
                    
                    if (showResults && isSelected) {
                      backgroundColor = isCorrect ? '#d4edda' : '#f8d7da';
                      borderColor = isCorrect ? '#28a745' : '#dc3545';
                    } else if (isSelected) {
                      borderColor = '#2F4432';
                    }
                    
                    return (
                      <button
                        key={oIndex}
                        onClick={() => !showResults && handleAnswerSelect(qIndex, oIndex)}
                        style={{
                          padding: '15px',
                          backgroundColor,
                          border: `2px solid ${borderColor}`,
                          borderRadius: '4px',
                          cursor: showResults ? 'default' : 'pointer',
                          textAlign: 'left',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                        disabled={showResults}
                      >
                        {String.fromCharCode(65 + oIndex)}) {option}
                        {showResults && isCorrect && ' ✓'}
                        {showResults && isSelected && !isCorrect && ' ✗'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Submit button */}
            {!showResults && (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                style={{
                  padding: '15px 30px',
                  backgroundColor: allAnswered ? '#2F4432' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: allAnswered ? 'pointer' : 'not-allowed',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                Submit Quiz
              </button>
            )}

            {/* Results */}
            {showResults && (
              <div style={{
                padding: '30px',
                backgroundColor: allCorrect ? '#d4edda' : '#f8d7da',
                borderRadius: '8px',
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <h2 style={{ 
                  color: allCorrect ? '#155724' : '#721c24',
                  marginBottom: '15px'
                }}>
                  {allCorrect ? '🎉 Perfect Score!' : '❌ Not quite there yet'}
                </h2>
                <p style={{ 
                  fontSize: '18px',
                  color: allCorrect ? '#155724' : '#721c24'
                }}>
                  {allCorrect 
                    ? `Congratulations! You've completed Chapter ${quizNum}!`
                    : 'Review the material and try again to earn your star.'}
                </p>
                {!allCorrect && (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setShowResults(false);
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#2F4432',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '15px',
                      fontSize: '16px'
                    }}
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <div className="App"> 
      <div style={{ 
        backgroundColor: "white", 
        minHeight: "100vh", 
        padding: "20px",
        color: "#2F4432"
      }}>
        {/* User info header */}
        <div style={{ 
          textAlign: 'right', 
          marginBottom: '40px',
          padding: '0 40px'
        }}>
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                marginRight: '10px',
                verticalAlign: 'middle'
              }} 
            />
          )}
          <span style={{ marginRight: '15px' }}>Welcome, {user.displayName}!</span>
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

        {/* Main content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {/* Gogy Header */}
          <div style={{
            backgroundColor: '#999',
            padding: '40px',
            marginBottom: '40px',
            borderRadius: '8px'
          }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '72px', 
              margin: '0',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Gogy
            </h1>
          </div>

          {/* Introduction text */}
          <p style={{ 
            fontSize: '18px', 
            lineHeight: '1.6',
            marginBottom: '40px',
            color: '#333'
          }}>
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          {/* Modules Section */}
          <div>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              marginBottom: '30px',
              color: '#2F4432'
            }}>
              Modules:
            </h2>

            {/* Module List */}
            {modules.map((module) => (
              <div key={module.chapter} style={{
                fontSize: '24px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <span style={{ color: '#2F4432', fontWeight: '500' }}>
                  Chapter {module.chapter}:
                </span>
                <button
                  onClick={() => setCurrentView(`chapter${module.chapter}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#61dafb',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0'
                  }}
                >
                  Link
                </button>
                <span style={{ color: '#2F4432' }}>,</span>
                <button
                  onClick={() => setCurrentView(`quiz${module.chapter}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#61dafb',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0'
                  }}
                >
                  mini quiz
                </button>
                <span style={{ 
                  fontSize: '32px',
                  color: module.completed ? '#ff6b6b' : '#ddd',
                  marginLeft: '5px'
                }}>
                  ★
                </span>
              </div>
            ))}
          </div>
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