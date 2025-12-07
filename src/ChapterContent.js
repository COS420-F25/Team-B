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
    title: "AI Cybersecurity and Legal Basics",
    sections: [
  {
    type: "text",
    content:
      "Artificial Intelligence introduces significant advantages to organizations, an opportunity to automate and significantly improve efficiency, but it also has shaken the cybersecurity and legal environment in ways that require careful consideration. AI systems process large quantities of data, automate decision-making, and often integrate with sensitive environments- each of which introduces potential vulnerabilities and regulatory/compliance obligations."
  },
  {
    type: "text",
    content:
      "One of the primary cybersecurity concerns with AI is the protection of data. AI models are trained on vast datasets, and the security of this information is critical. Improper handling of user data may expose sensitive information through breaches, model leaks, or unintended inference (where the system reveals information that was never explicitly given). Organizations must ensure that data used in AI systems is stored securely, encrypted, and accessed only with appropriate authorization. It is CRITICAL to note that for most models, unless the ‘use user prompts to improve our dataset’ setting is disabled, everything you copy into a model will potentially go to its training data. So, if any confidential data is sent in the prompt line, the threat of a data leak is imminent."
  },
  {
    type: "text",
    content:
      "AI technologies can also be vulnerable to attack. Threats include data poisoning (maliciously altering training data), prompt injection (manipulating model outputs through crafted inputs), model extraction, and adversarial examples. These risks highlight the need for robust security testing, continuous monitoring, and strict access controls. Any AI system integrated into an organization’s workflow must be treated as part of the broader cybersecurity ecosystem."
  },
  {
    type: "text",
    content:
      "AI use also intersects with several legal and regulatory frameworks. Depending on the institution or industry, AI systems may fall under requirements (such as FERPA, HIPAA, GDPR, CCPA, NIST guidelines), or internal corporate/organization policy. These regulations aim to protect user privacy, ensure data transparency, and define how sensitive information can be processed or shared. Failure to comply may result in legal penalties, reputational damage, and operational disruptions. AI use is an extension of this, as mishandling or inappropriate usage can violate these regulations."
  },
  {
    type: "text",
    content:
      "Ethical and legal considerations extend beyond data handling. AI systems can unintentionally produce biased or discriminatory outputs due to patterns learned from training data. This creates risks related to fairness, accountability, and misuse. Organizations deploying AI tools must consider how decisions are made, whether outputs impact individuals equitably, and what guardrails are necessary to ensure responsible use. If these are not implemented, there is the possibility a user could file a lawsuit for discrimination and unlawful termination depending on the circumstance, due to biases in an AI model. "
  },
  {
    type: "text",
    content:
      "Ultimately, AI should be approached with a risk-aware mindset. Implementing AI safely requires clear governance policies, routine security assessments, compliance reviews, and well-defined user practices. AI is a powerful technology, but its integration comes with responsibilities. Understanding its legal implications, cybersecurity risks, and ethical considerations is essential for ensuring that AI is used safely, responsibly, and in alignment with organizational values and legal standards."
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