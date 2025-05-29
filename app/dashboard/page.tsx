"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { getCurrentUser, getUserProfile, createUserProfile, type Profile } from "@/lib/auth"
import { supabase, type Project } from "@/lib/supabase"
import { Package, ShoppingBag, DollarSign, TrendingUp, Plus, User } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [myPurchases, setMyPurchases] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/auth")
          return
        }

        setUser(currentUser)

        // Try to get user profile
        setProfileLoading(true)
        let userProfile = await getUserProfile(currentUser.id)

        // If no profile exists, create one
        if (!userProfile) {
          console.log("No profile found, creating one...")
          userProfile = await createUserProfile(currentUser.id, currentUser.email, currentUser.user_metadata?.full_name)
        }

        setProfile(userProfile)
        setProfileLoading(false)

        // Fetch user's projects
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })

        if (projectsError) {
          console.error("Error fetching projects:", projectsError)
        } else {
          setMyProjects(projects || [])
        }

        // Fetch user's purchases
        const { data: purchases, error: purchasesError } = await supabase
          .from("projects")
          .select("*")
          .eq("buyer_id", currentUser.id)
          .order("created_at", { ascending: false })

        if (purchasesError) {
          console.error("Error fetching purchases:", purchasesError)
        } else {
          setMyPurchases(purchases || [])
        }
      } catch (error) {
        console.error("Error in checkAuth:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

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

  const totalEarnings = myProjects.filter((p) => p.status === "sold").reduce((sum, p) => sum + p.estimated_value, 0)
  const totalSpent = myPurchases.reduce((sum, p) => sum + p.estimated_value, 0)

  // Get display name
  const displayName = profile?.full_name || user?.email || "User"

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {profileLoading ? (
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mr-4"></div>
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profileLoading ? "Loading..." : displayName}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">My Projects</p>
                <p className="text-2xl font-bold text-gray-900">{myProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ShoppingBag className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{myPurchases.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
              <Link
                href="/sell"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Link>
            </div>

            {myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : project.status === "sold"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">{formatPrice(project.estimated_value)}</span>
                      <span className="text-gray-500 text-sm">{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't listed any projects yet.</p>
                <Link
                  href="/sell"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Project
                </Link>
              </div>
            )}
          </div>

          {/* My Purchases */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Purchases</h2>

            {myPurchases.length > 0 ? (
              <div className="space-y-4">
                {myPurchases.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Purchased</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">{formatPrice(project.estimated_value)}</span>
                      <span className="text-gray-500 text-sm">{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't purchased any projects yet.</p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Projects
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
