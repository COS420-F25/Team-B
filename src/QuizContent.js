// QuizContent.js
// This file contains all quiz questions and answers for each chapter

const quizData = {
  1: [
    {
      question: "What does AI stand for?",
      options: [
        "Artificial Intelligence",
        "Advanced Internet",
        "Automated Information",
        "Applied Innovation"
      ],
      correct: 0
    },
    {
      question: "Which of these is an example of AI?",
      options: [
        "A calculator",
        "A voice assistant like Siri",
        "A text editor",
        "A web browser"
      ],
      correct: 1
    }
  ],
  2: [
    {
      question: "What is machine learning?",
      options: [
        "Teaching machines to learn from data",
        "Programming robots",
        "Creating websites",
        "Building computers"
      ],
      correct: 0
    },
    {
      question: "Which company developed ChatGPT?",
      options: [
        "Google",
        "Microsoft",
        "OpenAI",
        "Apple"
      ],
      correct: 2
    }
  ],
  3: [
    {
      question: "What is neural network inspired by?",
      options: [
        "Computer circuits",
        "The human brain",
        "The internet",
        "Math equations"
      ],
      correct: 1
    },
    {
      question: "What does NLP stand for in AI?",
      options: [
        "Natural Language Processing",
        "New Learning Protocol",
        "Neural Link Program",
        "Network Language Platform"
      ],
      correct: 0
    }
  ],
  4: [
    {
      question: "What is deep learning?",
      options: [
        "Learning underwater",
        "A subset of machine learning",
        "A type of database",
        "A programming language"
      ],
      correct: 1
    },
    {
      question: "Which AI can generate images from text?",
      options: [
        "Excel",
        "PowerPoint",
        "DALL-E",
        "Photoshop"
      ],
      correct: 2
    }
  ],
  5: [
    {
      question: "What is the main concern about AI ethics?",
      options: [
        "Cost",
        "Bias and fairness",
        "Speed",
        "Size"
      ],
      correct: 1
    },
    {
      question: "What is reinforcement learning?",
      options: [
        "Learning by trial and error",
        "Learning from books",
        "Learning languages",
        "Learning to code"
      ],
      correct: 0
    }
  ]
};

// Helper function to get quiz questions by chapter number
export function getQuizQuestions(chapterNum) {
  return quizData[chapterNum] || [];
}

// Helper function to get all quiz chapter numbers
export function getAllQuizChapters() {
  return Object.keys(quizData).map(num => parseInt(num));
}

// Helper function to check if a chapter has a quiz
export function hasQuiz(chapterNum) {
  return quizData.hasOwnProperty(chapterNum);
}

// Helper function to calculate quiz score
export function calculateQuizScore(chapterNum, selectedAnswers) {
  const questions = getQuizQuestions(chapterNum);
  if (questions.length === 0) return { correct: 0, total: 0, percentage: 0 };
  
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correct).length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  return {
    correct: correctCount,
    total: totalQuestions,
    percentage: percentage,
    isPerfect: correctCount === totalQuestions
  };
}

export default quizData;