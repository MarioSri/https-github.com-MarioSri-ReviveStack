"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, Plus, User, LogOut, LayoutDashboard } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReviveStack</span>
            </Link>

            <div className="flex items-center space-x-4">
              {process.env.NODE_ENV === "development" && (
                <Link href="/setup" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                  Setup
                </Link>
              )}

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        href="/sell"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Sell Project
                      </Link>
                      <div className="relative group">
                        <button className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                          <User className="w-4 h-4 mr-2" />
                          {user.email}
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                        Sign In
                      </Link>
                      <Link
                        href="/auth"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ReviveStack. Marketplace for abandoned SaaS projects.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
