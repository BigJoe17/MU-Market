'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserFavorites } from '@/lib/utils'
import { Favorite } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth')
        return
      }

      setUser(authUser)
      await loadFavorites(authUser.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async (userId: string) => {
    try {
      const userFavorites = await getUserFavorites(userId)
      setFavorites(userFavorites)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    return `₹${price.toLocaleString()}`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product':
        return 'bg-blue-100 text-blue-800'
      case 'service':
        return 'bg-green-100 text-green-800'
      case 'skill':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
      <div className="max-w-6xl mx-auto p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">Your saved listings and wishlist</p>
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              {favorites.length} items
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing listings and save your favorites for later
            </p>
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const listing = favorite.listing
              if (!listing) return null

              return (
                <div
                  key={favorite.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <Link href={`/listing/${listing.id}`}>
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {listing.image_url ? (
                        <Image
                          src={listing.image_url}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <p className="text-sm">No image</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(listing.category)}`}>
                          {listing.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <div className="absolute top-3 right-3">
                        <FavoriteButton 
                          listingId={listing.id} 
                          className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all"
                          showCount={false}
                        />
                      </div>

                      {/* Featured Badge */}
                      {listing.is_featured && (
                        <div className="absolute bottom-3 left-3">
                          <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                            FEATURED
                          </div>
                        </div>
                      )}

                      {/* Sold Badge */}
                      {listing.is_sold && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="bg-red-600 text-white font-bold px-3 py-1 rounded">
                            SOLD
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {listing.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-indigo-600">
                          {formatPrice(listing.price)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                          <span>{listing.favorites_count}</span>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        {listing.user?.profile_image_url ? (
                          <Image
                            src={listing.user.profile_image_url}
                            alt={listing.user.email}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {listing.user?.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-600">
                          {listing.user?.email?.split('@')[0]}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          Saved {new Date(favorite.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {/* Tips */}
        {favorites.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Shopping Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">Compare Prices</p>
                <p>Check multiple listings for similar items to get the best deal.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Message Sellers</p>
                <p>Don't hesitate to ask questions or negotiate prices.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Act Fast</p>
                <p>Popular items tend to sell quickly, especially at good prices.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Check Ratings</p>
                <p>Look at seller ratings and reviews before making a purchase.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
