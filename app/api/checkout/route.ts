import { NextResponse } from "next/server"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { projectId, buyerEmail } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get project details from Supabase
    const { data: project, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if project is already sold
    if (project.status !== "active") {
      return NextResponse.json({ error: "Project is not available for purchase" }, { status: 400 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: project.title,
              description: project.description || "SaaS Project",
              images: [`https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(project.title)}`],
            },
            unit_amount: formatAmountForStripe(project.estimated_value),
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: project.id,
        buyerEmail: buyerEmail || "",
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("origin")}`}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || `${request.headers.get("origin")}`}/`,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "An error occurred while creating the checkout session" }, { status: 500 })
  }
}
