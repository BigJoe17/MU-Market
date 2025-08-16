'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/lib/types'
import FavoriteButton from './FavoriteButton'
import ChatComponent from './ChatComponent'
import { Eye, MessageCircle, Star, MapPin, Award } from 'lucide-react'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export default function EnhancedListingCard({ listing, className = '' }: ListingCardProps) {
  const [showChat, setShowChat] = useState(false)

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

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    return `₹${price.toLocaleString()}`
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const created = new Date(date)
    const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`
    return created.toLocaleDateString()
  }

  return (
    <>
      <div className={`group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
        {/* Featured Badge */}
        {listing.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              FEATURED
            </div>
          </div>
        )}

        {/* Sold Badge */}
        {listing.is_sold && (
          <div className="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-lg">
              SOLD
            </div>
          </div>
        )}

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
            
            {/* Favorite Button */}
            <div className="absolute top-3 right-3">
              <FavoriteButton 
                listingId={listing.id} 
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all"
                showCount={false}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category & Time */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(listing.category)}`}>
                {listing.category.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{timeAgo(listing.created_at)}</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {listing.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {listing.description}
            </p>

            {/* Price */}
            <div className="mb-3">
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(listing.price)}
              </span>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {listing.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {listing.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{listing.tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Location */}
            {listing.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Footer */}
        <div className="px-4 pb-4">
          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {listing.user?.profile_image_url ? (
                <Image
                  src={listing.user.profile_image_url}
                  alt={listing.user.email || 'User'}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {listing.user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {listing.user?.email?.split('@')[0] || 'Unknown'}
                </span>
                {listing.user?.rating_count && listing.user.rating_count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {listing.user.rating_average} ({listing.user.rating_count})
                    </span>
                  </div>
                )}
              </div>
              {listing.user?.is_premium && (
                <div className="ml-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Stats */}
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{listing.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FavoriteButton 
                    listingId={listing.id} 
                    showCount={true} 
                    count={listing.favorites_count || 0}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setShowChat(true)
                }}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                title="Start chat"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {listing.user && (
        <ChatComponent
          sellerId={listing.user.id}
          listingId={listing.id}
          listingTitle={listing.title}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  )
}
