import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { projectId, buyerId, offerAmount, buyerEmail } = await request.json()

    if (!projectId || !buyerId || !offerAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Calculate platform fee (10%)
    const platformFee = Math.round(offerAmount * 0.1)
    const sellerAmount = offerAmount - platformFee

    // Create Stripe checkout session for the offer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Offer for ${project.title}`,
              description: `Your offer of $${offerAmount.toLocaleString()} for ${project.title}`,
            },
            unit_amount: offerAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "offer",
        projectId: project.id,
        buyerId: buyerId,
        offerAmount: offerAmount.toString(),
        platformFee: platformFee.toString(),
        sellerAmount: sellerAmount.toString(),
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/buyer?offer_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/project/${projectId}`,
      payment_intent_data: {
        capture_method: "manual", // Hold funds in escrow
        metadata: {
          type: "offer_escrow",
          projectId: project.id,
          buyerId: buyerId,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Offer creation error:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
