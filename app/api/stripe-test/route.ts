import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    // Simple test to verify Stripe connection
    await stripe.products.list({ limit: 1 })
    return NextResponse.json({ status: "connected" })
  } catch (error) {
    console.error("Stripe test error:", error)
    return NextResponse.json({ error: "Stripe connection failed" }, { status: 500 })
  }
}
