import { Octokit } from "@octokit/rest"
import { calculateEstimatedValue } from "./ai-valuation"

export class GitHubImporter {
  private octokit: Octokit

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })
  }

  async importRepository(url: string) {
    try {
      // Parse GitHub URL to extract owner and repo
      const urlParts = url.replace("https://github.com/", "").split("/")
      const owner = urlParts[0]
      const repo = urlParts[1]

      // Fetch repository data
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      })

      // Fetch languages
      const { data: languages } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      })

      // Calculate days since last commit
      const lastCommitDate = new Date(repoData.pushed_at)
      const daysSinceLastCommit = Math.floor((Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24))

      // Calculate estimated value
      const estimatedValue = calculateEstimatedValue(repoData.stargazers_count, daysSinceLastCommit)

      // Calculate health score
      const healthScore = this.calculateHealthScore({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        lastCommit: lastCommitDate,
        hasReadme: repoData.has_issues,
        hasTests: false, // Would need to check repo contents
        dependencyCount: 0, // Would need to parse package.json
        vulnerabilityCount: 0, // Would need security scanning
        documentationScore: repoData.has_wiki ? 70 : 30,
      })

      return {
        title: repoData.name,
        description: repoData.description || "",
        github_url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        tech_stack: Object.keys(languages),
        last_commit_date: lastCommitDate.toISOString(),
        estimated_value: estimatedValue,
        health_score: healthScore,
        ai_valuation: {
          revivalDifficulty: daysSinceLastCommit > 365 ? 4 : 2,
          marketDemand: repoData.stargazers_count > 100 ? 4 : 3,
          technicalDebt: daysSinceLastCommit > 365 ? 4 : 2,
        },
      }
    } catch (error) {
      console.error("Error importing GitHub repository:", error)
      throw new Error("Failed to import GitHub repository")
    }
  }

  async importAbandonedProjects() {
    try {
      const query = `
        is:public archived:false pushed:<2023-01-01 stars:>10 language:JavaScript OR language:TypeScript
      `

      const { data } = await this.octokit.search.repos({
        q: query,
        sort: "stars",
        order: "desc",
        per_page: 10,
      })

      return data.items.map((repo) => ({
        title: repo.name,
        description: repo.description || "",
        github_url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        tech_stack: ["JavaScript", "TypeScript"], // Simplified
        last_commit_date: repo.pushed_at,
        estimated_value: calculateEstimatedValue(
          repo.stargazers_count,
          Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)),
        ),
      }))
    } catch (error) {
      console.error("Error importing abandoned projects:", error)
      throw new Error("Failed to import abandoned projects")
    }
  }

  private calculateHealthScore(project: {
    stars: number
    forks: number
    lastCommit: Date
    hasReadme: boolean
    hasTests: boolean
    dependencyCount: number
    vulnerabilityCount: number
    documentationScore: number
  }): number {
    let score = 0

    // Popularity (30%)
    score += Math.min((project.stars / 100) * 30, 30)

    // Recency (25%)
    const monthsSinceLastCommit = (Date.now() - project.lastCommit.getTime()) / (1000 * 60 * 60 * 24 * 30)
    score += Math.max(25 - monthsSinceLastCommit, 0)

    // Code Quality (25%)
    if (project.hasReadme) score += 5
    if (project.hasTests) score += 10
    score += Math.max(10 - project.vulnerabilityCount * 2, 0)

    // Documentation (20%)
    score += (project.documentationScore / 100) * 20

    return Math.round(Math.max(Math.min(score, 100), 0))
  }
}
