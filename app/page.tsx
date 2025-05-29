"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import ProjectCard from "@/components/ProjectCard"
import { supabase, type Project } from "@/lib/supabase"
import { Search, Filter, AlertCircle, Database } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) {
        // Check if it's a table not found error
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          setError("database_not_setup")
        } else {
          throw error
        }
      } else {
        setProjects(data || [])
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error)
      setError(error.message || "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Database setup error state
  if (error === "database_not_setup") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
            <Database className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Database Setup Required</h2>
            <p className="text-amber-800 mb-6">
              The database tables haven't been created yet. Please run the setup script in your Supabase dashboard.
            </p>
            <div className="bg-white border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">Setup Instructions:</h3>
              <ol className="text-left text-amber-800 space-y-2">
                <li>1. Go to your Supabase dashboard</li>
                <li>2. Navigate to the SQL Editor</li>
                <li>3. Copy and run the database setup script</li>
                <li>4. Refresh this page</li>
              </ol>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                href="/setup"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                View Setup Instructions
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // General error state
  if (error && error !== "database_not_setup") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-900 mb-4">Error Loading Projects</h2>
            <p className="text-red-800 mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Abandoned SaaS Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and acquire promising SaaS projects that need new owners. Give abandoned code a second chance at
            success.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Web Apps</option>
                <option>Mobile Apps</option>
                <option>APIs</option>
                <option>Tools</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
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
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "Be the first to list a project!"}
            </p>
          </div>
        )}

        {/* Stats Section */}
        {!loading && projects.length > 0 && (
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{projects.length}</div>
                <div className="text-gray-600">Projects Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${projects.reduce((sum, p) => sum + p.estimated_value, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">Total Value</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {projects.reduce((sum, p) => sum + p.stars, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">GitHub Stars</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
