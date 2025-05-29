import Link from "next/link"
import { Sun } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">ReviveStack</span>
            </Link>
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/sell" className="text-gray-600 hover:text-gray-900">
                Sell Your Project
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Sun className="h-5 w-5" />
            </button>
            <Link href="/list-project" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              List Project
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Revive Abandoned SaaS Projects</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find hidden gems with untapped potential or sell your shelved projects to developers who will bring them
              back to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/browse" className="bg-black text-white px-6 py-3 rounded-md text-center hover:bg-gray-800">
                Browse Projects
              </Link>
              <Link
                href="/sell"
                className="bg-white text-black px-6 py-3 rounded-md border border-gray-300 text-center hover:bg-gray-50"
              >
                Sell Your Project
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-md w-1/3 animate-pulse"></div>
              </div>
              <div className="mt-8 h-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
