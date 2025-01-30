"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"

  if (isLoginPage) {
    return null
  }

  return (
    <header className="p-4 border-b border-gray-800">
      <nav className="flex justify-between items-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2040-zDBizCiHIMSUGyTSv0q2uL3kOV4Rmn.png"
              alt="Edu Mint Logo"
              className="h-8 w-8"
            />
            <span className="text-2xl font-bold">
              Edu <span className="text-red-500">Mint</span>
            </span>
          </Link>
        </motion.div>
        <ul className="flex space-x-4">
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link href="/profile" className="hover:text-red-500 transition-colors">
              Profile
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link href="/dashboard" className="hover:text-red-500 transition-colors">
              Dashboard
            </Link>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1 }}>
            <Link href="/activity" className="hover:text-red-500 transition-colors">
              Activity
            </Link>
          </motion.li>
        </ul>
      </nav>
    </header>
  )
}

