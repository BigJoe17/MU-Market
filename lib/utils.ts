import { supabase } from './supabase'
import { User, Listing, Favorite, Rating, ChatConversation, ChatMessage, Notification } from './types'

// Helper function to ensure user exists in public.users table
export async function ensureUserExists(userId: string, userEmail?: string): Promise<boolean> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existingUser) {
      return true
    }

    // User doesn't exist, try to create them
    const { data: authUser } = await supabase.auth.getUser()
    const email = userEmail || authUser.user?.email || `${userId}@marwadiuniversity.ac.in`

    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        created_at: new Date().toISOString(),
        is_premium: false,
        total_sales: 0,
        rating_average: 0.00,
        rating_count: 0,
        last_active: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error creating user:', insertError)
      return false
    }

    return true
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    return false
  }
}

// User Profile Functions
export async function getUserProfile(userId: string): Promise<User | null> {
  // Ensure user exists first
  await ensureUserExists(userId)

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  // Ensure user exists first
  await ensureUserExists(userId)

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Favorites Functions
export async function toggleFavorite(listingId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)

    if (error) throw error
    return false
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, listing_id: listingId })

    if (error) throw error
    return true
  }
}

export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      listing:listings(
        *,
        user:users(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return data || []
}

export async function isListingFavorited(listingId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .single()

  return !!data
}

// Rating Functions
export async function addRating(sellerId: string, rating: number, review?: string, listingId?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('ratings')
    .insert({
      reviewer_id: user.id,
      seller_id: sellerId,
      listing_id: listingId,
      rating,
      review
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserRatings(sellerId: string): Promise<Rating[]> {
  const { data, error } = await supabase
    .from('ratings')
    .select(`
      *,
      reviewer:users(*),
      listing:listings(*)
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching ratings:', error)
    return []
  }

  return data || []
}

// Chat Functions
export async function createConversation(buyerId: string, sellerId: string, listingId: string): Promise<ChatConversation> {
  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    return existing
  }

  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      listing_id: listingId
    })
    .select(`
      *,
      buyer:users(*),
      seller:users(*),
      listing:listings(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getUserConversations(userId: string): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select(`
      *,
      buyer:users(*),
      seller:users(*),
      listing:listings(*)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

export async function sendMessage(conversationId: string, message: string): Promise<ChatMessage> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message
    })
    .select(`
      *,
      sender:users(*)
    `)
    .single()

  if (error) throw error
  return data
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      sender:users(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)

  if (error) {
    console.error('Error marking messages as read:', error)
  }
}

// Analytics Functions
export async function recordListingView(listingId: string, ipAddress?: string, userAgent?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('listing_views')
    .insert({
      listing_id: listingId,
      viewer_id: user?.id,
      ip_address: ipAddress,
      user_agent: userAgent
    })

  if (error) {
    console.error('Error recording listing view:', error)
  }
}

export async function getListingAnalytics(listingId: string) {
  const [viewsResult, favoritesResult] = await Promise.all([
    supabase
      .from('listing_views')
      .select('created_at')
      .eq('listing_id', listingId),
    supabase
      .from('favorites')
      .select('created_at')
      .eq('listing_id', listingId)
  ])

  return {
    totalViews: viewsResult.data?.length || 0,
    totalFavorites: favoritesResult.data?.length || 0,
    viewsData: viewsResult.data || [],
    favoritesData: favoritesResult.data || []
  }
}

// Notification Functions
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Error marking notification as read:', error)
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Error fetching unread notification count:', error)
    return 0
  }

  return count || 0
}

export async function createNotification(
  userId: string, 
  type: 'message' | 'rating' | 'sale' | 'feature_expiry' | 'listing_interest' | 'price_drop' | 'new_listing',
  title: string,
  message: string,
  relatedId?: string
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      related_id: relatedId
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw error
  }

  return data
}

// Helper functions for specific notification types
export async function notifyNewMessage(recipientId: string, senderName: string, listingTitle: string, conversationId: string) {
  return createNotification(
    recipientId,
    'message',
    'New Message',
    `${senderName} sent you a message about "${listingTitle}"`,
    conversationId
  )
}

export async function notifyNewRating(sellerId: string, rating: number, review: string, listingId: string) {
  return createNotification(
    sellerId,
    'rating',
    'New Rating',
    `You received a ${rating}-star rating${review ? `: "${review}"` : ''}`,
    listingId
  )
}

export async function notifyListingSold(sellerId: string, listingTitle: string, listingId: string) {
  return createNotification(
    sellerId,
    'sale',
    'Item Sold!',
    `Congratulations! Your listing "${listingTitle}" has been marked as sold.`,
    listingId
  )
}

export async function notifyListingInterest(sellerId: string, interestedUserName: string, listingTitle: string, listingId: string) {
  return createNotification(
    sellerId,
    'listing_interest',
    'Someone is interested in your listing',
    `${interestedUserName} showed interest in "${listingTitle}"`,
    listingId
  )
}

export async function notifyPriceDrop(followerId: string, listingTitle: string, oldPrice: number, newPrice: number, listingId: string) {
  return createNotification(
    followerId,
    'price_drop',
    'Price Drop Alert',
    `"${listingTitle}" price dropped from ₹${oldPrice} to ₹${newPrice}`,
    listingId
  )
}

export async function notifyNewListing(userId: string, category: string, listingTitle: string, listingId: string) {
  return createNotification(
    userId,
    'new_listing',
    'New Listing in Your Interest',
    `A new ${category} listing "${listingTitle}" might interest you`,
    listingId
  )
}

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    console.error('Error deleting notification:', error)
  }
}

// Premium Features
export async function markListingAsFeatured(listingId: string, durationDays: number = 7) {
  const featuredUntil = new Date()
  featuredUntil.setDate(featuredUntil.getDate() + durationDays)

  const { data, error } = await supabase
    .from('listings')
    .update({
      is_featured: true,
      featured_until: featuredUntil.toISOString()
    })
    .eq('id', listingId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function upgradeToPremium(userId: string, durationMonths: number = 1) {
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths)

  const { data, error } = await supabase
    .from('users')
    .update({
      is_premium: true,
      premium_expires_at: expiresAt.toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Image Upload Helper
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/profile.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(fileName, file, { upsert: true })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('profiles')
    .getPublicUrl(fileName)

  return data.publicUrl
}
