import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">ReviveStack</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-xs">
              Marketplace for abandoned SaaS projects. Find hidden gems or sell your shelved projects.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Marketplace</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-sm text-gray-600 hover:text-gray-900">
                    Sell Your Project
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/success-stories" className="text-sm text-gray-600 hover:text-gray-900">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-gray-600 hover:text-gray-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} ReviveStack. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
