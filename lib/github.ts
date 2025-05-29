// GitHub API utility functions

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  pushed_at: string
  owner: {
    login: string
  }
}

/**
 * Parse a GitHub repository URL to extract owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.hostname.includes("github.com")) {
      return null
    }

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean)
    if (pathParts.length < 2) {
      return null
    }

    return {
      owner: pathParts[0],
      repo: pathParts[1],
    }
  } catch (error) {
    return null
  }
}

/**
 * Calculate days since last commit
 */
export function daysSinceLastCommit(pushedAt: string): number {
  const lastCommitDate = new Date(pushedAt)
  const currentDate = new Date()
  const diffTime = currentDate.getTime() - lastCommitDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Calculate estimated value based on stars and inactivity
 */
export function calculateEstimatedValue(stars: number, daysSinceLastCommit: number): number {
  // Base value from stars
  const value = stars * 50

  // Bonus for abandoned projects (inactive for more than 90 days)
  const inactiveBonus = daysSinceLastCommit > 90 ? 2000 : 0

  // Minimum value
  const minValue = 500

  return Math.max(value + inactiveBonus, minValue)
}
