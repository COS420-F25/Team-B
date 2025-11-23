// ChapterContent.js
// This file contains all the educational content for each chapter

const chapterContent = {
  1: {
    title: "Introduction to AI",
    sections: [
      {
        type: "text",
        content: "This is the content for Chapter 1. You can add your module content here - text, images, videos, interactive elements, etc."
      },
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ]
  },
  2: {
    title: "Machine Learning Basics",
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