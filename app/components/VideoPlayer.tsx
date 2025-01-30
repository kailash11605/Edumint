import type React from "react"
import { useEffect, useRef, useState } from "react"
import YouTube from "react-youtube"

interface VideoPlayerProps {
  videoId: string
  onProgress: (progress: number) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onProgress }) => {
  const [player, setPlayer] = useState<any>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  const onReady = (event: { target: any }) => {
    setPlayer(event.target)
  }

  const startTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    progressInterval.current = setInterval(() => {
      if (player && typeof player.getCurrentTime === "function") {
        const currentTime = player.getCurrentTime()
        const duration = player.getDuration()
        const progress = (currentTime / duration) * 100
        onProgress(progress)
      }
    }, 1000) // Update progress every second
  }

  const stopTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const onStateChange = (event: { data: number }) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      startTracking()
    } else {
      stopTracking()
    }
  }

  return (
    <YouTube
      videoId={videoId}
      opts={{
        height: "390",
        width: "640",
        playerVars: {
          autoplay: 0,
        },
      }}
      onReady={onReady}
      onStateChange={onStateChange}
    />
  )
}

export default VideoPlayer

