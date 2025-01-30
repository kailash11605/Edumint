"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import VideoPlayer from "../components/VideoPlayer"
import { useRouter } from "next/navigation"

const subjects = [
  { id: "ai", name: "AI" },
  { id: "dsa", name: "DSA" },
  { id: "webdev", name: "Web Development" },
]

const topics = {
  ai: [
    { name: "Introduction to Machine Learning", youtubeId: "GwIo3gDZCVQ" },
    { name: "Neural Networks Explained", youtubeId: "aircAruvnKk" },
    { name: "Deep Learning Fundamentals", youtubeId: "6M5VXKLf4D4" },
    { name: "Natural Language Processing", youtubeId: "n25JjoixM3I" },
    { name: "Computer Vision Basics", youtubeId: "2S4nn7S8Hk4" },
    { name: "Reinforcement Learning", youtubeId: "JgvyzIkgxF0" },
    { name: "Generative Adversarial Networks", youtubeId: "5WoItGTWV54" },
    { name: "AI Ethics and Bias", youtubeId: "40P33xpfhal" },
    { name: "AI in Healthcare", youtubeId: "9pZZs0Bm3Zw" },
    { name: "Future of AI", youtubeId: "Yx6k7KC8Lx8" },
  ],
  dsa: [
    { name: "Arrays and Strings", youtubeId: "zg9ih6SVACc" },
    { name: "Linked Lists", youtubeId: "Hj_rA0dhr2I" },
    { name: "Trees and Graphs", youtubeId: "oSWTXtMglKE" },
    { name: "Sorting Algorithms", youtubeId: "kPRA0W1kECg" },
    { name: "Searching Algorithms", youtubeId: "D5SrAga1pno" },
    { name: "Dynamic Programming", youtubeId: "oBt53YbR9Kk" },
    { name: "Greedy Algorithms", youtubeId: "bC7o8P_Ste4" },
    { name: "Hashing", youtubeId: "shs0KM3wKv8" },
    { name: "Heaps and Priority Queues", youtubeId: "HqPJF2L5h9U" },
    { name: "Graph Algorithms", youtubeId: "tWVWeAqZ0WU" },
  ],
  webdev: [
    { name: "HTML & CSS Basics", youtubeId: "qz0aGYrrlhU" },
    { name: "JavaScript Fundamentals", youtubeId: "W6NZfCO5SIk" },
    { name: "React.js Tutorial", youtubeId: "Ke90Tje7VS0" },
    { name: "Node.js Crash Course", youtubeId: "fBNz5xF-Kx4" },
    { name: "RESTful API Design", youtubeId: "7YcW25PHnAA" },
    { name: "Database Design", youtubeId: "ztHopE5Wnpc" },
    { name: "Web Security Fundamentals", youtubeId: "WlpxiQwLwMw" },
    { name: "Responsive Web Design", youtubeId: "srvUrASNj0s" },
    { name: "GraphQL Basics", youtubeId: "Y0lDGjwRYKw" },
    { name: "Web Performance Optimization", youtubeId: "AQqFZ5t8uNc" },
  ],
}

const quizzes = {
  ai: {
    "Introduction to Machine Learning": [
      {
        question: "What is Machine Learning?",
        options: [
          "A type of artificial intelligence",
          "A programming language",
          "A database management system",
          "A hardware component",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which of the following is NOT a type of machine learning?",
        options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Quantum learning"],
        correctAnswer: 3,
      },
      {
        question: "What is the primary goal of supervised learning?",
        options: [
          "To cluster data points",
          "To predict outcomes based on input data",
          "To learn without labeled data",
          "To optimize decision-making in unknown environments",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which algorithm is commonly used for classification tasks?",
        options: ["K-means", "Linear regression", "Decision trees", "Principal Component Analysis (PCA)"],
        correctAnswer: 2,
      },
      {
        question: "What does the term 'overfitting' refer to in machine learning?",
        options: [
          "When a model performs well on training data but poorly on new data",
          "When a model is too simple to capture the underlying patterns",
          "When a model requires too much computational power",
          "When a model has too few parameters",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is the purpose of the training set in machine learning?",
        options: [
          "To evaluate the final performance of the model",
          "To tune the hyperparameters of the model",
          "To teach the model the underlying patterns in the data",
          "To validate the model's generalization ability",
        ],
        correctAnswer: 2,
      },
      {
        question: "Which of the following is an example of unsupervised learning?",
        options: ["Spam email detection", "Image classification", "Customer segmentation", "Sentiment analysis"],
        correctAnswer: 2,
      },
      {
        question: "What is the role of the activation function in neural networks?",
        options: [
          "To initialize the weights",
          "To introduce non-linearity",
          "To normalize the input data",
          "To calculate the loss",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which of the following is NOT a common evaluation metric for classification problems?",
        options: ["Accuracy", "Precision", "Recall", "Mean Squared Error (MSE)"],
        correctAnswer: 3,
      },
      {
        question: "What is the purpose of cross-validation in machine learning?",
        options: [
          "To increase the model's complexity",
          "To reduce overfitting",
          "To speed up the training process",
          "To visualize the data",
        ],
        correctAnswer: 1,
      },
    ],
    // Add quizzes for other AI topics with 10 questions each
  },
  dsa: {
    "Arrays and Strings": [
      {
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 0,
      },
      {
        question: "Which of the following is NOT a characteristic of arrays?",
        options: ["Fixed size", "Dynamic resizing", "Contiguous memory allocation", "Constant-time element access"],
        correctAnswer: 1,
      },
      {
        question: "What is the space complexity of an array with n elements?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 1,
      },
      {
        question: "Which operation has a time complexity of O(n) for arrays?",
        options: [
          "Accessing an element by index",
          "Inserting an element at the beginning",
          "Updating an element",
          "Deleting the last element",
        ],
        correctAnswer: 1,
      },
      {
        question: "What is the primary advantage of using a dynamic array over a static array?",
        options: ["Faster element access", "Lower memory usage", "Ability to resize", "Better cache performance"],
        correctAnswer: 2,
      },
      {
        question: "Which of the following is true about strings in most programming languages?",
        options: [
          "They are mutable",
          "They are immutable",
          "They have variable length",
          "They can only contain ASCII characters",
        ],
        correctAnswer: 1,
      },
      {
        question: "What is the time complexity of concatenating two strings of length m and n?",
        options: ["O(1)", "O(m)", "O(n)", "O(m+n)"],
        correctAnswer: 3,
      },
      {
        question: "Which data structure is commonly used to implement a dynamic array?",
        options: ["Linked List", "Stack", "Queue", "ArrayList (in Java) or Vector (in C++)"],
        correctAnswer: 3,
      },
      {
        question: "What is the purpose of the null terminator in C-style strings?",
        options: [
          "To mark the beginning of the string",
          "To mark the end of the string",
          "To separate words in the string",
          "To allocate memory for the string",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which of the following operations is typically faster on arrays compared to linked lists?",
        options: [
          "Insertion at the beginning",
          "Deletion from the middle",
          "Random access by index",
          "Appending at the end",
        ],
        correctAnswer: 2,
      },
    ],
    // Add quizzes for other DSA topics with 10 questions each
  },
  webdev: {
    "HTML & CSS Basics": [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which HTML tag is used to define an unordered list?",
        options: ["<ol>", "<li>", "<ul>", "<list>"],
        correctAnswer: 2,
      },
      {
        question: "What is the correct HTML for creating a hyperlink?",
        options: [
          "<a href='http://example.com'>Example</a>",
          "<a url='http://example.com'>Example</a>",
          "<a>http://example.com</a>",
          "<a name='http://example.com'>Example</a>",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which CSS property is used to change the text color of an element?",
        options: ["color", "text-color", "font-color", "text-style"],
        correctAnswer: 0,
      },
      {
        question: "What is the correct CSS syntax for making all the <p> elements bold?",
        options: [
          "p {text-size: bold;}",
          "p {font-weight: bold;}",
          "<p style='font-size: bold;'>",
          "p {text-style: bold;}",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["styles", "class", "font", "style"],
        correctAnswer: 3,
      },
      {
        question: "What is the purpose of CSS box model?",
        options: [
          "To create 3D boxes",
          "To specify the layout and design of elements",
          "To add animation to elements",
          "To create responsive designs",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which CSS property is used to control the space between elements?",
        options: ["spacing", "margin", "padding", "border"],
        correctAnswer: 1,
      },
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 2,
      },
      {
        question: "Which HTML tag is used to define the structure of an HTML document?",
        options: ["<body>", "<head>", "<html>", "<structure>"],
        correctAnswer: 2,
      },
    ],
    // Add quizzes for other Web Development topics with 10 questions each
  },
}

const handleTopicClick = (subject: string, topicName: string) => {
  const activity = { subject, topic: topicName, type: "video", date: new Date().toISOString() }
  const activities = JSON.parse(localStorage.getItem("activities") || "[]")
  activities.unshift(activity)
  localStorage.setItem("activities", JSON.stringify(activities))
  router.push(`/activity?domain=${subject}`)
}

export default function DashboardPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({})
  const [quizScores, setQuizScores] = useState<{ [key: string]: number }>({})
  const [currentQuiz, setCurrentQuiz] = useState<{ subject: string; topic: string } | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem("videoProgress") || "{}")
    setVideoProgress(storedProgress)
    const storedScores = JSON.parse(localStorage.getItem("quizScores") || "{}")
    setQuizScores(storedScores)
  }, [])

  useEffect(() => {
    console.log("Current video progress:", videoProgress)
  }, [videoProgress])

  const handleVideoProgress = (topicId: string, progress: number) => {
    const updatedProgress = { ...videoProgress, [topicId]: progress }
    setVideoProgress(updatedProgress)
    localStorage.setItem("videoProgress", JSON.stringify(updatedProgress))
    console.log(`Video progress updated for ${topicId}: ${progress}%`)
  }

  const handleQuizStart = (subject: string, topic: string) => {
    router.push(`/quiz?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`)
  }

  const handleAnswerClick = (selectedAnswer: number) => {
    if (!currentQuiz) return

    const currentQuizQuestions = quizzes[currentQuiz.subject][currentQuiz.topic]
    if (selectedAnswer === currentQuizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < currentQuizQuestions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      const updatedScores = { ...quizScores, [`${currentQuiz.subject}-${currentQuiz.topic}`]: score }
      setQuizScores(updatedScores)
      localStorage.setItem("quizScores", JSON.stringify(updatedScores))
      setCurrentQuiz(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-4">
        Your <span className="text-red-500">Dashboard</span>
      </h1>

      {!selectedSubject ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a subject to study:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <motion.button
                key={subject.id}
                className="bg-gray-900 p-4 rounded-lg shadow-lg text-xl font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.name}
              </motion.button>
            ))}
          </div>
        </div>
      ) : currentQuiz ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Quiz: <span className="text-red-500">{currentQuiz.topic}</span>
          </h2>
          <p className="mb-4">
            Question {currentQuestion + 1} of {quizzes[currentQuiz.subject][currentQuiz.topic].length}
          </p>
          <p className="mb-4">{quizzes[currentQuiz.subject][currentQuiz.topic][currentQuestion].question}</p>
          <div className="space-y-2">
            {quizzes[currentQuiz.subject][currentQuiz.topic][currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                className="w-full text-left bg-gray-800 p-3 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerClick(index)}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <motion.button
            className="mb-4 text-red-500"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedSubject(null)}
          >
            ← Back to subjects
          </motion.button>
          <h2 className="text-2xl font-semibold mb-4">
            Topics in <span className="text-red-500">{subjects.find((s) => s.id === selectedSubject)?.name}</span>:
          </h2>
          <div className="space-y-4">
            {topics[selectedSubject as keyof typeof topics].map((topic, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
                <VideoPlayer
                  videoId={topic.youtubeId}
                  onProgress={(progress) => handleVideoProgress(topic.youtubeId, progress)}
                />
                <div className="mt-2 flex justify-between items-center">
                  <div className="w-full mr-4">
                    <div className="bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${videoProgress[topic.youtubeId] || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Progress: {Math.round(videoProgress[topic.youtubeId] || 0)}%
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuizStart(selectedSubject, topic.name)}
                      className={`bg-red-500 text-white px-3 py-1 rounded transition-colors ${
                        (videoProgress[topic.youtubeId] || 0) >= 75
                          ? "hover:bg-red-600"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={(videoProgress[topic.youtubeId] || 0) < 75}
                    >
                      Attend Quiz
                    </button>
                    {quizScores[`${selectedSubject}-${topic.name}`] !== undefined && (
                      <span className="ml-2 text-sm">Score: {quizScores[`${selectedSubject}-${topic.name}`]}/10</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

