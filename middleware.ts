import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const limit = 100 // requests per window
  const windowMs = 15 * 60 * 1000 // 15 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    })
  }

  const ipData = rateLimitMap.get(ip)

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0
    ipData.lastReset = Date.now()
  }

  if (ipData.count >= limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  ipData.count += 1

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
