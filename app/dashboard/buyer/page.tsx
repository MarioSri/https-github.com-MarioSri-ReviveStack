"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { getCurrentUser } from "@/lib/auth"
import {
  Heart,
  Bell,
  FileText,
  GitCompare,
  DollarSign,
  Clock,
  Download,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface SavedProject {
  id: string
  title: string
  description: string
  price: number
  stars: number
  status: string
  savedAt: string
}

interface WatchlistAlert {
  id: string
  name: string
  criteria: string
  enabled: boolean
  matches: number
}

interface Deal {
  id: string
  projectTitle: string
  offerAmount: number
  status: "pending" | "under_review" | "accepted" | "rejected"
  createdAt: string
}

export default function BuyerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("saved")

  // Mock data - in real app, fetch from API
  const [savedProjects] = useState<SavedProject[]>([
    {
      id: "1",
      title: "TaskFlow Pro",
      description: "Advanced project management tool with AI-powered insights",
      price: 15000,
      stars: 1247,
      status: "active",
      savedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "EcoTracker",
      description: "Carbon footprint tracking app for businesses",
      price: 8500,
      stars: 892,
      status: "active",
      savedAt: "2024-01-10",
    },
  ])

  const [watchlistAlerts] = useState<WatchlistAlert[]>([
    {
      id: "1",
      name: "React Projects Under $10k",
      criteria: "Tech: React, Price: < $10,000",
      enabled: true,
      matches: 3,
    },
    {
      id: "2",
      name: "High Star Count SaaS",
      criteria: "Stars: > 1000, Category: SaaS",
      enabled: false,
      matches: 1,
    },
  ])

  const [deals] = useState<Deal[]>([
    {
      id: "1",
      projectTitle: "TaskFlow Pro",
      offerAmount: 12000,
      status: "pending",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      projectTitle: "CodeReview Bot",
      offerAmount: 20000,
      status: "under_review",
      createdAt: "2024-01-18",
    },
  ])

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleRemoveProject = (projectId: string) => {
    // In real app, call API to remove from saved projects
    console.log("Removing project:", projectId)
  }

  const handleToggleAlert = (alertId: string) => {
    // In real app, call API to toggle alert
    console.log("Toggling alert:", alertId)
  }

  const handleMakeOffer = async (projectId: string) => {
    try {
      const response = await fetch("/api/create-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          buyerId: user.id,
          offerAmount: 10000, // This would come from a form
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Error making offer:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "under_review":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600">Manage your saved projects, offers, and investment activities</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "saved", name: "Saved Projects", icon: Heart },
              { id: "watchlist", name: "Watchlist Alerts", icon: Bell },
              { id: "reports", name: "Valuation Reports", icon: FileText },
              { id: "compare", name: "Compare Projects", icon: GitCompare },
              { id: "deals", name: "Deal Tracker", icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md">
          {/* Saved Projects */}
          {activeTab === "saved" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Projects</h2>
              <div className="space-y-4">
                {savedProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-green-600 font-semibold">${project.price.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm">{project.stars} stars</span>
                        <span className="text-gray-500 text-sm">Saved {project.savedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/project/${project.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMakeOffer(project.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Make Offer
                      </button>
                      <button
                        onClick={() => handleRemoveProject(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watchlist Alerts */}
          {activeTab === "watchlist" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Watchlist Alerts</h2>
              <div className="space-y-4">
                {watchlistAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                      <p className="text-gray-600 text-sm">{alert.criteria}</p>
                      <p className="text-blue-600 text-sm mt-1">{alert.matches} matching projects</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={alert.enabled}
                          onChange={() => handleToggleAlert(alert.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valuation Reports */}
          {activeTab === "reports" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Valuation Reports</h2>
              <div className="space-y-4">
                {savedProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-gray-600 text-sm">AI Valuation Report</p>
                      <p className="text-green-600 text-sm mt-1">Estimated Value: ${project.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
                        <Download className="w-4 h-4 mr-2" />
                        JSON
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compare Projects */}
          {activeTab === "compare" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Compare Projects</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valuation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stars
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tech Stack
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {savedProjects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.description.substring(0, 50)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${project.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.stars}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">React</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Node.js</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleMakeOffer(project.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Make Offer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deal Tracker */}
          {activeTab === "deals" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Deal Tracker</h2>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{deal.projectTitle}</h3>
                      <p className="text-gray-600 text-sm">Offer: ${deal.offerAmount.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">Created {deal.createdAt}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getStatusIcon(deal.status)}
                        <span className="ml-2 text-sm capitalize">{deal.status.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
