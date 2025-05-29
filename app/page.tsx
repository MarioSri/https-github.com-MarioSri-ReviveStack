import Link from "next/link"
import { ArrowRight, Star, Users, Shield, Zap } from "lucide-react"
import SocialLinks from "@/components/SocialLinks"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Revive Abandoned
                <span className="text-blue-600 block">SaaS Projects</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Discover hidden gems with untapped potential or sell your shelved projects to developers who will bring
                them back to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/browse"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Projects
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Sell Your Project
                </Link>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Projects Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$2M+</div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <img src="/images/revivestack-icon.png" alt="ReviveStack" className="w-8 h-8 mr-3" />
                  <span className="font-semibold text-gray-900">Featured Project</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">TaskFlow Pro</h3>
                <p className="text-gray-600 mb-4">Advanced project management tool with AI-powered insights...</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">1,247 stars</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">$15,000</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Node.js</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">MongoDB</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ReviveStack?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it safe and easy to buy and sell abandoned SaaS projects with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Escrow</h3>
              <p className="text-gray-600">
                Protected transactions with our secure escrow system. Your money is safe until you're satisfied.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Valuation</h3>
              <p className="text-gray-600">
                Get accurate project valuations powered by AI analysis of code quality, market potential, and more.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Community</h3>
              <p className="text-gray-600">
                Join a community of verified developers and entrepreneurs committed to reviving great projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Official Tagline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to buy your next project or sell one you've built, ReviveStack is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/browse"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Browsing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              List Your Project
            </Link>
          </div>

          {/* Community Section */}
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Our Growing Community</h3>
            <p className="text-gray-600 mb-6">
              Follow our journey, share success stories, and connect with fellow SaaS enthusiasts across all platforms.
            </p>
            <SocialLinks variant="footer" className="justify-center" />
          </div>
        </div>
      </section>
    </div>
  )
}
