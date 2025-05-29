"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Layout from "@/components/Layout"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [projectTitle, setProjectTitle] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      router.push("/")
      return
    }

    // Fetch session details to get project information
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/session?id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setProjectTitle(data.projectTitle || "your project")
        }
      } catch (error) {
        console.error("Error fetching session details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionDetails()
  }, [sessionId, router])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-green-100 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for purchasing <span className="font-semibold">{projectTitle}</span>. The seller will contact
                you shortly with access details.
              </p>
              <div className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
                <ol className="text-left space-y-4 mb-8">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      1
                    </span>
                    <span>
                      The seller will receive a notification about your purchase and your contact information.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      2
                    </span>
                    <span>
                      Within 24-48 hours, they will contact you with repository access and any additional information.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      3
                    </span>
                    <span>
                      You'll have 7 days to review the project. If there are any issues, contact our support team.
                    </span>
                  </li>
                </ol>
              </div>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse More Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
