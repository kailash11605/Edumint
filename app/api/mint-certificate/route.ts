import { NextResponse } from "next/server"
import { aptosMinter } from "../../lib/aptosMinter"

const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY!

export async function POST(request: Request) {
  try {
    const { course, walletAddress, score, videoProgress } = await request.json()

    // Validate input
    if (!course || typeof course !== "string") {
      return NextResponse.json({ success: false, message: "Invalid course" }, { status: 400 })
    }
    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ success: false, message: "Invalid wallet address" }, { status: 400 })
    }
    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json({ success: false, message: "Invalid score" }, { status: 400 })
    }
    if (typeof videoProgress !== "number" || videoProgress < 0 || videoProgress > 100) {
      return NextResponse.json({ success: false, message: "Invalid video progress" }, { status: 400 })
    }

    // Check if video progress is at least 75%
    if (videoProgress < 75) {
      return NextResponse.json(
        { success: false, message: "You must watch at least 75% of the video to mint a certificate" },
        { status: 400 },
      )
    }

    const transactionHash = await aptosMinter.mintCertificate(
      MINTER_PRIVATE_KEY,
      walletAddress,
      course,
      score,
      videoProgress,
    )

    return NextResponse.json({
      success: true,
      message: "Certificate minted successfully!",
      transactionHash,
    })
  } catch (error) {
    console.error("Error minting certificate:", error)
    return NextResponse.json({ success: false, message: "Failed to mint certificate" }, { status: 500 })
  }
}

