import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { projectData } = await request.json()

    if (!projectData) {
      return NextResponse.json({ error: "Project data is required" }, { status: 400 })
    }

    const prompt = `
    Generate comprehensive documentation for this SaaS project:
    
    Project: ${projectData.title}
    Description: ${projectData.description}
    Tech Stack: ${projectData.tech_stack?.join(", ") || "Unknown"}
    Repository: ${projectData.repo_url || "Unknown"}
    
    Please create a detailed README.md that includes:
    1. Project overview and features
    2. Installation instructions
    3. Configuration setup
    4. Usage examples
    5. API documentation (if applicable)
    6. Contributing guidelines
    7. License information
    
    Format as markdown.
    `

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
    })

    return NextResponse.json({ documentation: text })
  } catch (error) {
    console.error("Documentation generation error:", error)

    // Return fallback documentation
    const fallbackDocs = `
# Project

## Overview
A SaaS project ready for revival.

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Configuration
1. Copy \`.env.example\` to \`.env.local\`
2. Fill in your environment variables
3. Run the development server

## Usage
Visit \`http://localhost:3000\` to access the application.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License
    `

    return NextResponse.json({ documentation: fallbackDocs })
  }
}
