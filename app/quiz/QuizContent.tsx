"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"

interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

const quizzes: { [key: string]: { [key: string]: Question[] } } = {
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
      // Add more questions here
    ],
    // Add more AI topics here
  },
  dsa: {
    "Arrays and Strings": [
      {
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 0,
      },
      // Add more questions here
    ],
    // Add more DSA topics here
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
      // Add more questions here
    ],
    // Add more Web Development topics here
  },
}

export default function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = searchParams.get("subject") || ""
  const topic = searchParams.get("topic") || ""

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (subject && topic && quizzes[subject] && quizzes[subject][topic]) {
      setQuestions(quizzes[subject][topic])
      setError(null)
    } else {
      setError("Invalid subject or topic. Please go back to the dashboard and try again.")
    }
  }, [subject, topic])

  const handleAnswerClick = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      setShowScore(true)
      // Save the quiz score
      const quizScores = JSON.parse(localStorage.getItem("quizScores") || "{}")
      quizScores[`${subject}-${topic}`] = score + 1
      localStorage.setItem("quizScores", JSON.stringify(quizScores))
    }
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="mb-4">{error}</p>
        <motion.button
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </motion.button>
      </div>
    )
  }

  if (questions.length === 0) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">
        Quiz: <span className="text-red-500">{topic}</span>
      </h1>
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl">
            Your score: <span className="text-red-500 font-bold">{score}</span> out of {questions.length}
          </p>
          <motion.button
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </motion.button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="mb-4">{questions[currentQuestion].question}</p>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
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
      )}
    </motion.div>
  )
}

