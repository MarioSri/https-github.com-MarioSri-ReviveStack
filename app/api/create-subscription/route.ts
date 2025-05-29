import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { priceId, userId, email } = await request.json()

    if (!priceId || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create or retrieve customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      })
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/buyer?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
        trial_period_days: 14, // 14-day free trial
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
