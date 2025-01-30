"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { aptosMinter } from "../lib/aptosMinter"
import { useRouter } from "next/navigation"

interface Certificate {
  tokenId: string
  course: string
  image_url: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [mintMessage, setMintMessage] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    if (storedAddress) {
      setWalletAddress(storedAddress)
      fetchCertificates(storedAddress)
    } else {
      router.push("/")
    }
  }, [router])

  const fetchCertificates = async (address: string) => {
    try {
      const userCertificates = await aptosMinter.getUserCertificates(address)
      setCertificates(userCertificates)
    } catch (error) {
      console.error("Error fetching certificates:", error)
    }
  }

  const mintCertificate = async (course: string) => {
    setIsMinting(true)
    setMintMessage(null)

    try {
      if (!walletAddress) {
        throw new Error("Wallet address not found")
      }

      const averageScore = calculateAverageScore(course)
      const videoProgress = calculateVideoProgress(course)

      console.log(`Minting certificate for ${course}:`)
      console.log(`Average Score: ${averageScore}`)
      console.log(`Video Progress: ${videoProgress}`)

      if (videoProgress < 75) {
        throw new Error("Your video progress must be at least 75% to mint a certificate")
      }

      const transactionHash = await aptosMinter.mintCertificate(walletAddress, course, averageScore, videoProgress)

      setMintMessage(`Certificate minted successfully! Transaction hash: ${transactionHash}`)
      fetchCertificates(walletAddress)
    } catch (error) {
      console.error("Error minting certificate:", error)
      setMintMessage(error.message || "Failed to mint certificate")
    } finally {
      setIsMinting(false)
    }
  }

  const calculateAverageScore = (course: string) => {
    const scores = JSON.parse(localStorage.getItem(`quizScores`) || "{}")
    const courseScores = Object.entries(scores)
      .filter(([key]) => key.startsWith(`${course}-`))
      .map(([, score]) => score as number)

    if (courseScores.length === 0) return 0
    return Math.round(courseScores.reduce((a, b) => a + b, 0) / courseScores.length)
  }

  const calculateVideoProgress = (course: string) => {
    const progress = JSON.parse(localStorage.getItem("videoProgress") || "{}")
    const courseProgress = Object.entries(progress)
      .filter(([key]) => key.startsWith(`${course}-`))
      .map(([, prog]) => prog as number)

    if (courseProgress.length === 0) return 0
    const averageProgress = courseProgress.reduce((a, b) => a + b, 0) / courseProgress.length
    console.log(`Average progress for ${course}: ${averageProgress}`)
    return Math.round(averageProgress)
  }

  const handleLogout = () => {
    localStorage.removeItem("walletAddress")
    setWalletAddress(null)
    setCertificates([])
    router.push("/")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-4">
        Your <span className="text-red-500">Profile</span>
      </h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6">
        <div className="space-y-2">
          <p>
            <span className="text-red-500">Wallet Address:</span> {walletAddress || "Not connected"}
          </p>
          <div className="mt-4">
            <motion.button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Mint Certificate</h3>
          <div className="space-y-2">
            {["AI", "DSA", "Web Development"].map((course) => (
              <motion.button
                key={course}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => mintCertificate(course)}
                disabled={isMinting}
              >
                Mint {course} Certificate
              </motion.button>
            ))}
          </div>
          {mintMessage && (
            <p className={`mt-2 ${mintMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
              {mintMessage}
            </p>
          )}
        </div>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Certificates</h2>
        {certificates.length === 0 ? (
          <p>You don't have any certificates yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <img
                  src="https://m.media-amazon.com/images/I/71hI16-vr6L.jpg"
                  alt={`Certificate for ${cert.course}`}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold">{cert.course}</h3>
                <p className="text-sm text-gray-400">Token ID: {cert.tokenId}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

