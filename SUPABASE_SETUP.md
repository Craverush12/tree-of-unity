# Supabase Setup Guide for Tree of Unity

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `tree-of-unity`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
6. Click "Create new project"
7. Wait for the project to be set up (2-3 minutes)

## 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## 3. Update Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to execute the SQL

## 5. Enable Real-time

1. Go to **Database** → **Replication**
2. Find the `leaves` table
3. Toggle **Enable real-time** to ON

## 6. Set Up Row Level Security (RLS)

The SQL schema already includes RLS policies, but verify they're active:

1. Go to **Authentication** → **Policies**
2. Ensure the `leaves` table has these policies:
   - `Allow public read access` (SELECT)
   - `Allow public insert access` (INSERT)

## 7. Test the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/tree` page
3. Try adding a leaf - it should save to the database
4. Open the tree page in another browser tab
5. Add a leaf from the form page - it should appear on the tree page in real-time

## 8. Database Schema Details

The `leaves` table contains:
- `id`: UUID primary key
- `name`: User's name (TEXT)
- `city`: User's city (TEXT)
- `x`: X coordinate (INTEGER)
- `y`: Y coordinate (INTEGER)
- `angle`: Rotation angle (INTEGER)
- `scale`: Leaf scale (DECIMAL)
- `leaf_type`: Template type ('leaf1' or 'leaf2')
- `created_at`: Timestamp

## 9. Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check your environment variables
2. **"Table doesn't exist"**: Run the SQL schema again
3. **Real-time not working**: Check if real-time is enabled for the table
4. **CORS errors**: Ensure your domain is added to allowed origins in Supabase settings

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test database connection in Supabase dashboard
4. Check real-time logs in Supabase dashboard

## 10. Production Deployment

For production:

1. Update environment variables in your hosting platform
2. Add your domain to Supabase allowed origins
3. Consider setting up proper RLS policies for security
4. Monitor usage and upgrade plan if needed

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the browser console for errors
3. Test the database connection in Supabase dashboard
4. Verify all environment variables are correctly set
