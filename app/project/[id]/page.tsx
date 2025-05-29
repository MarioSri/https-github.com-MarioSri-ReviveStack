"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/lib/supabase"
import { daysSinceLastCommit } from "@/lib/github"
import { Star, ExternalLink, DollarSign, Clock, ShoppingCart, Calendar, ArrowLeft, Loader2, Mail } from "lucide-react"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

        if (error) throw error
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleBuyNow = async () => {
    if (!project || project.status !== "active") {
      alert("This project is no longer available for purchase.")
      return
    }

    setCheckoutLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: project.id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Failed to process payment"}`)
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Calculate days since last commit if available
  const abandonedDays = project?.last_commit_date ? daysSinceLastCommit(project.last_commit_date) : null

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => router.push("/")} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                project.status === "active"
                  ? "bg-green-100 text-green-800"
                  : project.status === "sold"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {project.status === "sold" ? "Sold" : project.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-2xl font-bold text-green-600">{formatPrice(project.estimated_value)}</span>
              <span className="text-sm text-gray-500">Estimated Value</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <Star className="w-8 h-8 text-amber-500 mb-2" />
              <span className="text-2xl font-bold text-gray-900">{project.stars.toLocaleString()}</span>
              <span className="text-sm text-gray-500">GitHub Stars</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-2xl font-bold text-gray-900">{formatDate(project.created_at)}</span>
              <span className="text-sm text-gray-500">Listed Date</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Project</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.description || "No description available."}</p>
          </div>

          {abandonedDays && abandonedDays > 30 && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center text-amber-700 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">Abandoned {abandonedDays} days ago</span>
              </div>
              <p className="text-amber-600 text-sm">
                This project hasn't been updated in a while, making it a perfect candidate for revival!
              </p>
            </div>
          )}

          {project.repo_url && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Repository</h2>
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                <span>{project.repo_url}</span>
              </a>
            </div>
          )}

          {project.seller_email && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                <a href={`mailto:${project.seller_email}`} className="text-blue-600 hover:text-blue-800">
                  {project.seller_email}
                </a>
              </div>
            </div>
          )}

          {project.status === "active" && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900">Ready to revive this project?</h3>
                  <p className="text-gray-600">Purchase now and get full access to the codebase.</p>
                </div>
                <button
                  onClick={handleBuyNow}
                  disabled={checkoutLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now ({formatPrice(project.estimated_value)})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
