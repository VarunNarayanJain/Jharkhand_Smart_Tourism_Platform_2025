# Supabase Setup Guide for Jharkhand Tourism

## Step 1: Create Supabase Account
1. Go to https://supabase.com/
2. Sign up for a free account
3. Create a new project

## Step 2: Set Up Database
1. In your Supabase dashboard, go to "SQL Editor"
2. Copy and paste the content from `database/schema.sql`
3. Run the SQL script to create all tables and triggers

## Step 3: Insert Sample Data
1. In the SQL Editor, copy and paste the content from `database/seed_data.sql`
2. Run the script to insert all the sample data

## Step 4: Get API Keys
1. Go to "Settings" > "API" in your Supabase dashboard
2. Copy your Project URL and anon public key
3. Add them to your `.env` file:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Configure Row Level Security (Optional but Recommended)
For user authentication and data security, you can set up Row Level Security:

1. Go to "Authentication" > "Policies"
2. Enable RLS on tables that need user-specific access
3. Create policies for different user roles

## Database Tables Created:
- ✅ destinations (tourism destinations)
- ✅ user_profiles (user information)
- ✅ itineraries (trip plans)
- ✅ marketplace_items (artisan products)
- ✅ cultural_events (festivals and events)
- ✅ guides (tour guides)
- ✅ reviews (destination reviews)
- ✅ bookings (guide/homestay bookings)
- ✅ wishlists (saved destinations)
- ✅ analytics (platform statistics)

## Features Implemented:
- Automatic timestamps (created_at, updated_at)
- Foreign key relationships
- Indexes for performance
- Data validation constraints
- Support for arrays (PostgreSQL feature)

## Next Steps:
1. Test the connection by running: npm run dev
2. Check if destinations load on the homepage
3. Gradually migrate other components to use Supabase
4. Add user authentication when ready