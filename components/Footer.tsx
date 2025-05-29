import Link from "next/link"
import SocialLinks from "./SocialLinks"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <img src="/images/revivestack-icon.png" alt="ReviveStack" className="w-8 h-8 mr-3" />
              <span className="text-xl font-bold text-gray-900">ReviveStack</span>
            </Link>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              The marketplace for abandoned SaaS projects. Give forgotten code a second chance at success.
            </p>
            <SocialLinks variant="footer" />
          </div>

          {/* Marketplace Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Sell Your Project
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing & Fees
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-600">© {new Date().getFullYear()} ReviveStack. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/cookies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Product Hunt Badge */}
            <div className="mt-4 md:mt-0">
              <Link
                href="https://www.producthunt.com/posts/revivestack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors"
              >
                🚀 Coming to Product Hunt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
