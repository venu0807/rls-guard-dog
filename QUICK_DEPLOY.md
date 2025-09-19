# 🚀 RLS Guard Dog - Quick Deployment Guide

## 📋 **Pre-Deployment Checklist**

✅ **Complete Application Built**
- Next.js 15 with TypeScript and App Router
- Supabase authentication with Row-Level Security
- MongoDB integration via Edge Functions
- Teacher portal with CRUD operations
- Student dashboard with progress tracking
- Role-based access control system

## 🌐 **1. Deploy to Vercel (Recommended)**

### Step 1: Push to GitHub
```bash
# If you haven't already, create a GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/rls-guard-dog.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `rls-guard-dog`
4. Configure environment variables (see below)
5. Click "Deploy"

### Step 3: Set Environment Variables in Vercel
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=rls_guard_dog
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_random_secret_string
```

## 🗄️ **2. Set Up Supabase Database**

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### Step 2: Run Database Schema
1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste contents of `database/schema.sql`
3. Run the script
4. Copy and paste contents of `database/rls-policies.sql`
5. Run the RLS policies script

### Step 3: Configure Authentication
1. Go to Authentication > Settings
2. Add your Vercel domain to "Site URL" and "Redirect URLs"
3. Enable Email authentication

## 🍃 **3. Set Up MongoDB (Optional)**

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string

### Step 2: Deploy Edge Function
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set MONGODB_URI=your_mongodb_uri
supabase secrets set MONGODB_DB_NAME=rls_guard_dog

# Deploy edge function
supabase functions deploy calculate-class-stats
```

## 🧪 **4. Test Your Deployment**

### Test Authentication
1. Visit your deployed URL
2. Sign up as different user roles:
   - Student
   - Teacher  
   - Head Teacher
3. Verify role-based access control

### Test Teacher Portal
1. Login as teacher
2. Create classrooms
3. Add student progress entries
4. Verify RLS policies work correctly

## 🔗 **Expected Live URLs**

After deployment, you'll have:
- **Main App**: `https://your-app.vercel.app`
- **Supabase Database**: `https://your-project.supabase.co`
- **MongoDB Analytics**: Connected via Edge Functions

## 🎯 **Features Available**

✅ **Authentication System**
- Email/password authentication
- Role-based access (student/teacher/head_teacher)
- Secure session management

✅ **Teacher Portal**
- Classroom management
- Student progress tracking
- CRUD operations with forms
- Real-time data updates

✅ **Student Dashboard**
- View personal progress
- See enrolled classes
- Progress history

✅ **Security Features**
- Row-Level Security policies
- Students see only their data
- Teachers see their classes only
- Head teachers see full school data

## 🆘 **Troubleshooting**

### Common Issues
1. **Build Errors**: Check all environment variables are set
2. **Database Connection**: Verify Supabase URL and keys
3. **Authentication Issues**: Check redirect URLs in Supabase
4. **RLS Policy Errors**: Ensure all SQL scripts ran successfully

### Support
- Check the main README.md for detailed documentation
- Review DEPLOYMENT.md for comprehensive deployment guide
- Verify all environment variables match your services

---

**🎉 Your RLS Guard Dog classroom management system is ready for production!**