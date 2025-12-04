import './App.css';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthForm } from './Auth';
import InfoPage from './TemplateInfoPage';
import { getChapterContent, getAllChapterNumbers } from './ChapterContent';
import { getQuizQuestions, calculateQuizScore } from './QuizContent';

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
          Artificial Intelligence (AI) has become a foundational part of modern life, powering everything from voice assistants like Siri to
           the automated systems that help us communicate, learn, and solve problems more efficiently. Knowing what AI stands for and recognizing 
           everyday examples of it isn't just academic—it helps us understand the technology shaping our future. As AI continues to influence how we 
           work, learn, and interact with the world, developing a basic understanding of its purpose, capabilities, and limitations empowers us to use 
           it responsibly and confidently. This knowledge allows us to make informed decisions, adapt to new tools, and engage with emerging technologies
            that will define the next generation of innovation.
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
  const score = calculateQuizScore(quizNum, selectedAnswers);

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
          Score: {score.correct} / {score.total} ({score.percentage}%)
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
          {score.isPerfect 
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
  selectedAnswers, 
  onBack, 
  onAnswerSelect, 
  onQuizSubmit
}) {
  const content = getChapterContent(chapterNum);
  const questions = getQuizQuestions(chapterNum);

  return (
    <div className="App">
      <div className="page-container">
        <button onClick={onBack} className="btn btn-primary back-button">
          ← Back to Home
        </button>
        
        <div className="content-wrapper">
          <h1 className="chapter-title">{content.title}</h1>
          
          {content.sections.map((section, index) => (
            <p key={index} className="chapter-text">
              {section.content}
            </p>
          ))}

          {questions.length > 0 && (
            <Quiz
              quizNum={chapterNum}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={onAnswerSelect}
              onSubmit={onQuizSubmit}
            />
          )}
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

  // Get all available chapters dynamically
  const chapterNumbers = getAllChapterNumbers();
  const modules = chapterNumbers.map(chapter => ({
    chapter,
    completed: completedModules.includes(chapter)
  }));

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleQuizSubmit = (chapterNum) => {
    setCurrentQuizNum(chapterNum);
    const score = calculateQuizScore(chapterNum, selectedAnswers);
    
    if (score.isPerfect && !completedModules.includes(chapterNum)) {
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
    const questions = getQuizQuestions(currentQuizNum);
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
        selectedAnswers={selectedAnswers}
        onBack={handleBackToHome}
        onAnswerSelect={handleAnswerSelect}
        onQuizSubmit={() => handleQuizSubmit(chapterNum)}
      />
    );
  }

  if (currentView.startsWith('quiz')) {
    const quizNum = parseInt(currentView.replace('quiz', ''));
    const questions = getQuizQuestions(quizNum);

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