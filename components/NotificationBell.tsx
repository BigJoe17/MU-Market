'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import type { User as AuthUser } from '@supabase/supabase-js'
import { User } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import NotificationComponent, { useNotifications } from './NotificationComponent'

interface NotificationBellProps {
  user: AuthUser
}

export default function NotificationBell({ user: authUser }: NotificationBellProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { unreadCount, requestNotificationPermission } = useNotifications(authUser.id)

  useEffect(() => {
    loadUserProfile()
  }, [authUser])

  const loadUserProfile = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userProfile) {
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleBellClick = async () => {
    // Request notification permission if not granted
    await requestNotificationPermission()
    setIsNotificationOpen(true)
  }

  if (!user) return null

  return (
    <>
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationComponent
        user={user}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  )
}
