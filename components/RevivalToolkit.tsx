"use client"

import { useState } from "react"
import { CheckSquare, FileText, Wrench, BarChart3, Download, Loader2, ExternalLink } from "lucide-react"

interface RevivalTask {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
}

interface RevivalToolkitProps {
  projectId: string
  projectData?: {
    title: string
    repo_url: string
    tech_stack: string[]
  }
}

export default function RevivalToolkit({ projectId, projectData }: RevivalToolkitProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [generatedDocs, setGeneratedDocs] = useState<string | null>(null)
  const [techRecommendations, setTechRecommendations] = useState<any[]>([])

  const [revivalTasks, setRevivalTasks] = useState<RevivalTask[]>([
    {
      id: "1",
      title: "Code Quality Assessment",
      description: "Review codebase for technical debt and code smells",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      title: "Dependency Updates",
      description: "Update all dependencies to latest stable versions",
      completed: false,
      priority: "high",
    },
    {
      id: "3",
      title: "Security Audit",
      description: "Scan for security vulnerabilities and fix issues",
      completed: false,
      priority: "high",
    },
    {
      id: "4",
      title: "Documentation Review",
      description: "Update README, API docs, and setup instructions",
      completed: false,
      priority: "medium",
    },
    {
      id: "5",
      title: "Testing Coverage",
      description: "Add missing tests and improve coverage",
      completed: false,
      priority: "medium",
    },
    {
      id: "6",
      title: "Performance Optimization",
      description: "Identify and fix performance bottlenecks",
      completed: false,
      priority: "medium",
    },
    {
      id: "7",
      title: "UI/UX Improvements",
      description: "Modernize interface and improve user experience",
      completed: false,
      priority: "low",
    },
    {
      id: "8",
      title: "Mobile Responsiveness",
      description: "Ensure proper mobile device compatibility",
      completed: false,
      priority: "low",
    },
  ])

  const handleTaskToggle = (taskId: string) => {
    setRevivalTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  const handleGenerateDocs = async () => {
    setLoading("docs")
    try {
      const response = await fetch("/api/ai/generate-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          projectData,
        }),
      })

      if (response.ok) {
        const { documentation } = await response.json()
        setGeneratedDocs(documentation)
      }
    } catch (error) {
      console.error("Error generating docs:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleGetTechRecommendations = async () => {
    setLoading("tech")
    try {
      const response = await fetch("/api/ai/recommend-updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tech_stack: projectData?.tech_stack || [],
          projectId,
        }),
      })

      if (response.ok) {
        const { recommendations } = await response.json()
        setTechRecommendations(recommendations)
      }
    } catch (error) {
      console.error("Error getting recommendations:", error)
    } finally {
      setLoading(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const completedTasks = revivalTasks.filter((task) => task.completed).length
  const totalTasks = revivalTasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revival Toolkit</h2>
        <p className="text-gray-600">Tools and checklists to help you successfully revive this project</p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-blue-900">Revival Progress</h3>
          <span className="text-blue-700 font-medium">
            {completedTasks}/{totalTasks} tasks
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revival Checklist */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Revival Checklist
          </h3>
          <div className="space-y-3">
            {revivalTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(task.id)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                      {task.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-600"}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tools */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Tools</h3>
          <div className="space-y-4">
            {/* Documentation Generator */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Documentation Generator</h4>
                </div>
                <button
                  onClick={handleGenerateDocs}
                  disabled={loading === "docs"}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading === "docs" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Generate
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Generate comprehensive documentation including README, API docs, and setup guides.
              </p>
              {generatedDocs && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Generated Documentation</span>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                  <pre className="text-xs text-gray-600 overflow-x-auto max-h-32">
                    {generatedDocs.substring(0, 200)}...
                  </pre>
                </div>
              )}
            </div>

            {/* Tech Stack Guide */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Tech Stack Guide</h4>
                </div>
                <button
                  onClick={handleGetTechRecommendations}
                  disabled={loading === "tech"}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {loading === "tech" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Wrench className="w-4 h-4 mr-2" />
                  )}
                  Analyze
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get recommendations for updating dependencies and modernizing the tech stack.
              </p>
              {techRecommendations.length > 0 && (
                <div className="space-y-2">
                  {techRecommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{rec.package}</span>
                        <span className="text-sm text-gray-600">
                          {rec.currentVersion} → {rec.latestVersion}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analytics Snapshot */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Analytics Snapshot</h4>
                </div>
                {projectData?.repo_url && (
                  <a
                    href={projectData.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Repo
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">GitHub activity analysis and project health metrics.</p>
              <div className="bg-gray-50 p-3 rounded border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Last Commit:</span>
                    <span className="ml-2 font-medium">2 months ago</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Contributors:</span>
                    <span className="ml-2 font-medium">3 active</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Issues:</span>
                    <span className="ml-2 font-medium">12 open</span>
                  </div>
                  <div>
                    <span className="text-gray-600">PRs:</span>
                    <span className="ml-2 font-medium">2 pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
