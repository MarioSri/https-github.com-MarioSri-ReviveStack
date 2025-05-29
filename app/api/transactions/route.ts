import type { NextRequest } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { createEscrowPayment } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { project_id } = await request.json()

    if (!project_id) {
      return Response.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: project_id },
      include: { seller: true },
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.status !== "active") {
      return Response.json({ error: "Project is not available for purchase" }, { status: 400 })
    }

    if (project.seller_id === session.user.id) {
      return Response.json({ error: "Cannot purchase your own project" }, { status: 400 })
    }

    // Calculate commission (10%)
    const commission = project.price * 0.1

    // Create Stripe payment intent
    let paymentIntent
    try {
      paymentIntent = await createEscrowPayment(project.price, project.seller.stripe_account_id || "", {
        project_id: project.id,
        buyer_id: session.user.id,
        seller_id: project.seller_id,
      })
    } catch (error) {
      console.error("Error creating Stripe payment:", error)
      return Response.json({ error: "Failed to create payment" }, { status: 500 })
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        project_id: project.id,
        buyer_id: session.user.id,
        seller_id: project.seller_id,
        amount: project.price,
        commission,
        stripe_payment_intent_id: paymentIntent.id,
        escrow_release_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })

    return Response.json({
      transaction,
      client_secret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return Response.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
