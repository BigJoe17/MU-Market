'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { getUserProfile, getUserRatings, getUserFavorites } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Calendar, Award, Heart, ShoppingBag } from 'lucide-react'

interface UserProfileProps {
  userId: string
  isOwnProfile?: boolean
}

export default function UserProfile({ userId, isOwnProfile = false }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [userListings, setUserListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'favorites'>('listings')

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user profile
      const userProfile = await getUserProfile(userId)
      setUser(userProfile)

      // Load user's listings
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setUserListings(listings || [])

      // Load ratings for this user
      const userRatings = await getUserRatings(userId)
      setRatings(userRatings)

      // Load favorites if it's own profile
      if (isOwnProfile) {
        const userFavorites = await getUserFavorites(userId)
        setFavorites(userFavorites)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-64 mb-6"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-4 rounded w-1/3"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
        <p className="text-gray-600">The user profile you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            {user.profile_image_url ? (
              <Image
                src={user.profile_image_url}
                alt={user.email}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full object-cover border-4 border-indigo-100"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-indigo-100">
                <span className="text-3xl font-bold text-white">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {user.is_premium && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Award className="w-5 h-5 text-yellow-900" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.email.split('@')[0]}
              </h1>
              {user.is_premium && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Premium
                </span>
              )}
            </div>

            {user.department && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user.department}</span>
              </div>
            )}

            {user.bio && (
              <p className="text-gray-700 mb-4">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" />
                <span>{user.total_sales} sales</span>
              </div>

              {user.rating_count > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex">{renderStars(Math.round(user.rating_average))}</div>
                  <span>({user.rating_count} reviews)</span>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <div className="mt-4">
                <Link
                  href="/profile/edit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'listings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Listings ({userListings.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({ratings.length})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favorites ({favorites.length})
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {listing.image_url && (
                      <div className="relative h-48">
                        <Image
                          src={listing.image_url}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                        {listing.is_featured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                            FEATURED
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">₹{listing.price}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{listing.category}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{listing.favorites_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {userListings.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No listings yet</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {rating.reviewer.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium">{rating.reviewer.email.split('@')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                  {rating.review && (
                    <p className="text-gray-700 mb-2">{rating.review}</p>
                  )}
                  {rating.listing && (
                    <div className="text-sm text-gray-500">
                      For: <Link href={`/listing/${rating.listing.id}`} className="text-indigo-600 hover:underline">
                        {rating.listing.title}
                      </Link>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {ratings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Link key={favorite.id} href={`/listing/${favorite.listing.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {favorite.listing.image_url && (
                      <div className="relative h-48">
                        <Image
                          src={favorite.listing.image_url}
                          alt={favorite.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{favorite.listing.title}</h3>
                      <p className="text-2xl font-bold text-indigo-600 mb-2">₹{favorite.listing.price}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{favorite.listing.category}</span>
                        <span>by {favorite.listing.user.email.split('@')[0]}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {favorites.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No favorites yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
