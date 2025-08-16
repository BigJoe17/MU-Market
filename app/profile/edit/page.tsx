'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserProfile, updateUserProfile, uploadProfileImage } from '@/lib/utils'
import { User } from '@/lib/types'
import Image from 'next/image'
import { Camera, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    department: '',
    bio: '',
    profile_image_url: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Business Administration',
    'Commerce',
    'Arts & Humanities',
    'Science',
    'Pharmacy',
    'Architecture',
    'Design',
    'Other'
  ]

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth')
        return
      }

      const userProfile = await getUserProfile(authUser.id)
      if (userProfile) {
        setUser(userProfile)
        setFormData({
          department: userProfile.department || '',
          bio: userProfile.bio || '',
          profile_image_url: userProfile.profile_image_url || ''
        })
        setImagePreview(userProfile.profile_image_url || '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      let profileImageUrl = formData.profile_image_url

      // Upload new image if selected
      if (imageFile) {
        profileImageUrl = await uploadProfileImage(imageFile, user.id)
      }

      // Update profile
      await updateUserProfile(user.id, {
        department: formData.department,
        bio: formData.bio,
        profile_image_url: profileImageUrl
      })

      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      
      // Show more detailed error message for debugging
      let errorMessage = 'Error updating profile. Please try again.'
      
      if (error instanceof Error) {
        // Check for specific database errors
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          errorMessage = 'Database error: Missing profile columns. Please contact administrator to run the enhanced database schema.'
        } else if (error.message.includes('profiles')) {
          errorMessage = 'Storage error: Profile images bucket not configured. Please contact administrator.'
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to edit your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information and photo</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={100}
                      height={100}
                      className="w-25 h-25 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-25 h-25 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-gray-200">
                      <span className="text-2xl font-bold text-white">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Click the camera icon to upload a new photo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or WebP. Max 10MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                maxLength={500}
                placeholder="Tell others about yourself, your interests, or what you're looking to buy/sell..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Premium Status (read-only) */}
            {user.is_premium && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Premium Status
                </label>
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-800 font-medium">Premium Member</span>
                  {user.premium_expires_at && (
                    <span className="text-yellow-600 text-sm">
                      (expires {new Date(user.premium_expires_at).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href="/profile"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
