// ChapterContent.js
// This file contains all the educational content for each chapter

const chapterContent = {
  1: {
    title: "Introduction to AI",
sections: [
  {
    type: "text",
    content: "AI, or 'Artificial Intelligence', is technology that is designed to mimic human intelligence and algorithmically 'think', and can be utilized to perform tasks that typically require human intelligence-such as recognizing patterns, making predictions, or generating language. Modern AI systems do this by identifying statistical relationships within large amounts of data and drawing connections within the dataset."
  },
  {
    type: "text",
    content: "Any time you open an AI chat tool or use other forms of generative AI (including coding assistants, content generators, or automated agents), you are interacting with a type of artificial intelligence. Some more common examples include ChatGPT, Claude, Gemini, and Deepseek, which are all classified as LLMs (large language models). LLMs are trained on vast datasets consisting of billions-sometimes even trillions-of units of data. These statistical sets provide a wide array of 'knowledge' to the computer, which is what makes AI seem to 'think'."
  },
  {
    type: "text",
    content: "It is important to note that AI is not capable of 'thinking' or 'feeling'. These are common misconceptions-AI is only capable of drawing connections based on algorithmically defined calculations (referred to as neural networks, which are linked computations designed to mimic the structure of human neurons)."
  },
  {
    type: "text",
    content: "AI is a powerful and sophisticated computational tool designed to produce the most relevant output based on patterns found in its training data. However, its capabilities also introduce important considerations. As with any advanced technology, there are inherent risks and responsibilities, including data protection, ethical usage, bias mitigation, and safe integration into existing systems. AI is no exception, and it is essential to approach its use with both awareness and diligence."
  }
]

  },
  2: {
    title: "AI Cybersecurity Basics",
    sections: [
      {
        type: "text",
        content: "This is the content for Chapter 2. You can add your module content here - text, images, videos, interactive elements, etc."
      },
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ]
  },
  3: {
    title: "Neural Networks",
    sections: [
      {
        type: "text",
        content: "This is the content for Chapter 3. You can add your module content here - text, images, videos, interactive elements, etc."
      },
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ]
  },
  4: {
    title: "Deep Learning",
    sections: [
      {
        type: "text",
        content: "This is the content for Chapter 4. You can add your module content here - text, images, videos, interactive elements, etc."
      },
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ]
  },
  5: {
    title: "AI Ethics and Applications",
    sections: [
      {
        type: "text",
        content: "This is the content for Chapter 5. You can add your module content here - text, images, videos, interactive elements, etc."
      },
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ]
  }
};

// Helper function to get chapter content by number
export function getChapterContent(chapterNum) {
  return chapterContent[chapterNum] || {
    title: `Chapter ${chapterNum}`,
    sections: [
      {
        type: "text",
        content: `Content for Chapter ${chapterNum} is not yet available.`
      }
    ]
  };
}

// Helper function to get all chapter numbers
export function getAllChapterNumbers() {
  return Object.keys(chapterContent).map(num => parseInt(num));
}

export default chapterContent;