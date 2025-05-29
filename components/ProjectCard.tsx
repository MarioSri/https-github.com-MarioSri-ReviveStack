"use client"

import { useState } from "react"
import { Star, ExternalLink, DollarSign, Clock, ShoppingCart } from "lucide-react"
import type { Project } from "@/lib/supabase"
import { daysSinceLastCommit } from "@/lib/github"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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

  // Calculate days since last commit if available
  const abandonedDays = project.last_commit_date ? daysSinceLastCommit(project.last_commit_date) : null

  const handleBuyNow = async () => {
    if (project.status !== "active") {
      alert("This project is no longer available for purchase.")
      return
    }

    // Check if user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      router.push("/auth")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id,
          buyerEmail: user.email,
        }),
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
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    router.push(`/project/${project.id}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
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

      <p className="text-gray-600 mb-4 line-clamp-3">{project.description || "No description available."}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {project.stars > 0 && (
            <div className="flex items-center text-gray-500">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm">{project.stars.toLocaleString()}</span>
            </div>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              <span className="text-sm">Repository</span>
            </a>
          )}
        </div>
      </div>

      {abandonedDays && abandonedDays > 30 && (
        <div className="mb-4 flex items-center text-amber-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Abandoned {abandonedDays} days ago</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center text-green-600">
          <DollarSign className="w-5 h-5 mr-1" />
          <span className="text-lg font-semibold">{formatPrice(project.estimated_value)}</span>
        </div>
        <span className="text-sm text-gray-500">Listed {formatDate(project.created_at)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={handleViewDetails}
          className="py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
        {project.status === "active" && (
          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
