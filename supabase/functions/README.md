# Supabase Edge Functions

This directory contains Supabase Edge Functions that run in the Deno runtime environment.

## Important Note about TypeScript Errors

The TypeScript files in this directory are designed to run in **Deno**, not Node.js. Your IDE may show TypeScript errors because it's trying to validate these files against Node.js types. These errors are **expected and normal** for Supabase Edge Functions.

## Edge Functions Included

### calculate-class-stats
Calculates class statistics and saves them to MongoDB for advanced analytics.

**Functionality:**
- Fetches student progress data from Supabase
- Calculates class averages, assignment statistics, and student performance metrics
- Saves detailed analytics to MongoDB
- Returns comprehensive statistics for the classroom

**Usage:**
```bash
# Deploy the function
supabase functions deploy calculate-class-stats

# Test the function
curl -X POST 'https://your-project.supabase.co/functions/v1/calculate-class-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"classroom_id": "uuid", "school_id": "uuid"}'
```

## Deployment

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login and link your project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. Set environment variables:
   ```bash
   supabase secrets set MONGODB_URI=your_mongodb_uri
   supabase secrets set MONGODB_DB_NAME=rls_guard_dog
   ```

4. Deploy functions:
   ```bash
   supabase functions deploy calculate-class-stats
   ```

## Environment Variables

The Edge Functions require these environment variables to be set in Supabase:

- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: MongoDB database name (default: rls_guard_dog)

These are automatically available from Supabase:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access