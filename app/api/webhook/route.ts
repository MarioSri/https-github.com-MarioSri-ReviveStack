import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const sig = headers().get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!)
  } catch (err) {
    const error = err as Error
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any

      // Check if payment was successful
      if (session.payment_status === "paid") {
        const projectId = session.metadata.projectId
        const buyerEmail = session.metadata.buyerEmail || session.customer_email

        // Find buyer by email if available
        let buyerId = null
        if (buyerEmail) {
          const { data: profiles } = await supabase.from("profiles").select("id").eq("email", buyerEmail).limit(1)
          if (profiles && profiles.length > 0) {
            buyerId = profiles[0].id
          }
        }

        // Update project status in database
        const updateData: any = { status: "sold" }
        if (buyerId) {
          updateData.buyer_id = buyerId
        }

        const { error } = await supabase.from("projects").update(updateData).eq("id", projectId)

        if (error) {
          console.error("Error updating project status:", error)
          return NextResponse.json({ error: "Error updating project status" }, { status: 500 })
        }

        console.log(`🎉 Project ${projectId} marked as sold!`)
      }
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Need to disable body parsing to get the raw body for Stripe webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}
