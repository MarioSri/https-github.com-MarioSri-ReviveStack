"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GitBranch, Star, DollarSign, AlertCircle, Loader2 } from "lucide-react"

export default function SellProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchingRepo, setFetchingRepo] = useState(false)
  const [formData, setFormData] = useState({
    github_url: "",
    title: "",
    description: "",
    price: "",
    tech_stack: [] as string[],
    demo_url: "",
  })
  const [repoData, setRepoData] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tech = e.target.value
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, tech],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        tech_stack: prev.tech_stack.filter((t) => t !== tech),
      }))
    }
  }

  const fetchGitHubRepo = async () => {
    if (!formData.github_url) {
      setErrors((prev) => ({ ...prev, github_url: "GitHub URL is required" }))
      return
    }

    setFetchingRepo(true)

    try {
      // In a real app, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response
      const mockRepoData = {
        name: "TaskFlow Pro",
        description: "Advanced project management tool with AI-powered insights",
        stars: 1247,
        forks: 89,
        tech_stack: ["React", "Node.js", "MongoDB"],
        last_commit_date: "2023-01-15T00:00:00Z",
        estimated_value: 15000,
      }

      setRepoData(mockRepoData)
      setFormData((prev) => ({
        ...prev,
        title: mockRepoData.name,
        description: mockRepoData.description,
        price: mockRepoData.estimated_value.toString(),
        tech_stack: mockRepoData.tech_stack,
      }))
    } catch (error) {
      console.error("Error fetching repository:", error)
      setErrors((prev) => ({ ...prev, github_url: "Failed to fetch repository data" }))
    } finally {
      setFetchingRepo(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.github_url) newErrors.github_url = "GitHub URL is required"
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number"
    }
    if (formData.tech_stack.length === 0) newErrors.tech_stack = "Select at least one technology"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // In a real app, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page or dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting project:", error)
      setErrors((prev) => ({ ...prev, form: "Failed to submit project" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">List Your Project</h1>
        <p className="text-gray-600 mb-8">
          Sell your abandoned SaaS project to developers who will bring it back to life
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <span className="text-red-700">{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="github_url" className="block font-medium mb-2">
                GitHub Repository URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="github_url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repository"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.github_url ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={fetchGitHubRepo}
                  disabled={fetchingRepo}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center whitespace-nowrap"
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
              {errors.github_url && <p className="mt-1 text-sm text-red-600">{errors.github_url}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Enter your GitHub repository URL to automatically fetch project details
              </p>
            </div>

            {repoData && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Repository Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm">{repoData.stars} stars</span>
                  </div>
                  <div className="flex items-center">
                    <GitBranch className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm">{repoData.forks} forks</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-blue-700">
                      Last commit: {new Date(repoData.last_commit_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="title" className="block font-medium mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., TaskFlow Pro"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project, its features, and why it's valuable"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="price" className="block font-medium mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.price ? (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Set a fair price based on the project's complexity, features, and potential
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">Tech Stack *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "React",
                  "Vue.js",
                  "Angular",
                  "Node.js",
                  "Python",
                  "Ruby",
                  "PHP",
                  "Java",
                  "Go",
                  "MongoDB",
                  "PostgreSQL",
                  "MySQL",
                ].map((tech) => (
                  <div key={tech} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tech-${tech}`}
                      value={tech}
                      checked={formData.tech_stack.includes(tech)}
                      onChange={handleTechStackChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`tech-${tech}`} className="ml-2 text-sm text-gray-700">
                      {tech}
                    </label>
                  </div>
                ))}
              </div>
              {errors.tech_stack && <p className="mt-1 text-sm text-red-600">{errors.tech_stack}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="demo_url" className="block font-medium mb-2">
                Demo URL (Optional)
              </label>
              <input
                type="url"
                id="demo_url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                placeholder="https://demo.yourproject.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">If available, provide a link to a live demo of your project</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Before you submit:</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Ensure your repository is public or accessible</li>
                <li>• Include a comprehensive README with setup instructions</li>
                <li>• Make sure all dependencies are documented</li>
                <li>• Be honest about the project's current state and limitations</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "List Project"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
