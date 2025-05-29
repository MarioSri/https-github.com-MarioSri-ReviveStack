"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  price: number
  stars: number
  status: string
  tech_stack: string[]
  created_at: string
}

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // In a real app, this would fetch from the API
    setProjects([
      {
        id: "1",
        title: "TaskFlow Pro",
        description:
          "Advanced project management tool with AI-powered insights. Built with React and Node.js. Includes user authentication, real-time collaboration, and analytics dashboard.",
        price: 15000,
        stars: 1247,
        status: "available",
        tech_stack: ["React", "Node.js", "MongoDB"],
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "EcoTracker",
        description:
          "Carbon footprint tracking app for individuals and businesses. Features include expense tracking, sustainability reports, and goal setting.",
        price: 8500,
        stars: 892,
        status: "available",
        tech_stack: ["Vue.js", "Express", "PostgreSQL"],
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "CodeReview Bot",
        description:
          "Automated code review tool that integrates with GitHub. Uses machine learning to detect code smells and suggest improvements.",
        price: 25000,
        stars: 2156,
        status: "available",
        tech_stack: ["Python", "TensorFlow", "GitHub API"],
        created_at: new Date().toISOString(),
      },
      {
        id: "4",
        title: "FitnessPal Clone",
        description:
          "Comprehensive fitness tracking application with meal planning, workout routines, and progress analytics.",
        price: 12000,
        stars: 634,
        status: "available",
        tech_stack: ["React Native", "Firebase", "GraphQL"],
        created_at: new Date().toISOString(),
      },
    ])
    setLoading(false)
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Projects</h1>
          <p className="text-gray-600">Discover abandoned SaaS projects with potential for revival</p>
        </div>
        <Link href="/" className="flex items-center">
          <img src="/images/revivestack-icon.png" alt="ReviveStack" className="w-10 h-10" />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-0 top-0 bg-black text-white px-4 py-2 rounded-r-lg">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center text-gray-500">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                  <span className="text-sm">{project.stars}</span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">SaaS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">${project.price.toLocaleString()}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                  Contact
                </button>
                <button className="py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Buy Now
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-right">Added about 18 hours ago</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
