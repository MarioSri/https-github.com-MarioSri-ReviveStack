import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const techStack = searchParams.getAll("tech")
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "999999")
    const minStars = Number.parseInt(searchParams.get("minStars") || "0")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const projects = await prisma.project.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          { price: { gte: minPrice, lte: maxPrice } },
          { stars: { gte: minStars } },
          techStack.length > 0
            ? {
                tech_stack: { hasAny: techStack },
              }
            : {},
          { status: "active" },
        ],
      },
      include: {
        seller: {
          select: { username: true, avatar_url: true, reputation_score: true },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    })

    const total = await prisma.project.count({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          { price: { gte: minPrice, lte: maxPrice } },
          { stars: { gte: minStars } },
          techStack.length > 0
            ? {
                tech_stack: { hasAny: techStack },
              }
            : {},
          { status: "active" },
        ],
      },
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
    console.error("Error searching projects:", error)
    return Response.json({ error: "Failed to search projects" }, { status: 500 })
  }
}
