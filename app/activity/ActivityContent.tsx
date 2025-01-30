"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"

interface Activity {
  subject: string
  topic: string
  type: "video" | "quiz"
  date: string
}

const subjects = [
  { id: "ai", name: "AI" },
  { id: "dsa", name: "DSA" },
  { id: "webdev", name: "Web Development" },
]

export default function ActivityContent() {
  const [activities, setActivities] = useState<Activity[]>([])
  const searchParams = useSearchParams()
  const domain = searchParams.get("domain")

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]")
    if (domain) {
      setActivities(storedActivities.filter((activity: Activity) => activity.subject === domain))
    } else {
      setActivities(storedActivities)
    }
  }, [domain])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4"
    >
      <h1 className="text-3xl font-bold mb-6">
        Your <span className="text-red-500">Activity</span>
      </h1>

      {activities.length === 0 ? (
        <p className="text-lg">No activities yet. Start learning from the dashboard!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2">{activity.topic}</h3>
              <p className="text-red-500 mb-2">{activity.subject}</p>
              <p className="text-gray-400 text-sm">{activity.type === "video" ? "Watched video" : "Completed quiz"}</p>
              <p className="text-gray-400 text-sm">{new Date(activity.date).toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

