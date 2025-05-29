import { NextResponse } from "next/server"
import { parseGitHubUrl, daysSinceLastCommit, calculateEstimatedValue } from "@/lib/github"

export async function GET(request: Request, { params }: { params: { repo: string } }) {
  try {
    // Get the encoded repo URL from the path parameter and decode it
    const repoUrl = decodeURIComponent(params.repo)

    // Parse the GitHub URL
    const parsedRepo = parseGitHubUrl(repoUrl)
    if (!parsedRepo) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    // Fetch repository data from GitHub API
    const response = await fetch(`https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add GitHub token if available to increase rate limit
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: "Failed to fetch repository data",
          details: errorData,
        },
        { status: response.status },
      )
    }

    const repoData = await response.json()

    // Calculate days since last commit and estimated value
    const daysSinceCommit = daysSinceLastCommit(repoData.pushed_at)
    const estimatedValue = calculateEstimatedValue(repoData.stargazers_count, daysSinceCommit)

    return NextResponse.json({
      title: repoData.name,
      description: repoData.description,
      repo_url: repoData.html_url,
      stars: repoData.stargazers_count,
      last_commit_date: repoData.pushed_at,
      days_since_commit: daysSinceCommit,
      estimated_value: estimatedValue,
    })
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
