import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            username: true,
            image: true,
            reputation_score: true,
            created_at: true,
          },
        },
      },
    })

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 })
    }

    return Response.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return Response.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
