import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import FeedbackPage from './TemplateFeedbackPage';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
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
        onClick={onLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#2F4432',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Logout
      </button>
      <button 
        onClick={onShowInfo}
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
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div style={{
      fontSize: '24px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }}>
      <span style={{ color: '#2F4432', fontWeight: '500' }}>
        Chapter {chapter}:
      </span>
      <button
        onClick={onChapterClick}
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
        onClick={onQuizClick}
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
        color: completed ? '#ff6b6b' : '#ddd',
        marginLeft: '5px'
      }}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div style={{ 
        backgroundColor: "white", 
        minHeight: "100vh", 
        padding: "20px",
        color: "#2F4432"
      }}>
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
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

          <div>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              marginBottom: '30px',
              color: '#2F4432'
            }}>
              Modules:
            </h2>

            {modules.map((module) => (
              <ModuleListItem
                key={module.chapter}
                chapter={module.chapter}
                completed={module.completed}
                onChapterClick={() => onModuleClick(`chapter${module.chapter}`)}
                onQuizClick={() => onModuleClick(`quiz${module.chapter}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  showResults, 
  onAnswerSelect 
}) {
  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '30px', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginBottom: '20px' }}>Question {questionIndex + 1}:</h3>
      <p style={{ marginBottom: '20px' }}>{question.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
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
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
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
  );
}

// Quiz Component (without results - results now shown in FeedbackPage)
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>
        Mini Quiz {quizNum}
      </h2>
      <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
        Test your knowledge from Chapter {quizNum}!
      </p>
      
      {questions.map((q, qIndex) => (
        <QuizQuestion
          key={qIndex}
          question={q}
          questionIndex={qIndex}
          selectedAnswer={selectedAnswers[qIndex]}
          showResults={false}
          onAnswerSelect={onAnswerSelect}
        />
      ))}

      <button
        onClick={onSubmit}
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
    </div>
  );
}

// Enhanced Feedback Page Component
function QuizFeedbackPage({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onBack, 
  onRetry 
}) {
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correct).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

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
        justifyContent: 'space-between',
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

      {/* Main Feedback Area */}
      <main
        style={{
          backgroundColor: '#f8f8f8',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <h1 style={{ color: '#2F4432', marginBottom: '1rem', padding: '1rem' }}>
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 style={{ color: '#2F4432', marginBottom: '1rem', padding: '1rem' }}>
          Score: {correctCount} / {totalQuestions} ({percentage}%)
        </h2>

        {/* Question Feedback List */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column', 
            gap: '1rem', 
            padding: '1rem',
          }}
        >
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '1rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${isCorrect ? '#28a745' : '#dc3545'}`
                }}
              >
                <h3 style={{ margin: 0, color: '#2F4432' }}>
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p style={{ margin: '0.5rem 0', color: '#333' }}>
                  {question.question}
                </p>
                <p style={{ color: '#333' }}>
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p style={{ color: '#333' }}>
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Section */}
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
          {percentage === 100 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button
          onClick={onRetry}
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
          Retake Quiz
        </button>
      </footer>
    </div>
  );
}

// Chapter Page Component
function ChapterPage({ 
  chapterNum, 
  quizData, 
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const questions = quizData[chapterNum] || [];

  return (
    <div className="App">
      <div style={{ 
        backgroundColor: "white", 
        minHeight: "100vh", 
        padding: "40px",
        color: "#2F4432"
      }}>
        <button 
          onClick={onBack}
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

          {/* Quiz integrated at the bottom of the chapter */}
          <Quiz
            quizNum={chapterNum}
            questions={questions}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={onAnswerSelect}
            onSubmit={onQuizSubmit}
          />
        </div>
      </div>
    </div>
  );
}

// Main App Content Component
function AppContent() {
  const { user, logout, loading } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [completedModules, setCompletedModules] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizNum, setCurrentQuizNum] = useState(null);

  // Quiz data
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

  const modules = [
    { chapter: 1, completed: completedModules.includes(1) },
    { chapter: 2, completed: completedModules.includes(2) },
    { chapter: 3, completed: completedModules.includes(3) },
    { chapter: 4, completed: completedModules.includes(4) },
    { chapter: 5, completed: completedModules.includes(5) },
  ];

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const questions = quizData[chapterNum] || [];
    const allCorrect = questions.every((q, idx) => selectedAnswers[idx] === q.correct);
    
    if (allCorrect && !completedModules.includes(chapterNum)) {
      setCompletedModules([...completedModules, chapterNum]);
    }
    
    // Navigate to feedback page
    setCurrentView('feedback');
  };

  const handleQuizRetry = () => {
    setSelectedAnswers({});
    setCurrentView(`chapter${currentQuizNum}`);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAnswers({});
    setCurrentQuizNum(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

  // Show feedback page after quiz submission
  if (currentView === 'feedback' && currentQuizNum) {
    const questions = quizData[currentQuizNum] || [];
    return (
      <QuizFeedbackPage
        quizNum={currentQuizNum}
        questions={questions}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onRetry={handleQuizRetry}
      />
    );
  }

  // Render chapter view
  if (currentView.startsWith('chapter')) {
    const chapterNum = parseInt(currentView.replace('chapter', ''));
    return (
      <ChapterPage
        chapterNum={chapterNum}
        quizData={quizData}
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  // Render standalone quiz view (kept for backwards compatibility)
  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = quizData[quizNum] || [];

    return (
      <div className="App">
        <div style={{ 
          backgroundColor: "white", 
          minHeight: "100vh", 
          padding: "40px",
          color: "#2F4432"
        }}>
          <button 
            onClick={handleBackToHome}
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
            <Quiz
              quizNum={quizNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={handleAnswerSelect}
              onSubmit={() => {
                setCurrentQuizNum(quizNum);
                handleQuizSubmit(quizNum);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Home view
  return (
    <HomePage
      user={user}
      modules={modules}
      onLogout={logout}
      onShowInfo={() => setShowInfo(true)}
      onModuleClick={setCurrentView}
    />
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