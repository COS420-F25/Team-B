import './App.css';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';

// Header Component
function Header({ user, onLogout, onShowInfo }) {
  return (
    <div className="header-container">
      {user.photoURL && (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="profile-image"
        />
      )}
      <span className="welcome-text">Welcome, {user.displayName}!</span>
      <button onClick={onLogout} className="btn btn-primary">
        Logout
      </button>
      <button onClick={onShowInfo} className="btn btn-secondary">
        Info Page
      </button>
    </div>
  );
}

// Module List Item Component
function ModuleListItem({ chapter, completed, onChapterClick, onQuizClick }) {
  return (
    <div className="module-list-item">
      <span className="module-chapter-label">
        Chapter {chapter}:
      </span>
      <button onClick={onChapterClick} className="module-link">
        Link
      </button>
      <span className="module-separator">,</span>
      <button onClick={onQuizClick} className="module-link">
        mini quiz
      </button>
      <span className={`module-star ${completed ? 'completed' : ''}`}>
        ★
      </span>
    </div>
  );
}

// Home Page Component
function HomePage({ user, modules, onLogout, onShowInfo, onModuleClick }) {
  return (
    <div className="App"> 
      <div className="page-container">
        <Header user={user} onLogout={onLogout} onShowInfo={onShowInfo} />

        <div className="content-wrapper">
          <div className="hero-banner">
            <h1 className="hero-title">Gogy</h1>
          </div>

          <p className="intro-text">
            It is important to know stuff about AI Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. sem.
          </p>

          <div>
            <h2 className="section-title">Modules:</h2>

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
    <div className="quiz-question-box">
      <h3 className="question-number">Question {questionIndex + 1}:</h3>
      <p className="question-text">{question.question}</p>
      <div className="options-container">
        {question.options.map((option, oIndex) => {
          const isSelected = selectedAnswer === oIndex;
          const isCorrect = question.correct === oIndex;
          
          let buttonClass = 'option-button';
          if (showResults && isSelected) {
            buttonClass += isCorrect ? ' option-correct' : ' option-incorrect';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }
          
          return (
            <button
              key={oIndex}
              onClick={() => !showResults && onAnswerSelect(questionIndex, oIndex)}
              className={buttonClass}
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

// Quiz Component
function Quiz({ 
  quizNum, 
  questions, 
  selectedAnswers, 
  onAnswerSelect, 
  onSubmit
}) {
  const allAnswered = questions.every((q, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Mini Quiz {quizNum}</h2>
      <p className="quiz-description">
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
        className={`submit-button ${allAnswered ? 'enabled' : 'disabled'}`}
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
    <div className="feedback-page">
      <header className="feedback-header">
        <h1 className="feedback-logo">Gogy</h1>
        <button onClick={onBack} className="btn btn-secondary">
          ← Back to Main Page
        </button>
      </header>

      <main className="feedback-main">
        <h1 className="feedback-title">
          Chapter {quizNum} Quiz Results
        </h1>
        <h2 className="feedback-score">
          Score: {correctCount} / {totalQuestions} ({percentage}%)
        </h2>

        <div className="feedback-questions-list">
          {questions.map((question, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <div
                key={idx}
                className={`feedback-question-box ${isCorrect ? 'correct' : 'incorrect'}`}
              >
                <h3 className="feedback-question-header">
                  Question {idx + 1} {isCorrect ? '✓' : '✗'}
                </h3>
                <p className="feedback-question-text">
                  {question.question}
                </p>
                <p className="feedback-answer">
                  <strong>Your answer:</strong> {question.options[userAnswer] || 'Not answered'}
                </p>
                {!isCorrect && (
                  <p className="feedback-answer">
                    <strong>Correct answer:</strong> {question.options[question.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <footer className="feedback-footer">
        <h3 className="feedback-footer-title">
          {percentage === 100 
            ? '🎉 Perfect Score! Want to try another quiz?' 
            : 'Want to try again?'}
        </h3>
        <button onClick={onRetry} className="btn btn-primary">
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
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">Chapter {chapterNum}</h1>
          <p className="chapter-text">
            This is the content for Chapter {chapterNum}. You can add your module content here - 
            text, images, videos, interactive elements, etc.
          </p>
          <p className="chapter-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

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
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  if (showInfo) {
    return <InfoPage onBack={() => setShowInfo(false)} />;
  }

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

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = quizData[quizNum] || [];

    return (
      <div className="App">
        <div className="page-container">
          <button onClick={handleBackToHome} className="btn btn-primary back-button">
            ← Back to Home
          </button>
          
          <div className="content-wrapper">
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