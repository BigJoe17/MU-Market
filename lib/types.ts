export interface User {
  id: string;
  email: string;
  created_at: string;
  department?: string;
  bio?: string;
  profile_image_url?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  total_sales: number;
  rating_average: number;
  rating_count: number;
  last_active: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'product' | 'service' | 'skill';
  price: number;
  image_url?: string;
  contact_method: 'email' | 'phone' | 'both';
  phone?: string;
  created_at: string;
  view_count: number;
  favorites_count: number;
  is_featured: boolean;
  is_sold: boolean;
  tags?: string[];
  location?: string;
  featured_until?: string;
  user?: User;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}

export interface Rating {
  id: string;
  reviewer_id: string;
  seller_id: string;
  listing_id?: string;
  rating: number;
  review?: string;
  created_at: string;
  reviewer?: User;
  listing?: Listing;
}

export interface ChatConversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  last_message_at: string;
  created_at: string;
  buyer?: User;
  seller?: User;
  listing?: Listing;
  unread_count?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'rating' | 'sale' | 'feature_expiry' | 'listing_interest' | 'price_drop' | 'new_listing';
  title: string;
  message: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'premium_upgrade' | 'featured_listing';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_gateway_id?: string;
  created_at: string;
}

export interface ListingView {
  id: string;
  listing_id: string;
  viewer_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
