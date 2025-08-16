'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getUserConversations } from '@/lib/utils'
import { ChatConversation, User } from '@/lib/types'
import { MessageCircle, Search, Users, Clock } from 'lucide-react'
import Image from 'next/image'
import ChatComponent from './ChatComponent'

interface ChatListProps {
  user: User
}

interface ConversationWithDetails extends ChatConversation {
  other_user?: User
  listing_details?: {
    id: string
    title: string
    image_url?: string
  }
  unread_count?: number
  last_message?: {
    message: string
    created_at: string
    sender_id: string
  }
}

export default function ChatList({ user }: ChatListProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    loadConversations()
    subscribeToConversations()
  }, [user])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const userConversations = await getUserConversations(user.id)
      setConversations(userConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToConversations = () => {
    const channel = supabase
      .channel(`conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations',
          filter: `buyer_id=eq.${user.id},seller_id=eq.${user.id}`
        },
        () => {
          loadConversations()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          // Update conversation with new message
          const message = payload.new
          setConversations(prev => 
            prev.map(conv => {
              if (conv.id === message.conversation_id) {
                return {
                  ...conv,
                  last_message: {
                    message: message.message,
                    created_at: message.created_at,
                    sender_id: message.sender_id
                  },
                  last_message_at: message.created_at,
                  unread_count: message.sender_id !== user.id 
                    ? (conv.unread_count || 0) + 1 
                    : conv.unread_count
                }
              }
              return conv
            })
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleConversationClick = (conversation: ConversationWithDetails) => {
    setSelectedConversation(conversation)
    setIsChatOpen(true)
    
    // Mark conversation as read
    if (conversation.unread_count && conversation.unread_count > 0) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      conv.other_user?.email.toLowerCase().includes(searchLower) ||
      conv.listing_details?.title.toLowerCase().includes(searchLower) ||
      conv.last_message?.message.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Chat with buyers and sellers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start chatting by messaging someone about their listing'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {conversation.other_user?.profile_image_url ? (
                        <Image
                          src={conversation.other_user.profile_image_url}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {conversation.other_user?.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Conversation Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.other_user?.email.split('@')[0]}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conversation.unread_count && conversation.unread_count > 0 && (
                            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unread_count}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(conversation.last_message_at || conversation.created_at)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-indigo-600 mb-1">
                        {conversation.listing_details?.title}
                      </p>

                      {conversation.last_message && (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message.sender_id === user.id ? 'You: ' : ''}
                          {conversation.last_message.message}
                        </p>
                      )}
                    </div>

                    {/* Listing Image */}
                    {conversation.listing_details?.image_url && (
                      <div className="flex-shrink-0">
                        <Image
                          src={conversation.listing_details.image_url}
                          alt="Listing"
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Component */}
      {selectedConversation && (
        <ChatComponent
          sellerId={selectedConversation.seller_id}
          listingId={selectedConversation.listing_id}
                    listingTitle={selectedConversation.listing_details?.title || 'Chat'}
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false)
            setSelectedConversation(null)
          }}
        />
      )}
    </div>
  )
}
