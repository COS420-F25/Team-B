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
      correct: 0,
      explanation:
        "AI stands for Artificial Intelligence, which refers to computer systems designed to perform tasks that normally require human intelligence."
    },
    {
      question: "Which of these is an example of AI?",
      options: [
        "A calculator",
        "A LLM ",
        "A text editor",
        "A web browser"
      ],
      correct: 1,
      explanation:
        "A large language model (LLM) is a type of AI system trained on huge text datasets to generate and analyze language."
    },
    {
      question: "What are the computations designed to mimic?",
      options: [
        "A starfish",
        "Previous quantitative modeling systems",
        "A red blood cell",
        "A neuron",
      ],
      correct: 3,
      explanation:
        "The computations in modern AI models are organized to mimic the connections of neurons in the human brain."
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
      correct: 0,
      explanation:
        "Data poisoning is when an attacker intentionally alters or injects bad data into a training set so the model learns harmful or incorrect patterns."
    },
    {
      question: "Which of the following would NOT result in a data leak?",
      options: [
        "Uploading resumes and cover letters to a model with full personal details",
        "Copying in large spreadsheet data for AI to analyze",
        "Asking for information about the French Revolution",
        "Asking for assistance in improving internal policy documents, and copying the contents into the prompt line"
      ],
      correct: 2,
      explanation:
        "Simply asking about a historical topic like the French Revolution does not involve sending sensitive personal or organizational data to the model."
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
      correct: 1,
      explanation:
        "Place Holder."
    },
    {
      question: "What does NLP stand for in AI?",
      options: [
        "Natural Language Processing",
        "New Learning Protocol",
        "Neural Link Program",
        "Network Language Platform"
      ],
      correct: 0,
      explanation:
        "Place Holder"
    }
  ],
  4: [
    {
      question: "Why do AI data centers use large amounts of water?",
      options: [
        "To clean hardware components daily.",
        "To keep servers cool and prevent overheating.",
        "To generate electricity for the servers.",
        "To improve internet connection speeds."
      ],
      correct: 1,
      explanation:
        "Data centers use water in their cooling systems to remove heat from servers and keep them within safe operating temperatures."
    },
    {
      question: "What environmental concern is associated with AI water consumption?",
      options: [
        "AI increases rainfall in local regions.",
        "AI eliminates the need for municipal water treatment.",
        "Data centers may compete with local communities for limited water resources.",
        "AI automatically replenishes groundwater supplies."
      ],
      correct: 2,
      explanation:
        "In water-stressed regions, the large water demand from data centers can compete with the needs of local communities and ecosystems."
    },
    {
      question: "What is one challenge related to understanding AI's water usage?",
      options: [
        "Too much public information is available about water reporting.",
        "Water usage does not affect the environment at all.",
        "AI requires no cooling and therefore no water.",
        "Tech companies rarely disclose clear data about how much water their facilities use."
      ],
      correct: 3,
      explanation:
      "Many companies provide limited or incomplete reporting about how much water their AI and data center operations actually consume."
    }
  ],
  5: [
    {
      question: "Who introduced the concept of a 'universal machine' and the Turing Test?",
      options: [
        "John McCarthy",
        "Alan Turing",
        "Marvin Minsky",
        "Herbert Simon"
      ],
      correct: 1,
      explanation:
        "Alan Turing proposed the idea of a universal machine and the Turing Test, which are foundational concepts in the history of AI."
    },
    {
      question: "When was the term 'Artificial Intelligence' officially coined?",
      options: [
        "1942 at the ENIAC Symposium",
        "1983 during the first AI Winter",
        "1997 after IBM's Deep Blue match",
        "1956 at the Dartmouth Conference",
      ],
      correct: 3,
      explanation:
        "The term 'Artificial Intelligence' was coined at the 1956 Dartmouth Conference, which is often considered the birth of AI as a formal field."
    },
    {
      question: "What major development helped spark the modern era of AI beginning around 2012?",
      options: [
        "The invention of vacuum tubes",
        "The creation of mechanical calculators",
        "AI-generated artwork",
        "The rise of deep learning and neural networks"
      ],
      correct: 3,
      explanation:
        "Around 2012, advances in deep learning and neural networks led to major performance jumps, sparking the modern AI boom."
    }
  ],
  6: [
    {
      question: "What is one major reason AI training consumes large amounts of energy?",
      options: [
        "Training requires thousands of high-performance GPUs running complex calculations.",
        "AI models need to be stored in physical filing cabinets.",
        "AI systems must be operated underwater.",
        "Training only occurs for a few seconds but repeats unnecessarily."
      ],
      correct: 0,
      explanation:
        "Training large AI models can require thousands of GPUs running heavy computations for long periods, which consumes a lot of electricity."
    },
    {
      question: "How can AI contribute to carbon emissions?",
      options: [
        "AI models physically burn fuel when making predictions.",
        "AI directly emits carbon dioxide through vents.",
        "Data centers are often powered by fossil-fuel-based electricity.",
        "AI reduces emissions by default regardless of energy source."
      ],
      correct: 2,
      explanation:
        "If data centers that run AI workloads draw power from fossil fuels, their electricity use indirectly leads to carbon dioxide emissions."
    },
    {
      question: "Which strategy can reduce AI's overall energy footprint?",
      options: [
        "Using more GPUs even when unnecessary.",
        "Optimizing neural networks through pruning or quantization.",
        "Ignoring cooling system efficiency.",
        "Running all computations on outdated hardware."
      ],
      correct: 1,
      explanation:
        "Techniques like pruning and quantization make models more efficient, reducing the amount of computation and energy needed."
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