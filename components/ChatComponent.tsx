'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  createConversation, 
  sendMessage, 
  getConversationMessages, 
  markMessagesAsRead,
  notifyNewMessage 
} from '@/lib/utils'
import { ChatConversation, ChatMessage, User } from '@/lib/types'
import { Send, X, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface ChatComponentProps {
  sellerId: string
  listingId: string
  listingTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatComponent({ 
  sellerId, 
  listingId, 
  listingTitle, 
  isOpen, 
  onClose 
}: ChatComponentProps) {
  const [conversation, setConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      initializeChat()
    }
  }, [isOpen, sellerId, listingId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversation) {
      subscribeToMessages()
      markMessagesAsRead(conversation.id, user?.id || '')
    }

    return () => {
      // Cleanup subscription
      supabase.removeAllChannels()
    }
  }, [conversation, user])

  const initializeChat = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return
      
      setUser(authUser as any)

      // Create or get existing conversation
      const conv = await createConversation(authUser.id, sellerId, listingId)
      setConversation(conv)

      // Load messages
      const convMessages = await getConversationMessages(conv.id)
      setMessages(convMessages)
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    if (!conversation) return

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages(prev => [...prev, newMessage])
          
          // Mark as read if not from current user
          if (newMessage.sender_id !== user?.id) {
            markMessagesAsRead(conversation.id, user?.id || '')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return

    try {
      const message = await sendMessage(conversation.id, newMessage.trim())
      
      // Create notification for the recipient
      const recipientId = conversation.buyer_id === user.id 
        ? conversation.seller_id 
        : conversation.buyer_id
      
      try {
        await notifyNewMessage(
          recipientId,
          user.email.split('@')[0], // Use email prefix as name
          listingTitle,
          conversation.id
        )
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
        // Don't fail the message send if notification fails
      }
      
      setNewMessage('')
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <p className="text-sm text-gray-600 truncate">{listingTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Start a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
