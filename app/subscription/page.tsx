"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { Check, X, Zap, Crown, Star, TrendingUp } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

const pricingTiers = [
  {
    name: "Free Tier",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with project discovery",
    features: [
      { name: "Project Listings", included: true },
      { name: "AI Valuation", included: "limited", note: "3 per month" },
      { name: "Filters & Search", included: "basic", note: "Basic filters only" },
      { name: "Deal Alerts", included: false },
      { name: "Download Reports", included: false },
      { name: "Featured Deals", included: false },
      { name: "Priority Support", included: false },
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro Buyer",
    price: 49,
    period: "month",
    description: "For serious investors and developers",
    features: [
      { name: "Project Listings", included: true },
      { name: "AI Valuation", included: true, note: "Unlimited" },
      { name: "Filters & Search", included: true, note: "Advanced filters" },
      { name: "Deal Alerts", included: true, note: "Instant notifications" },
      { name: "Download Reports", included: true, note: "PDF & JSON exports" },
      { name: "Featured Deals", included: true, note: "Early access" },
      { name: "Priority Support", included: true },
    ],
    cta: "Subscribe & Start Investing",
    popular: true,
  },
]

export default function SubscriptionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: (typeof pricingTiers)[0]) => {
    if (tier.price === 0) {
      // Free tier - just redirect to dashboard
      router.push("/dashboard")
      return
    }

    setLoading(tier.name)

    try {
      // Check if user is authenticated
      const user = await getCurrentUser()
      if (!user) {
        router.push("/auth")
        return
      }

      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_pro_buyer_monthly", // This would be your Stripe price ID
          userId: user.id,
          email: user.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Failed to start subscription. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const getFeatureIcon = (included: boolean | string) => {
    if (included === true) {
      return <Check className="w-5 h-5 text-green-500" />
    } else if (included === "limited" || included === "basic") {
      return <Star className="w-5 h-5 text-yellow-500" />
    } else {
      return <X className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of ReviveStack with advanced tools for serious SaaS investors and developers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border-2 p-8 ${
                tier.popular ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-600 ml-2">/{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {getFeatureIcon(feature.included)}
                    <div className="ml-3">
                      <span className="text-gray-900">{feature.name}</span>
                      {feature.note && <span className="text-sm text-gray-500 block">{feature.note}</span>}
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading === tier.name}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  tier.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-900 text-white hover:bg-gray-800"
                } disabled:opacity-50`}
              >
                {loading === tier.name ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  tier.cta
                )}
              </button>

              {tier.price > 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">14-day free trial • Cancel anytime</p>
              )}
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Upgrade to Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Unlimited AI Valuations</h3>
              <p className="text-gray-600">
                Get comprehensive AI-powered valuations for every project you're interested in, with detailed reports
                and insights.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Access detailed market analysis, trend reports, and competitive intelligence to make informed investment
                decisions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Early Access</h3>
              <p className="text-gray-600">
                Be the first to see new listings and featured deals before they're available to free users.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until
                the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-gray-600">
                Your saved projects and basic data remain accessible. However, advanced features like detailed reports
                and analytics will be limited to the free tier allowances.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day free trial so you can test all Pro features. If you're not satisfied within the first
                30 days, we'll provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
