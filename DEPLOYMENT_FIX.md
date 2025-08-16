# Fix Email Confirmation Redirect Issue

## Problem
Email confirmation links redirect to localhost instead of your Vercel domain in production.

## Root Cause
Supabase needs to be configured with your production domain URLs to properly handle email redirects.

## Complete Solution

### Step 1: Update Environment Variables

1. **Local Development (.env.local)**
   - Already updated with `NEXT_PUBLIC_SITE_URL` variable
   - Replace `https://your-app-name.vercel.app` with your actual Vercel domain

2. **Vercel Production Environment**
   - Go to your Vercel dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_SITE_URL` = `https://your-actual-domain.vercel.app`

### Step 2: Configure Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/mwbbjubqxdwksxhzeqxh

2. **Update Authentication Settings**
   - Go to Authentication → Settings → URL Configuration
   - Update the following sections:

   **Site URL:**
   ```
   https://your-app-name.vercel.app
   ```

   **Redirect URLs (add these):**
   ```
   https://your-app-name.vercel.app
   https://your-app-name.vercel.app/
   https://your-app-name.vercel.app/dashboard
   https://your-app-name.vercel.app/auth
   ```

   **For development, also add:**
   ```
   http://localhost:3000
   http://localhost:3000/
   http://localhost:3000/dashboard
   http://localhost:3000/auth
   ```

### Step 3: Code Changes (Already Applied)

✅ Updated `app/auth/page.tsx` to use environment variable for redirect URL
✅ Added fallback to `window.location.origin` for development

### Step 4: Deploy and Test

1. **Update your .env.local**
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-actual-domain.vercel.app
   ```

2. **Redeploy to Vercel**
   ```bash
   git add .
   git commit -m "Fix email confirmation redirects for production"
   git push
   ```

3. **Add Environment Variable in Vercel**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `NEXT_PUBLIC_SITE_URL` with your domain

4. **Test the Flow**
   - Try signing up with a new account
   - Check that email confirmation link points to your Vercel domain
   - Verify redirect after email confirmation works

## Verification Checklist

- [ ] Updated `.env.local` with correct Vercel domain
- [ ] Added `NEXT_PUBLIC_SITE_URL` environment variable in Vercel
- [ ] Configured Supabase Site URL
- [ ] Added all necessary redirect URLs in Supabase
- [ ] Redeployed application
- [ ] Tested email signup flow in production

## Important Notes

- Replace `your-app-name.vercel.app` with your actual Vercel domain
- Make sure all URLs use `https://` (not `http://`)
- Changes in Supabase take effect immediately
- Vercel environment variables require redeployment

## Troubleshooting

If issues persist:
1. Check Vercel logs for environment variable issues
2. Verify Supabase project URL in dashboard matches .env
3. Ensure email domain validation (@marwadiuniversity.ac.in) is working
4. Test with incognito/private browser window
