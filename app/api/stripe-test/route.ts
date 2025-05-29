import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple test without importing stripe during build
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY

    if (!hasStripeKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    // Only test Stripe connection in runtime, not during build
    if (process.env.NODE_ENV === "production") {
      try {
        const { stripe } = await import("@/lib/stripe")
        await stripe.products.list({ limit: 1 })
        return NextResponse.json({ status: "connected" })
      } catch (error) {
        console.error("Stripe test error:", error)
        return NextResponse.json({ error: "Stripe connection failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ status: "configured" })
  } catch (error) {
    console.error("Stripe test error:", error)
    return NextResponse.json({ error: "Stripe test failed" }, { status: 500 })
  }
}
