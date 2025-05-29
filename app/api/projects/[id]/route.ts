import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const mockProject = {
  id: "1",
  title: "TaskFlow Pro",
  description: "Advanced project management tool with AI-powered insights. Built with React and Node.js.",
  github_url: "https://github.com/example/taskflow-pro",
  demo_url: "https://demo.taskflowpro.com",
  price: 15000,
  stars: 1247,
  forks: 89,
  tech_stack: ["React", "Node.js", "MongoDB", "Socket.io"],
  last_commit_date: "2023-08-15T00:00:00Z",
  health_score: 85,
  status: "active",
  created_at: new Date().toISOString(),
  ai_valuation: {
    revivalDifficulty: 2,
    marketDemand: 4,
    technicalDebt: 2,
    recommendations: [
      "Update dependencies to latest versions",
      "Implement mobile responsive design",
      "Add more AI-powered features to differentiate from competitors",
    ],
  },
  seller: {
    username: "techfounder",
    avatar_url: "/placeholder.svg?height=40&width=40",
    reputation_score: 4.8,
    created_at: new Date().toISOString(),
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let project = null

    // Only use Supabase in runtime, not during build
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      try {
        const { data, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

        if (!error && data) {
          project = data
        }
      } catch (error) {
        console.error("Error fetching from Supabase:", error)
      }
    }

    // Fall back to mock data if no project found or in development
    if (!project) {
      if (params.id === "1" || params.id === mockProject.id) {
        project = mockProject
      } else {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
    }

    // Add additional mock data for the detailed view if needed
    const detailedProject = {
      ...project,
      demo_url: project.demo_url || "https://demo.example.com",
      forks: project.forks || 89,
      tech_stack: project.tech_stack || ["React", "Node.js", "MongoDB", "Socket.io"],
      health_score: project.health_score || 85,
      ai_valuation: project.ai_valuation || mockProject.ai_valuation,
      seller: project.seller || mockProject.seller,
    }

    return NextResponse.json(detailedProject)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
