# Deployment Guide for RLS Guard Dog

This guide walks you through deploying the RLS Guard Dog classroom management system to production.

## 🌐 Live Deployment Steps

### 1. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Run Database Schema**
   ```sql
   -- Copy and paste the contents of database/schema.sql in Supabase SQL editor
   -- Then run database/rls-policies.sql
   ```

3. **Configure Authentication**
   - Enable email authentication in Supabase Auth settings
   - Set up redirect URLs for your production domain

### 2. MongoDB Setup (Optional)

1. **Create MongoDB Atlas Cluster**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Configure Network Access**
   - Allow access from anywhere (0.0.0.0/0) for Vercel
   - Or add Vercel's IP ranges

### 3. Vercel Deployment

1. **Prepare Repository**
   ```bash
   # Initialize git repository in the project folder
   cd rls-guard-dog
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   git remote add origin https://github.com/yourusername/rls-guard-dog.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy

3. **Environment Variables**
   
   Set these in your Vercel dashboard:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DB_NAME=rls_guard_dog
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your_random_secret_string
   ```

### 4. Edge Function Deployment

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Deploy Edge Function**
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   supabase functions deploy calculate-class-stats --project-ref your-project-ref
   ```

3. **Set Edge Function Environment Variables**
   ```bash
   supabase secrets set MONGODB_URI=your_mongodb_uri --project-ref your-project-ref
   supabase secrets set MONGODB_DB_NAME=rls_guard_dog --project-ref your-project-ref
   ```

## 🧪 Testing Your Deployment

### 1. Basic Functionality Test
1. Visit your deployed URL
2. Sign up as a new user
3. Try different roles (student, teacher, head_teacher)
4. Create classrooms and add progress entries

### 2. RLS Policy Testing
1. Create multiple users with different roles
2. Verify data isolation between schools
3. Test that students can only see their own data
4. Test that teachers can only access their classes

### 3. Edge Function Testing
```bash
# Test the edge function
curl -X POST 'https://your-project.supabase.co/functions/v1/calculate-class-stats' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"classroom_id": "uuid", "school_id": "uuid"}'
```

## 🔧 Production Configuration

### Security Checklist
- [ ] RLS policies are enabled on all tables
- [ ] Service role key is kept secure
- [ ] MongoDB connection uses authentication
- [ ] HTTPS is enforced
- [ ] Environment variables are properly set

### Performance Optimization
- [ ] Database indexes are created
- [ ] Images are optimized
- [ ] Caching is configured
- [ ] Edge functions are deployed to appropriate regions

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Environment Variables Missing**
   - Double-check all required environment variables
   - Ensure no typos in variable names
   - Redeploy after adding missing variables

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are properly applied
   - Ensure database schema is completely migrated

3. **Authentication Problems**
   - Verify redirect URLs in Supabase Auth settings
   - Check NEXTAUTH_URL matches your domain
   - Clear browser cache and cookies

4. **Edge Function Errors**
   - Check function logs in Supabase dashboard
   - Verify MongoDB connection string
   - Ensure environment variables are set for edge functions

### Monitoring

1. **Supabase Dashboard**
   - Monitor database performance
   - Check authentication metrics
   - Review edge function logs

2. **Vercel Analytics**
   - Monitor application performance
   - Check error rates
   - Review deployment logs

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Vercel will automatically redeploy
# Or manually trigger deployment in Vercel dashboard
```

### Database Migrations
```sql
-- Run any new migrations in Supabase SQL editor
-- Update RLS policies if needed
-- Test thoroughly in staging first
```

### Backup Strategy
1. **Database Backups**: Supabase provides automated backups
2. **Code Backups**: GitHub repository serves as code backup
3. **Environment Variables**: Keep secure copies of all environment variables

## 📊 Monitoring and Analytics

### Key Metrics to Monitor
- User registration and authentication rates
- Database query performance
- Edge function execution times
- Application error rates
- Security events and policy violations

### Recommended Tools
- Supabase built-in analytics
- Vercel Analytics
- MongoDB Atlas monitoring
- Custom logging for business metrics

---

Your RLS Guard Dog classroom management system is now ready for production use! 🎉