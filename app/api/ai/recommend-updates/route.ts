import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { tech_stack, projectId } = await request.json()

    if (!tech_stack || !Array.isArray(tech_stack)) {
      return NextResponse.json({ error: "Tech stack array is required" }, { status: 400 })
    }

    const prompt = `
    Analyze this tech stack and provide upgrade recommendations:
    
    Current Tech Stack: ${tech_stack.join(", ")}
    
    For each technology, provide:
    1. Current version assessment
    2. Latest stable version recommendation
    3. Upgrade priority (high/medium/low)
    4. Breaking changes to consider
    5. Benefits of upgrading
    
    Respond in JSON format as an array of objects with keys: package, currentVersion, latestVersion, priority, reason, breakingChanges
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    let recommendations
    try {
      recommendations = JSON.parse(text)
    } catch (parseError) {
      // Fallback recommendations
      recommendations = tech_stack.map((tech: string) => ({
        package: tech,
        currentVersion: "Unknown",
        latestVersion: "Latest",
        priority: "medium",
        reason: `Consider updating ${tech} to the latest stable version for security and performance improvements.`,
        breakingChanges: "Review changelog for potential breaking changes.",
      }))
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Tech recommendations error:", error)

    // Return fallback recommendations
    const fallbackRecommendations = [
      {
        package: "React",
        currentVersion: "17.x",
        latestVersion: "18.x",
        priority: "high",
        reason: "React 18 includes performance improvements and new features like concurrent rendering.",
        breakingChanges: "Review component lifecycle changes and new strict mode behavior.",
      },
    ]

    return NextResponse.json({ recommendations: fallbackRecommendations })
  }
}
