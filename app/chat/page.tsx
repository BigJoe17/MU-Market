'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserConversations } from '@/lib/utils'
import { ChatConversation, User } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Search, ArrowLeft } from 'lucide-react'

export default function ChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv =>
        conv.listing?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.buyer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.seller?.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredConversations(filtered)
    } else {
      setFilteredConversations(conversations)
    }
  }, [searchQuery, conversations])

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth')
        return
      }

      setUser(authUser as any)
      await loadConversations(authUser.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const loadConversations = async (userId: string) => {
    try {
      const userConversations = await getUserConversations(userId)
      setConversations(userConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getOtherUser = (conversation: ChatConversation) => {
    return conversation.buyer_id === user?.id ? conversation.seller : conversation.buyer
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">Manage your conversations with buyers and sellers</p>
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {conversations.length} conversations
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start chatting with sellers or buyers from listing pages'
                }
              </p>
              {!searchQuery && (
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Listings
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation)
                const isSellerView = conversation.seller_id === user?.id

                return (
                  <Link
                    key={conversation.id}
                    href={`/chat/${conversation.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Other user avatar */}
                        <div className="flex-shrink-0">
                          {otherUser?.profile_image_url ? (
                            <Image
                              src={otherUser.profile_image_url}
                              alt={otherUser.email}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {otherUser?.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Conversation info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {otherUser?.email.split('@')[0]}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatTime(conversation.last_message_at)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isSellerView 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isSellerView ? 'Buyer' : 'Seller'}
                            </span>
                          </div>

                          {/* Listing info */}
                          <div className="flex items-center gap-3">
                            {conversation.listing?.image_url && (
                              <Image
                                src={conversation.listing.image_url}
                                alt={conversation.listing.title}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.listing?.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                ₹{conversation.listing?.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
