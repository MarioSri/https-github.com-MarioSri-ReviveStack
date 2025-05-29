import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("id")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const projectId = session.metadata?.projectId

    if (!projectId) {
      return NextResponse.json({ error: "Project ID not found in session" }, { status: 404 })
    }

    // Get project details from Supabase
    const { data: project, error } = await supabase.from("projects").select("title").eq("id", projectId).single()

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ projectTitle: project.title })
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json({ error: "Error retrieving session" }, { status: 500 })
  }
}
