'use client'

import { type Listing } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter()

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleContactSeller = () => {
    const message = `Hi! I'm interested in your listing: ${listing.title}`
    
    if (listing.contact_method.includes('@')) {
      // Email
      window.open(`mailto:${listing.contact_method}?subject=Interested in ${listing.title}&body=${encodeURIComponent(message)}`)
    } else if (listing.contact_method.includes('whatsapp') || listing.contact_method.match(/^\+?\d+$/)) {
      // WhatsApp or phone number
      const phoneNumber = listing.contact_method.replace(/\D/g, '')
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`)
    } else {
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(listing.contact_method)
      alert('Contact info copied to clipboard: ' + listing.contact_method)
    }
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => router.push(`/listing/${listing.id}`)}
    >
      {/* Image */}
      <div className="aspect-w-16 aspect-h-12 bg-gray-200 relative h-48">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category)}`}>
            {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(listing.price)}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleContactSeller()
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Seller info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By {listing.user?.name || 'Anonymous'}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
