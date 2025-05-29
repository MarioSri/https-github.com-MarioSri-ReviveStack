"use client"

import { useState, useEffect } from "react"
import { Star, GitBranch, Clock, Check, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ProjectDetails {
  id: string
  title: string
  description: string
  github_url: string
  demo_url?: string
  price: number
  stars: number
  forks: number
  tech_stack: string[]
  last_commit_date: string
  health_score: number
  ai_valuation: {
    revivalDifficulty: number
    marketDemand: number
    technicalDebt: number
    recommendations: string[]
  }
  seller: {
    username: string
    avatar_url: string
    reputation_score: number
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from the API
    setTimeout(() => {
      setProject({
        id: params.id,
        title: "TaskFlow Pro",
        description:
          "Advanced project management tool with AI-powered insights. Built with React and Node.js. Includes user authentication, real-time collaboration, and analytics dashboard. The project was developed over 8 months but was abandoned due to shifting priorities. All code is well-documented with comprehensive test coverage.",
        github_url: "https://github.com/example/taskflow-pro",
        demo_url: "https://demo.taskflowpro.example",
        price: 15000,
        stars: 1247,
        forks: 89,
        tech_stack: ["React", "Node.js", "MongoDB", "Socket.io", "Chart.js", "TensorFlow.js"],
        last_commit_date: "2023-01-15T00:00:00Z",
        health_score: 85,
        ai_valuation: {
          revivalDifficulty: 2,
          marketDemand: 4,
          technicalDebt: 2,
          recommendations: [
            "Update dependencies to latest versions",
            "Implement mobile responsive design",
            "Add more AI-powered features to differentiate from competitors",
          ],
        },
        seller: {
          username: "techfounder",
          avatar_url: "/placeholder.svg?height=40&width=40",
          reputation_score: 4.8,
        },
      })
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
            </div>
            <div>
              <div className="h-60 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/browse" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
            Browse Projects
          </Link>
        </div>
      </div>
    )
  }

  const daysSinceLastCommit = Math.floor(
    (new Date().getTime() - new Date(project.last_commit_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600">Advanced project management tool with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Project Overview</h2>
            <p className="text-gray-700 mb-6">{project.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Stars</div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-bold">{project.stars}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Forks</div>
                <div className="flex items-center">
                  <GitBranch className="w-4 h-4 text-gray-600 mr-1" />
                  <span className="font-bold">{project.forks}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Last Commit</div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-600 mr-1" />
                  <span className="font-bold">{daysSinceLastCommit} days ago</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Health Score</div>
                <div className="flex items-center">
                  {project.health_score > 70 ? (
                    <Check className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                  )}
                  <span className="font-bold">{project.health_score}/100</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack.map((tech) => (
                <span key={tech} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">AI Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revival Difficulty</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full mx-0.5 ${
                            i < project.ai_valuation.revivalDifficulty ? "bg-blue-500" : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Demand</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full mx-0.5 ${
                            i < project.ai_valuation.marketDemand ? "bg-green-500" : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Technical Debt</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-full mx-0.5 ${
                            i < project.ai_valuation.technicalDebt ? "bg-red-500" : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Recommendations</h3>
                <ul className="space-y-2">
                  {project.ai_valuation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Repository Preview</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-mono text-sm">{project.github_url.split("/").slice(-2).join("/")}</span>
                </div>
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View on GitHub
                </a>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-1">${project.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">One-time purchase</div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg mb-4 hover:bg-gray-800">Buy Now</button>
            <button className="w-full bg-white text-black py-3 rounded-lg border border-gray-300 mb-6 hover:bg-gray-50">
              Contact Seller
            </button>

            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <img
                  src={project.seller.avatar_url || "/placeholder.svg"}
                  alt={project.seller.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="font-medium">{project.seller.username}</div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{project.seller.reputation_score}/5</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Seller since Jan 2023</p>
                <p>5 successful sales</p>
              </div>
            </div>

            <div className="border-t border-b py-4 my-4">
              <h3 className="font-bold mb-2">What's included</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Full source code</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Documentation</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">GitHub repository transfer</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">2 weeks of support</span>
                </li>
              </ul>
            </div>

            <div className="text-xs text-gray-500 text-center">Protected by ReviveStack Escrow Service</div>
          </div>
        </div>
      </div>
    </div>
  )
}
