# MU Market - University Marketplace

A Next.js 14 web application for Marwadi University students to buy, sell, and share skills within the university community.

## Features

- **Authentication**: University email-only signup/login (@marwadiuniversity.ac.in)
- **Dashboard**: Browse latest listings with category filters
- **Create Listings**: Add products, services, or skills with image upload
- **Listing Management**: View, edit, and delete your own listings
- **Contact System**: WhatsApp/Email integration for buyer-seller communication
- **Responsive Design**: Mobile-first UI inspired by Facebook Marketplace and Pinterest

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel-ready
- **Styling**: Mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone and Setup

```bash
git clone <your-repo>
cd mu-market
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Schema

1. Go to Supabase Dashboard > SQL Editor
2. Copy and run the SQL from `supabase-schema.sql`
3. This will create:
   - `users` and `listings` tables
   - Row Level Security policies
   - Storage bucket for images
   - Auto-profile creation trigger

### 4. Configure Authentication

1. Go to Authentication > Settings in Supabase Dashboard
2. Set Site URL to `http://localhost:3001` (for development)
3. Add `http://localhost:3001` to redirect URLs
4. Enable email confirmation if desired

### 5. Configure Storage

1. Go to Storage in Supabase Dashboard
2. The `listing-images` bucket should be created by the schema
3. Ensure public access is enabled for the bucket

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication page
│   ├── create/            # Create listing page
│   ├── dashboard/         # Main dashboard
│   ├── listing/[id]/      # Individual listing view
│   ├── my-listings/       # User's listings management
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # Reusable React components
│   ├── Navbar.tsx        # Navigation component
│   └── ListingCard.tsx   # Listing display card
├── lib/                  # Utilities
│   └── supabase.ts       # Supabase client & types
├── public/               # Static assets
├── supabase-schema.sql   # Database schema
└── README.md
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Text, Unique)
- `created_at` (Timestamp)

### Listings Table
- `id` (UUID, Primary Key)
- `title` (Text)
- `description` (Text)
- `category` (Enum: 'product', 'service', 'skill')
- `price` (Numeric)
- `image_url` (Text, Optional)
- `contact_method` (Text)
- `user_id` (Foreign Key)
- `created_at` (Timestamp)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase Site URL to your Vercel domain
5. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

1. **Sign Up**: Use your @marwadiuniversity.ac.in email
2. **Browse**: View listings on the dashboard, filter by category
3. **Create**: Add your own listings with images
4. **Contact**: Click contact buttons to reach sellers via WhatsApp/Email
5. **Manage**: Edit or delete your listings from "My Listings"

## Security Features

- University email domain restriction
- Row Level Security (RLS) on all tables
- User can only edit/delete own listings
- Secure image upload to Supabase Storage

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding Features

- New pages go in `app/` directory
- Reusable components in `components/`
- Database utilities in `lib/supabase.ts`
- Update schema in `supabase-schema.sql`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check Supabase site URL and redirect URLs
2. **Images not uploading**: Verify storage bucket exists and has correct policies
3. **Database errors**: Ensure schema is properly applied
4. **Build failures**: Check all environment variables are set

### Support

For issues specific to your university setup, contact your system administrator.

## License

This project is for educational purposes. See LICENSE file for details.
- **Skill Exchange**: Share knowledge and learn from peers
- **Real-time Communication**: Direct contact via email or WhatsApp

### User Experience
- **Responsive Design**: Mobile-first approach with Pinterest/Facebook Marketplace inspired UI
- **Category Filtering**: Easy browsing by product, service, or skill categories
- **Image Upload**: High-quality image storage via Supabase
- **Personal Dashboard**: Manage your listings with edit/delete functionality
- **Secure Payments**: Price display in INR with clear contact methods

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel (recommended)
- **Language**: TypeScript

## 📁 Project Structure

```
mu-market/
├── app/
│   ├── auth/
│   │   └── page.tsx          # Login/Register page
│   ├── create/
│   │   └── page.tsx          # Create listing form
│   ├── dashboard/
│   │   └── page.tsx          # Main marketplace view
│   ├── listing/
│   │   └── [id]/
│   │       └── page.tsx      # Individual listing details
│   ├── my-listings/
│   │   └── page.tsx          # User's listings management
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ListingCard.tsx       # Reusable listing card component
│   └── Navbar.tsx            # Navigation component
├── lib/
│   └── supabase.ts           # Supabase client and types
├── supabase-schema.sql       # Database schema
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account for deployment (optional)

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd mu-market

# Install dependencies
npm install
```

### 2. Set up Supabase

1. **Create a new Supabase project**: Visit [supabase.com](https://supabase.com) and create a new project

2. **Set up the database**: 
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL commands

3. **Configure Storage**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `listing-images`
   - Make it public
   - The SQL schema already includes the necessary policies

4. **Get your credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon public key

### 3. Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Update Configuration

Update `next.config.js` with your Supabase domain:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project-ref.supabase.co'], // Replace with your actual Supabase project reference
  },
}

module.exports = nextConfig
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running!

## 🗄 Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Listings Table
```sql
listings (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category ENUM('product', 'service', 'skill'),
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  contact_method TEXT NOT NULL,
  user_id UUID FOREIGN KEY,
  created_at TIMESTAMP DEFAULT NOW()
)
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Email Domain Restriction**: Only @marwadiuniversity.ac.in emails accepted
- **Authenticated Routes**: Protected dashboard and listing management
- **User-based Access Control**: Users can only edit/delete their own listings
- **Secure Image Storage**: Supabase storage with proper access policies

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**: Make sure your code is in a GitHub repository

2. **Connect Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - In your Vercel dashboard, go to Settings > Environment Variables
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**: Click "Deploy" and your app will be live!

### Alternative Deployment Options
- **Netlify**: Similar process, drag and drop or GitHub integration
- **Railway**: Full-stack deployment with database
- **DigitalOcean App Platform**: Scalable cloud deployment

## 🎨 Customization

### Branding
- Update the app name in `app/layout.tsx`
- Modify colors in `tailwind.config.ts`
- Replace the logo/branding in `components/Navbar.tsx`

### University Domain
- Change the email domain restriction in `app/auth/page.tsx`:
  ```typescript
  const validateEmail = (email: string) => {
    return email.endsWith('@youruniversity.edu') // Update this
  }
  ```

### Categories
- Modify available categories in the database schema
- Update the category options in `app/create/page.tsx` and `app/dashboard/page.tsx`

## 🐛 Common Issues & Solutions

### Build Errors
- **Module not found errors**: Run `npm install` to ensure all dependencies are installed
- **TypeScript errors**: Check that all required environment variables are set

### Supabase Issues
- **"relation does not exist"**: Make sure you've run the SQL schema in your Supabase project
- **RLS policy errors**: Verify that Row Level Security policies are properly set up
- **Storage upload fails**: Check that the `listing-images` bucket exists and is public

### Authentication Issues
- **Email not accepted**: Verify the email domain validation logic
- **Redirect loops**: Check that your Supabase URL and keys are correct in `.env.local`

## 🔄 Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Develop and test locally
3. Update database schema if needed
4. Test with different user roles
5. Create pull request

### Database Migrations
- Add new SQL commands to `supabase-schema.sql`
- Document changes in this README
- Test migration on a staging environment first

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check this README first
2. Search existing GitHub issues
3. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core marketplace functionality
- ✅ User authentication
- ✅ Listing management
- ✅ Image upload

### Phase 2 (Future)
- 🔄 In-app messaging system
- 🔄 Advanced search and filters
- 🔄 User ratings and reviews
- 🔄 Push notifications

### Phase 3 (Future)
- 🔄 Mobile app (React Native)
- 🔄 Payment integration
- 🔄 Advanced analytics
- 🔄 Admin dashboard

---

**Made with ❤️ for Marwadi University Students**

*This project demonstrates modern web development practices with a focus on security, user experience, and scalability.*
