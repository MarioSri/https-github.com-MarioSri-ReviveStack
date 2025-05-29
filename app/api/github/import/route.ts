import type { NextRequest } from "next/server"
import { GitHubImporter } from "@/lib/github-importer"

export async function POST(request: NextRequest) {
  try {
    const { github_url } = await request.json()

    if (!github_url) {
      return Response.json({ error: "GitHub URL is required" }, { status: 400 })
    }

    const githubImporter = new GitHubImporter()
    const repoData = await githubImporter.importRepository(github_url)

    return Response.json(repoData)
  } catch (error) {
    console.error("Error importing GitHub repository:", error)
    return Response.json({ error: "Failed to import GitHub repository" }, { status: 500 })
  }
}
