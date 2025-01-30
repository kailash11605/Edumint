import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Navigation } from "./components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Edu Mint",
  description: "Your educational journey starts here",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const pathname = usePathname()
  //const isLoginPage = pathname === "/"

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <Navigation />
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}

