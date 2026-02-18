# Supabase Setup Guide

This guide walks you through setting up Supabase projects for Alpha Oracle 2.0.

## Prerequisites

- A Supabase account (https://supabase.com)
- Access to the database schema files in the `database/` directory

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email

## Step 2: Create Production Project

1. Click "New Project" in the Supabase dashboard
2. Fill in project details:
   - **Organization**: Select or create an organization
   - **Project Name**: `alpha-oracle-prod`
   - **Database Password**: Generate a strong password (save this securely!)
   - **Region**: Choose the region closest to your users (e.g., `us-east-1` for US East Coast)
   - **Pricing Plan**: Start with Free tier
3. Click "Create new project"
4. Wait 2-3 minutes for project initialization

## Step 3: Create Staging Project

Repeat Step 2 with these changes:
- **Project Name**: `alpha-oracle-staging`
- **Region**: Same as production for consistency

## Step 4: Save Project Credentials

For each project (production and staging):

1. Go to **Project Settings** → **API**
2. Copy and save these values securely:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys**:
     - `anon` key (public): Safe to use in frontend
     - `service_role` key (secret): Use ONLY in backend, never expose!

### Recommended: Use a Password Manager

Store credentials in 1Password, LastPass, or similar.

## Step 5: Configure Environment Variables

### Backend (.env)

Create `backend-ts/.env`:

```bash
# Supabase - Production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# External APIs (optional)
ALPHA_VANTAGE_API_KEY=your_key
FRED_API_KEY=your_key

# Server
PORT=8000
NODE_ENV=production
```

### Frontend (.env)

Create `frontend/.env`:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Only use the `anon` key in frontend. Never use `service_role` key in client-side code!

## Step 6: Set Up Database Schema

1. Open **SQL Editor** in Supabase dashboard
2. Run scripts in order:

### a) Create Schema

Copy contents of `database/schema.sql` and run in SQL Editor.

### b) Configure Security

Copy contents of `database/rls-policies.sql` and run in SQL Editor.

### c) Seed Demo Data (Optional)

Copy contents of `database/seed-data.sql` and run in SQL Editor.

## Step 7: Verify Setup

Run these queries in SQL Editor to verify:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check data was seeded
SELECT COUNT(*) as sector_count FROM sectors;
SELECT COUNT(*) as recommendation_count FROM recommendations;
```

## Security Checklist

- [ ] Database password is strong and stored securely
- [ ] Service role key is NEVER committed to git
- [ ] Service role key is ONLY used in backend
- [ ] RLS policies are enabled on all tables
- [ ] .env files are in .gitignore

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
