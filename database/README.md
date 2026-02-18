# Database Schema Documentation

This directory contains SQL scripts for setting up the Alpha Oracle 2.0 database on Supabase.

## Files

- **schema.sql** - Complete database schema with all tables, indexes, and triggers
- **rls-policies.sql** - Row-Level Security policies for data access control
- **seed-data.sql** - Demo data for development and testing

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Save your project URL and API keys

### 2. Run Schema Scripts

In the Supabase SQL Editor, run scripts in this order:

```sql
-- 1. Create schema
\i schema.sql

-- 2. Configure RLS policies
\i rls-policies.sql

-- 3. Seed demo data (optional, for development)
\i seed-data.sql
```

### 3. Verify Setup

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check data
SELECT COUNT(*) FROM sectors;
SELECT COUNT(*) FROM recommendations;
SELECT COUNT(*) FROM economic_indicators;
```

## Schema Overview

### Core Tables

- **sectors** - Market sectors with conviction scores and analysis
- **recommendations** - Stock recommendations with ratings and theses
- **economic_indicators** - Economic data points (GDP, inflation, etc.)
- **market_data** - Current market prices and metrics
- **geopolitical_risks** - Risk events and their sector impacts

### User Tables (Auth Required)

- **portfolios** - User portfolio configurations
- **portfolio_positions** - Individual stock positions in portfolios

## Security

Row-Level Security is enabled on all tables:

- Public tables (sectors, recommendations, etc.) allow read access for all users
- Portfolio tables restrict access to the authenticated user who owns them

## Environment Variables

Add these to your `.env` file:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key  # Backend only!
```

## Maintenance

### Backup

Supabase provides automatic backups. To create manual backup:

```bash
pg_dump -h db.your-project.supabase.co -U postgres > backup.sql
```

### Migrations

For schema changes:

1. Create new migration SQL file
2. Test in staging environment
3. Apply to production
4. Update schema.sql for reference

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
