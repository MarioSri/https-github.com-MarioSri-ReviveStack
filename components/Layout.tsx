"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import SocialLinks from "./SocialLinks"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return // Add this line

      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes - only on client side
    if (typeof window !== "undefined") {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/revivestack-icon.png" alt="ReviveStack" className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900">ReviveStack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>

              {/* Social Links in Header */}
              <SocialLinks variant="header" className="hidden lg:flex" />
            </div>

            {/* Desktop Auth & Actions */}
            <div className="hidden md:flex items-center space-x-4">
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
                        className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
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
                          {user.email?.split("@")[0] || "User"}
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <Link
                            href="/dashboard"
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Settings
                          </Link>
                          <hr className="my-1" />
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                <Link
                  href="/browse"
                  className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Projects
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>

                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/sell"
                          className="block bg-blue-600 text-white px-3 py-2 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sell Project
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth"
                          className="block text-gray-600 hover:text-gray-900 px-3 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth"
                          className="block bg-blue-600 text-white px-3 py-2 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Started
                        </Link>
                      </>
                    )}
                  </>
                )}

                {/* Mobile Social Links */}
                <div className="pt-4 border-t border-gray-200">
                  <SocialLinks variant="sidebar" />
                </div>
              </div>
            </div>
          )}
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
