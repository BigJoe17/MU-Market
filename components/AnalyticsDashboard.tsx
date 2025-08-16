'use client'

import { useState, useEffect } from 'react'
import { getListingAnalytics } from '@/lib/utils'
import { Eye, Heart, TrendingUp, Users } from 'lucide-react'

interface AnalyticsDashboardProps {
  listingId: string
  className?: string
}

export default function AnalyticsDashboard({ listingId, className = '' }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<{
    totalViews: number
    totalFavorites: number
    viewsData: any[]
    favoritesData: any[]
  }>({
    totalViews: 0,
    totalFavorites: 0,
    viewsData: [],
    favoritesData: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [listingId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getListingAnalytics(listingId)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getViewsByDay = () => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const viewsCount = analytics.viewsData.filter((view: any) => 
        view.created_at.startsWith(dateString)
      ).length
      
      last7Days.push({
        date: date.toLocaleDateString([], { weekday: 'short' }),
        views: viewsCount
      })
    }
    
    return last7Days
  }

  const getEngagementRate = () => {
    if (analytics.totalViews === 0) return 0
    return ((analytics.totalFavorites / analytics.totalViews) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const dailyViews = getViewsByDay()
  const maxViews = Math.max(...dailyViews.map(d => d.views))

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {analytics.totalViews}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Favorites</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {analytics.totalFavorites}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Engagement</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {getEngagementRate()}%
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Interest</span>
          </div>
          <div className="text-lg font-bold text-purple-600">
            {analytics.totalViews > 0 ? 'High' : 'Low'}
          </div>
        </div>
      </div>

      {/* Daily Views Chart */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Daily Views</h4>
        <div className="flex items-end gap-2 h-24">
          {dailyViews.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '60px' }}>
                {day.views > 0 && (
                  <div 
                    className="bg-indigo-500 rounded-t absolute bottom-0 w-full transition-all duration-300"
                    style={{ 
                      height: `${maxViews > 0 ? (day.views / maxViews) * 100 : 0}%`,
                      minHeight: day.views > 0 ? '4px' : '0'
                    }}
                  ></div>
                )}
                {day.views > 0 && (
                  <div className="absolute -top-6 w-full text-center">
                    <span className="text-xs text-gray-600 bg-white px-1 rounded">
                      {day.views}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Tips to increase visibility:</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Add high-quality images</li>
          <li>• Write detailed descriptions</li>
          <li>• Use relevant tags</li>
          <li>• Consider premium features</li>
        </ul>
      </div>
    </div>
  )
}
