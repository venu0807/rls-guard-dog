# Demo Mode Configuration

This application includes a demo mode fallback for when Supabase credentials are not configured.

## What was Fixed

The original error occurred because the application was trying to create a Supabase client with placeholder environment variables:

```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

## Solution Implemented

1. **Fallback Mechanism**: Modified both client and server Supabase clients to detect placeholder values and return mock clients instead of throwing errors.

2. **Demo Profile**: When running in demo mode, the application returns a mock user profile with the following details:
   - Name: "Demo User"
   - Email: "demo@example.com" 
   - Role: "student"
   - School ID: "demo-school-id"

3. **Visual Indicator**: Added a demo mode notice banner on the homepage to inform users when running without proper Supabase configuration.

## Environment Variables for Demo Mode

The `.env.local` file now contains demo-safe placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=demo_mode_no_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_mode_no_supabase_key
```

## To Enable Full Functionality

Replace the demo values in `.env.local` with actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
```

## Files Modified

- `src/lib/supabase/server.ts` - Added demo mode detection and mock client
- `src/lib/supabase/client.ts` - Added demo mode detection and mock client  
- `src/lib/auth.ts` - Added mock profile generation for demo mode
- `src/app/page.tsx` - Added demo mode notice banner
- `.env.local` - Updated with demo-safe placeholder values