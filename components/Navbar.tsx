'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import NotificationBell from '@/components/NotificationBell'
import Link from 'next/link'
import { MessageCircle, Heart, User, Crown } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadCounts()
    }
  }, [user])

  const loadCounts = async () => {
    if (!user?.id) return
    
    try {
      // Load unread message count
      const { data: conversations } = await supabase
        .from('chat_conversations')
        .select('id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

      if (conversations) {
        const { data: unreadMessages } = await supabase
          .from('chat_messages')
          .select('id')
          .in('conversation_id', conversations.map(c => c.id))
          .eq('is_read', false)
          .neq('sender_id', user.id)

        setUnreadCount(unreadMessages?.length || 0)
      }

      // Notification count is now handled by useNotifications hook
    } catch (error) {
      console.error('Error loading counts:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const NotificationBadge = ({ count }: { count: number }) => {
    if (count === 0) return null
    return (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    )
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">MU Market</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Create Listing
            </Link>
            <Link
              href="/my-listings"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors"
            >
              My Listings
            </Link>
            
            {/* Chat */}
            <Link
              href="/chat"
              className="relative text-gray-700 hover:text-indigo-600 p-2 rounded-md transition-colors"
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
              <NotificationBadge count={unreadCount} />
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative text-gray-700 hover:text-indigo-600 p-2 rounded-md transition-colors"
              title="Favorites"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            {user && <NotificationBell user={user} />}

            <div className="flex items-center space-x-4">
              {/* Profile */}
              <Link href="/profile" className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Premium user crown - to be implemented later */}
                </div>
                <User className="w-4 h-4 text-gray-500" />
              </Link>
              
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
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
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
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/create"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Create Listing
              </Link>
              <Link
                href="/my-listings"
                className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                My Listings
              </Link>
              
              <Link
                href="/chat"
                className="text-gray-700 hover:text-indigo-600 flex items-center gap-2 px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <MessageCircle className="w-5 h-5" />
                Messages
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/favorites"
                className="text-gray-700 hover:text-indigo-600 flex items-center gap-2 px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <Heart className="w-5 h-5" />
                Favorites
              </Link>

              <Link
                href="/profile"
                className="text-gray-700 hover:text-indigo-600 flex items-center gap-2 px-3 py-2 rounded-md font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <User className="w-5 h-5" />
                Profile
              </Link>

              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* Premium user crown - to be implemented later */}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {user?.user_metadata?.name || user?.email?.split('@')[0]}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {user?.email}
                      </p>
                      {/* Premium user badge - to be implemented later */}
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
