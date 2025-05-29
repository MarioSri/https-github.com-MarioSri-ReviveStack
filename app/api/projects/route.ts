import type { NextRequest } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { GitHubImporter } from "@/lib/github-importer"
import { AIValuationService } from "@/lib/ai-valuation"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const projects = await prisma.project.findMany({
      where: { status: "active" },
      include: {
        seller: {
          select: { username: true, image: true, reputation_score: true },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    })

    const total = await prisma.project.count({
      where: { status: "active" },
    })

    return Response.json({
      projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { github_url, title, description, price, tech_stack, demo_url } = body

    // Validate required fields
    if (!github_url || !title || !description || !price) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Import GitHub data
    const githubImporter = new GitHubImporter()
    let repoData
    try {
      repoData = await githubImporter.importRepository(github_url)
    } catch (error) {
      console.error("Error importing GitHub repository:", error)
      return Response.json({ error: "Failed to import GitHub repository" }, { status: 400 })
    }

    // Get AI valuation
    const aiService = new AIValuationService()
    let aiValuation
    try {
      aiValuation = await aiService.analyzeProject({
        description,
        techStack: tech_stack || [],
        stars: repoData.stars,
        forks: repoData.forks,
        lastCommit: new Date(repoData.last_commit_date),
      })
    } catch (error) {
      console.error("Error getting AI valuation:", error)
      // Continue without AI valuation
      aiValuation = null
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        seller_id: session.user.id,
        title,
        description,
        github_url,
        demo_url,
        price: Number.parseFloat(price),
        tech_stack: tech_stack || [],
        stars: repoData.stars,
        forks: repoData.forks,
        last_commit_date: new Date(repoData.last_commit_date),
        health_score: repoData.health_score,
        ai_valuation: aiValuation,
      },
      include: {
        seller: {
          select: { username: true, image: true, reputation_score: true },
        },
      },
    })

    return Response.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return Response.json({ error: "Failed to create project" }, { status: 500 })
  }
}
