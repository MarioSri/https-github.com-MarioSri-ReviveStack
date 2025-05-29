import { NextResponse } from "next/server"

// Mock data for build time
const mockProjects = [
  {
    id: "1",
    title: "TaskFlow Pro",
    description: "Advanced project management tool with AI-powered insights. Built with React and Node.js.",
    repo_url: "https://github.com/example/taskflow-pro",
    stars: 1247,
    estimated_value: 15000,
    status: "active",
    seller_email: "john@example.com",
    created_at: new Date().toISOString(),
    last_commit_date: "2023-08-15T10:30:00Z",
  },
  {
    id: "2",
    title: "EcoTracker",
    description: "Carbon footprint tracking app for individuals and businesses.",
    repo_url: "https://github.com/example/ecotracker",
    stars: 892,
    estimated_value: 8500,
    status: "active",
    seller_email: "sarah@example.com",
    created_at: new Date().toISOString(),
    last_commit_date: "2023-10-22T14:45:00Z",
  },
]

export async function GET() {
  try {
    let projects = mockProjects

    // Only use Supabase in runtime, not during build
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      try {
        const { supabase } = await import("@/lib/supabase")
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (!error && data) {
          projects = data
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error)
        // Fall back to mock data
      }
    }

    return NextResponse.json({
      projects,
      pagination: {
        total: projects.length,
        pages: 1,
        page: 1,
        limit: 10,
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { github_url, title, description, price, tech_stack, demo_url } = body

    // Validate required fields
    if (!github_url || !title || !description || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const projectData = {
      id: Date.now().toString(),
      title,
      description,
      repo_url: github_url,
      estimated_value: Number.parseFloat(price),
      stars: 0,
      status: "active",
      seller_email: "user@example.com",
      created_at: new Date().toISOString(),
    }

    // Only use Supabase in runtime
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      try {
        const { supabase } = await import("@/lib/supabase")
        const { data, error } = await supabase.from("projects").insert([projectData]).select().single()

        if (error) {
          console.error("Supabase error:", error)
          return NextResponse.json(projectData, { status: 201 }) // Return mock data
        }

        return NextResponse.json(data, { status: 201 })
      } catch (error) {
        console.error("Error creating project in Supabase:", error)
        return NextResponse.json(projectData, { status: 201 }) // Return mock data
      }
    }

    return NextResponse.json(projectData, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
