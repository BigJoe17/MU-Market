'use client'

import { useEffect, useState } from 'react'
import { supabase, type Listing } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default function ListingDetail({ params }: Props) {
  const [user, setUser] = useState<any>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchListing()
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }
    setUser(user)
  }

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          notFound()
        }
        throw error
      }

      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleContactSeller = () => {
    if (!listing) return
    
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

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Listing not found</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image */}
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative h-96">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(listing.category)}`}>
                {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {listing.title}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(listing.price)}
                  </span>
                  <span className="text-gray-500">
                    Listed on {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Seller Info & Contact */}
              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">{listing.user?.name || 'Anonymous'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{listing.user?.email}</span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  {listing.user_id !== user.id && (
                    <button
                      onClick={handleContactSeller}
                      className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Contact Seller
                    </button>
                  )}

                  {/* Edit/Delete for own listings */}
                  {listing.user_id === user.id && (
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => router.push(`/edit/${listing.id}`)}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        Edit Listing
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this listing?')) {
                            supabase.from('listings').delete().eq('id', listing.id).then(() => {
                              router.push('/my-listings')
                            })
                          }
                        }}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Delete Listing
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
