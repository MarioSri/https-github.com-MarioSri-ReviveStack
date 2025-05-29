import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

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

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any

      if (session.metadata?.type === "offer") {
        // Handle offer payment
        await handleOfferPayment(session)
      } else {
        // Handle regular project purchase
        await handleProjectPurchase(session)
      }
      break

    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionChange(event.data.object as any)
      break

    case "customer.subscription.deleted":
      await handleSubscriptionCancellation(event.data.object as any)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleOfferPayment(session: any) {
  try {
    const { projectId, buyerId, offerAmount } = session.metadata

    // Create offer record in database
    const { error } = await supabase.from("offers").insert([
      {
        project_id: projectId,
        buyer_id: buyerId,
        amount: Number.parseInt(offerAmount),
        status: "pending",
        stripe_payment_intent: session.payment_intent,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error creating offer record:", error)
    }

    console.log(`💰 Offer created for project ${projectId}: $${offerAmount}`)
  } catch (error) {
    console.error("Error handling offer payment:", error)
  }
}

async function handleProjectPurchase(session: any) {
  try {
    if (session.payment_status === "paid") {
      const projectId = session.metadata.projectId
      const buyerEmail = session.metadata.buyerEmail || session.customer_email

      let buyerId = null
      if (buyerEmail) {
        const { data: profiles } = await supabase.from("profiles").select("id").eq("email", buyerEmail).limit(1)
        if (profiles && profiles.length > 0) {
          buyerId = profiles[0].id
        }
      }

      const updateData: any = { status: "sold" }
      if (buyerId) {
        updateData.buyer_id = buyerId
      }

      const { error } = await supabase.from("projects").update(updateData).eq("id", projectId)

      if (error) {
        console.error("Error updating project status:", error)
      } else {
        console.log(`🎉 Project ${projectId} marked as sold!`)
      }
    }
  } catch (error) {
    console.error("Error handling project purchase:", error)
  }
}

async function handleSubscriptionChange(subscription: any) {
  try {
    const customerId = subscription.customer
    const status = subscription.status

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as any).metadata?.userId

    if (userId) {
      // Update user subscription status in database
      const { error } = await supabase.from("user_subscriptions").upsert([
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          status: status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error updating subscription:", error)
      } else {
        console.log(`📋 Subscription ${status} for user ${userId}`)
      }
    }
  } catch (error) {
    console.error("Error handling subscription change:", error)
  }
}

async function handleSubscriptionCancellation(subscription: any) {
  try {
    const customerId = subscription.customer
    const customer = await stripe.customers.retrieve(customerId)
    const userId = (customer as any).metadata?.userId

    if (userId) {
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id)

      if (error) {
        console.error("Error canceling subscription:", error)
      } else {
        console.log(`❌ Subscription canceled for user ${userId}`)
      }
    }
  } catch (error) {
    console.error("Error handling subscription cancellation:", error)
  }
}
