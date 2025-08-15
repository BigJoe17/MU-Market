'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NavbarProps {
  user: any
}

export default function Navbar({ user }: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MU Market</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Create Listing
            </Link>
            <Link
              href="/my-listings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              My Listings
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* <span className="text-gray-600 text-sm hidden lg:block">
                  {user?.user_metadata?.name || user?.email?.split('@')[0]}
                </span> */}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/create"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Create Listing
              </Link>
              <Link
                href="/my-listings"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                My Listings
              </Link>
              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {user?.user_metadata?.name || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
