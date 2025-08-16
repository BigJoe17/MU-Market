-- MU Market Database Functions and Triggers
-- Run these after schema and RLS policies

-- Function to update listing favorites count
CREATE OR REPLACE FUNCTION update_listing_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.listings 
    SET favorites_count = favorites_count + 1 
    WHERE id = NEW.listing_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.listings 
    SET favorites_count = GREATEST(favorites_count - 1, 0) 
    WHERE id = OLD.listing_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user rating average
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users 
    SET 
      rating_average = (
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM public.ratings 
        WHERE seller_id = NEW.seller_id
      ),
      rating_count = (
        SELECT COUNT(*) 
        FROM public.ratings 
        WHERE seller_id = NEW.seller_id
      )
    WHERE id = NEW.seller_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users 
    SET 
      rating_average = COALESCE((
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM public.ratings 
        WHERE seller_id = OLD.seller_id
      ), 0),
      rating_count = (
        SELECT COUNT(*) 
        FROM public.ratings 
        WHERE seller_id = OLD.seller_id
      )
    WHERE id = OLD.seller_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.users 
    SET 
      rating_average = (
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM public.ratings 
        WHERE seller_id = NEW.seller_id
      ),
      rating_count = (
        SELECT COUNT(*) 
        FROM public.ratings 
        WHERE seller_id = NEW.seller_id
      )
    WHERE id = NEW.seller_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update conversation last message time
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations 
  SET last_message_at = NEW.created_at 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  user_id_param UUID,
  type_param TEXT,
  title_param TEXT,
  message_param TEXT,
  related_id_param UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (user_id_param, type_param, title_param, message_param, related_id_param)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment listing view count
CREATE OR REPLACE FUNCTION increment_listing_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.listings 
  SET view_count = view_count + 1 
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user creation with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NOW())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      last_active = NOW();
    
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_favorite_change ON public.favorites;
CREATE TRIGGER on_favorite_change
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION update_listing_favorites_count();

DROP TRIGGER IF EXISTS on_rating_change ON public.ratings;
CREATE TRIGGER on_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

DROP TRIGGER IF EXISTS on_new_message ON public.chat_messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

DROP TRIGGER IF EXISTS on_new_listing_view ON public.listing_views;
CREATE TRIGGER on_new_listing_view
  AFTER INSERT ON public.listing_views
  FOR EACH ROW EXECUTE FUNCTION increment_listing_views();

-- Update the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
