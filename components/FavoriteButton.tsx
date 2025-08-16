'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavorite, isListingFavorited } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface FavoriteButtonProps {
  listingId: string
  className?: string
  showCount?: boolean
  count?: number
}

export default function FavoriteButton({ 
  listingId, 
  className = '', 
  showCount = false, 
  count = 0 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(count)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFavoriteStatus()
  }, [listingId])

  const checkAuthAndFavoriteStatus = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const favorited = await isListingFavorited(listingId, authUser.id)
        setIsFavorited(favorited)
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation()

    if (!user) {
      // Redirect to auth page or show login modal
      window.location.href = '/auth'
      return
    }

    setIsLoading(true)
    try {
      const wasAdded = await toggleFavorite(listingId)
      setIsFavorited(wasAdded)
      
      // Update count optimistically
      if (showCount) {
        setFavoriteCount(prev => wasAdded ? prev + 1 : Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        flex items-center gap-1 transition-colors
        ${isFavorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`w-5 h-5 transition-all ${
          isFavorited ? 'fill-current' : ''
        }`}
      />
      {showCount && (
        <span className="text-sm">
          {favoriteCount}
        </span>
      )}
    </button>
  )
}
