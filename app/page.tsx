"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

declare global {
  interface Window {
    aptos?: any
  }
}

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (typeof window.aptos !== "undefined") {
        const response = await window.aptos.connect()
        const account = response.address
        console.log("Connected address:", account)

        // Store the account address in localStorage
        localStorage.setItem("walletAddress", account)

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError("Please install the Aptos wallet extension to continue")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to connect. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2040-zDBizCiHIMSUGyTSv0q2uL3kOV4Rmn.png"
          alt="Edu Mint Logo"
          className="h-32 w-32 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-red-500">Edu Mint</span>
        </h1>
      </div>
      <motion.button
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? "Connecting..." : "Connect with Aptos"}
      </motion.button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </motion.div>
  )
}

