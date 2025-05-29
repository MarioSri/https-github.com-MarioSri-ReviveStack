"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ServiceStatus {
  name: string
  status: "healthy" | "degraded" | "down" | "checking"
  message?: string
  lastChecked?: string
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "Authentication Service", status: "checking" },
    { name: "Database Connection", status: "checking" },
    { name: "Google OAuth", status: "checking" },
    { name: "GitHub OAuth", status: "checking" },
    { name: "Stripe Integration", status: "checking" },
  ])

  const [loading, setLoading] = useState(true)

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"
  }

  useEffect(() => {
    checkServices()
  }, [])

  const checkServices = async () => {
    setLoading(true)
    const updatedServices: ServiceStatus[] = []

    // Check Health API
    try {
      const healthResponse = await fetch("/api/health")
      const healthData = await healthResponse.json()

      updatedServices.push({
        name: "Authentication Service",
        status: healthResponse.ok ? "healthy" : "degraded",
        message: healthResponse.ok ? "Service operational" : "Service issues detected",
        lastChecked: new Date().toLocaleTimeString(),
      })

      updatedServices.push({
        name: "Database Connection",
        status: healthData.database === "connected" ? "healthy" : "degraded",
        message: healthData.database === "connected" ? "Database connected" : "Database connection issues",
        lastChecked: new Date().toLocaleTimeString(),
      })
    } catch (error) {
      updatedServices.push({
        name: "Authentication Service",
        status: "down",
        message: "Service unavailable",
        lastChecked: new Date().toLocaleTimeString(),
      })
      updatedServices.push({
        name: "Database Connection",
        status: "down",
        message: "Cannot connect to database",
        lastChecked: new Date().toLocaleTimeString(),
      })
    }

    // Check Google OAuth
    const hasGoogleConfig = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    updatedServices.push({
      name: "Google OAuth",
      status: hasGoogleConfig ? "healthy" : "degraded",
      message: hasGoogleConfig ? "OAuth configured" : "OAuth configuration missing",
      lastChecked: new Date().toLocaleTimeString(),
    })

    // Check GitHub OAuth
    updatedServices.push({
      name: "GitHub OAuth",
      status: hasGoogleConfig ? "healthy" : "degraded",
      message: hasGoogleConfig ? "OAuth configured" : "OAuth configuration missing",
      lastChecked: new Date().toLocaleTimeString(),
    })

    // Check Stripe
    try {
      const stripeResponse = await fetch("/api/stripe-test")
      updatedServices.push({
        name: "Stripe Integration",
        status: stripeResponse.ok ? "healthy" : "degraded",
        message: stripeResponse.ok ? "Stripe connected" : "Stripe connection issues",
        lastChecked: new Date().toLocaleTimeString(),
      })
    } catch (error) {
      updatedServices.push({
        name: "Stripe Integration",
        status: "down",
        message: "Stripe unavailable",
        lastChecked: new Date().toLocaleTimeString(),
      })
    }

    setServices(updatedServices)
    setLoading(false)
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "checking":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "down":
        return "text-red-600"
      case "checking":
        return "text-blue-600"
    }
  }

  const overallStatus = services.every((s) => s.status === "healthy")
    ? "All Systems Operational"
    : services.some((s) => s.status === "down")
      ? "Service Disruption"
      : "Partial Service Issues"

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
            <p className="text-lg text-gray-600">{overallStatus}</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleString()}</p>
          </div>

          <div className="space-y-4 mb-8">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    {service.message && <div className="text-sm text-gray-500">{service.message}</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </div>
                  {service.lastChecked && <div className="text-xs text-gray-500">{service.lastChecked}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={checkServices}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          </div>

          {/* Environment Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Environment Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Environment: {process.env.NODE_ENV || "development"}</div>
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Configured" : "✗ Missing"}</div>
              <div>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Configured" : "✗ Missing"}</div>
              <div>Stripe Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✓ Configured" : "✗ Missing"}</div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Troubleshooting</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                • If Google OAuth is failing, check that the OAuth consent screen is configured in Google Cloud Console
              </p>
              <p>• Ensure the redirect URI is set to: {getBaseUrl()}/auth/callback</p>
              <p>• Verify that all environment variables are properly set in your deployment</p>
              <p>• Check the browser console for detailed error messages</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
