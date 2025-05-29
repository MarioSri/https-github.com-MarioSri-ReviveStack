import OpenAI from "openai"

export function calculateEstimatedValue(stars: number, daysSinceLastCommit: number): number {
  // Base value from stars
  const value = stars * 50

  // Bonus for abandoned projects (inactive for more than 90 days)
  const inactiveBonus = daysSinceLastCommit > 90 ? 2000 : 0

  // Minimum value
  const minValue = 500

  return Math.max(value + inactiveBonus, minValue)
}

export class AIValuationService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async analyzeProject(projectData: {
    description: string
    techStack: string[]
    stars: number
    forks: number
    lastCommit: Date
    readmeContent?: string
  }) {
    const prompt = `
    Analyze this abandoned project and provide valuation insights:
    
    Description: ${projectData.description}
    Tech Stack: ${projectData.techStack.join(", ")}
    GitHub Stars: ${projectData.stars}
    Forks: ${projectData.forks}
    Last Commit: ${projectData.lastCommit}
    
    Provide a JSON response with:
    - estimatedValue (USD range)
    - healthScore (0-100)
    - revivalDifficulty (1-5)
    - marketDemand (1-5)
    - technicalDebt (1-5)
    - recommendations (array of strings)
    `

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      })

      return JSON.parse(response.choices[0].message.content!)
    } catch (error) {
      console.error("Error analyzing project with AI:", error)

      // Fallback to basic calculation
      return {
        estimatedValue: `$${calculateEstimatedValue(
          projectData.stars,
          Math.floor((Date.now() - projectData.lastCommit.getTime()) / (1000 * 60 * 60 * 24)),
        )} - $${
          calculateEstimatedValue(
            projectData.stars,
            Math.floor((Date.now() - projectData.lastCommit.getTime()) / (1000 * 60 * 60 * 24)),
          ) * 1.5
        }`,
        healthScore: 65,
        revivalDifficulty: 3,
        marketDemand: 3,
        technicalDebt: 3,
        recommendations: [
          "Update dependencies to latest versions",
          "Add comprehensive documentation",
          "Implement automated testing",
        ],
      }
    }
  }
}
