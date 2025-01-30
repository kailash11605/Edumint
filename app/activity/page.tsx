import { Suspense } from "react"
import ActivityContent from "./ActivityContent"

export default function ActivityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityContent />
    </Suspense>
  )
}

