"use client"

import { useState, useEffect } from "react"
import { Star, GitBranch, Clock, Check, AlertTriangle, ArrowRight, Heart, DollarSign } from "lucide-react"
import Link from "next/link"
import Layout from "@/components/Layout"
import RevivalToolkit from "@/components/RevivalToolkit"
import { getCurrentUser } from "@/lib/auth"

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
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [offerLoading, setOfferLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // Fetch project details
        const response = await fetch(`/api/projects/${params.id}`)
        if (response.ok) {
          const projectData = await response.json()
          setProject(projectData)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleMakeOffer = async () => {
    if (!user) {
      // Redirect to auth
      window.location.href = "/auth"
      return
    }

    setOfferLoading(true)
    try {
      const response = await fetch("/api/create-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: params.id,
          buyerId: user.id,
          offerAmount: project?.price || 10000,
          buyerEmail: user.email,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Error making offer:", error)
    } finally {
      setOfferLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Browse Projects
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const daysSinceLastCommit = Math.floor(
    (new Date().getTime() - new Date(project.last_commit_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600">Advanced project management tool with AI-powered insights</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "revival", name: "Revival Toolkit" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activeTab === "overview" && (
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
            )}

            {activeTab === "revival" && (
              <RevivalToolkit
                projectId={params.id}
                projectData={{
                  title: project.title,
                  repo_url: project.github_url,
                  tech_stack: project.tech_stack,
                }}
              />
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">${project.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">One-time purchase</div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleMakeOffer}
                  disabled={offerLoading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
                >
                  {offerLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <DollarSign className="w-4 h-4 mr-2" />
                  )}
                  Make Offer
                </button>
                <button className="w-full bg-white text-black py-3 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Project
                </button>
              </div>

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
    </Layout>
  )
}
