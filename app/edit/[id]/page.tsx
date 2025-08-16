'use client'

import { useState, useEffect } from 'react'
import { supabase, type Listing } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function EditListing() {
  const [user, setUser] = useState<any>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'product' as 'product' | 'service' | 'skill',
    price: '',
    contact_method: '',
    image_url: ''
  })
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user && listingId) {
      fetchListing()
    }
  }, [user, listingId])

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
        .select('*')
        .eq('id', listingId)
        .eq('user_id', user.id) // Ensure user can only edit their own listings
        .single()

      if (error) {
        console.error('Error fetching listing:', error)
        router.push('/my-listings')
        return
      }

      if (!data) {
        router.push('/my-listings')
        return
      }

      setListing(data)
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price.toString(),
        contact_method: data.contact_method,
        image_url: data.image_url || ''
      })
      setImagePreview(data.image_url || '')
    } catch (error) {
      console.error('Error:', error)
      router.push('/my-listings')
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError('')

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
      setImagePreview(data.publicUrl)
    } catch (error: any) {
      setError('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('listings')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          contact_method: formData.contact_method,
          image_url: formData.image_url || null,
        })
        .eq('id', listingId)
        .eq('user_id', user.id) // Ensure user can only edit their own listings

      if (error) throw error

      router.push('/my-listings')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!listing && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar  />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar  />
      
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
            <p className="mt-2 text-gray-600">Update your listing details</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a catchy title for your listing"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'product' | 'service' | 'skill' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="skill">Skill</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your product, service, or skill in detail"
              />
            </div>

            {/* Contact Method */}
            <div>
              <label htmlFor="contact_method" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Method *
              </label>
              <input
                type="text"
                id="contact_method"
                required
                value={formData.contact_method}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_method: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email, phone, or preferred contact method"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Current listing image"
                    className="w-full max-w-md h-48 object-cover rounded-md border border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">Current image</p>
                </div>
              )}

              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
              )}
              <p className="text-sm text-gray-500 mt-2">Upload a new image to replace the current one</p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? 'Updating...' : 'Update Listing'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/my-listings')}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
