"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { Upload, DollarSign, Github, Mail, Loader2 } from "lucide-react"

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingRepo, setFetchingRepo] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repo_url: "",
    stars: 0,
    estimated_value: 0,
    seller_email: "",
    last_commit_date: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth")
        return
      }
      setUser(currentUser)
      setFormData((prev) => ({
        ...prev,
        seller_email: currentUser.email || "",
      }))
      setAuthLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const { error } = await supabase.from("projects").insert([
        {
          ...formData,
          user_id: user.id,
          status: "active",
        },
      ])

      if (error) throw error

      alert("Project listed successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Error listing project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const fetchGitHubData = async () => {
    if (!formData.repo_url) {
      alert("Please enter a GitHub repository URL")
      return
    }

    setFetchingRepo(true)

    try {
      const encodedUrl = encodeURIComponent(formData.repo_url)
      const response = await fetch(`/api/github/${encodedUrl}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch repository data")
      }

      const repoData = await response.json()

      setFormData((prev) => ({
        ...prev,
        title: repoData.title || prev.title,
        description: repoData.description || prev.description,
        stars: repoData.stars || prev.stars,
        estimated_value: repoData.estimated_value || prev.estimated_value,
        last_commit_date: repoData.last_commit_date || prev.last_commit_date,
      }))
    } catch (error) {
      console.error("Error fetching GitHub data:", error)
      alert(`Error fetching repository data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setFetchingRepo(false)
    }
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your SaaS Project</h1>
            <p className="text-gray-600">
              Give your abandoned project a new life. Fill out the details below to list it on ReviveStack.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 mb-2">
                <Github className="w-4 h-4 inline mr-1" />
                GitHub Repository URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="repo_url"
                  name="repo_url"
                  required
                  value={formData.repo_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={fetchGitHubData}
                  disabled={fetchingRepo || !formData.repo_url}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center"
                >
                  {fetchingRepo ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Data"
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter a GitHub URL to auto-populate project details</p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., TaskFlow Pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Describe your project, its features, tech stack, and current state..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stars" className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Stars
                </label>
                <input
                  type="number"
                  id="stars"
                  name="stars"
                  min="0"
                  value={formData.stars}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="estimated_value" className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Estimated Value (USD) *
                </label>
                <input
                  type="number"
                  id="estimated_value"
                  name="estimated_value"
                  min="0"
                  required
                  value={formData.estimated_value}
                  onChange={handleChange}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-calculated based on stars and last commit date</p>
              </div>
            </div>

            <div>
              <label htmlFor="seller_email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Contact Email *
              </label>
              <input
                type="email"
                id="seller_email"
                name="seller_email"
                required
                value={formData.seller_email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Before you submit:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure your repository is public or accessible</li>
                <li>• Include a comprehensive README with setup instructions</li>
                <li>• Consider adding screenshots or demo links</li>
                <li>• Be honest about the project's current state and limitations</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Listing Project..." : "List Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
