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
        "A LLM ",
        "A text editor",
        "A web browser"
      ],
      correct: 1
    },
    {
      question: "What are the computations designed to mimic?",
      options: [
        "A starfish",
        "Previous quantitative modeling systems",
        "A red blood cell",
        "A neuron",
      ],
      correct: 3
    }
  ],
  2: [
    {
      question: "What is data poisoning?",
      options: [
        "Malicious alteration of data",
        "Injecting malware into a computer",
        "Ransom cyber attack",
        "Data that has been stolen"
      ],
      correct: 0
    },
    {
      question: "Which of the following would NOT result in a data leak?",
      options: [
        "Uploading resumes and cover letters to a model with full personal details",
        "Copying in large spreadsheet data for AI to analyze",
        "Asking for information about the French Revolution",
        "Asking for assistance in improving internal policy documents, and copying the contents into the prompt line"
      ],
      correct: 2
    }
  ],
  3: [
    {
      question: "Where does the bias concern originate from with AI use?",
      options: [
        "AI forming independent opinions",
        "Biased training data the AI learns from",
        "Communication between bots",
        "Neural networks"
      ],
      correct: 1
    },
    {
      question: "Can users easily see how the AI forms 'decisions'?",
      options: [
        "No",
        "Yes",
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