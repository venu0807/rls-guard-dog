# RLS Guard Dog - Classroom Management System

A comprehensive full-stack classroom management system built with Next.js 15, Supabase with Row-Level Security, and MongoDB integration.

## 🚀 Features

- **Secure Authentication**: Supabase Auth with role-based access control
- **Row-Level Security**: Students see only their data, teachers manage their classes, head teachers oversee schools
- **Real-time Data**: Live updates using Supabase real-time subscriptions
- **MongoDB Analytics**: Edge functions for advanced statistics and analytics
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: React Hook Form with Zod schema validation

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Edge Functions)
- **Analytics**: MongoDB for complex data aggregation
- **Deployment**: Vercel
- **Validation**: Zod + React Hook Form
- **UI Components**: Custom components with Radix UI primitives

### Database Schema
- **Schools**: Organization-level data
- **Profiles**: User profiles extending Supabase auth
- **Classrooms**: Class information with teacher assignments
- **Student Progress**: Assignment scores and feedback
- **Student Enrollments**: Many-to-many student-classroom relationships
- **Class Statistics**: Aggregated analytics data

## 🔐 Row-Level Security Policies

### Students
- Can view only their own profile and progress
- Can see classrooms they're enrolled in
- Cannot modify any data (read-only access)

### Teachers
- Can view and manage their assigned classrooms
- Can view and manage progress of students in their classes
- Can manage student enrollments in their classes
- Cannot access other teachers' data

### Head Teachers
- Can view and manage all data within their school
- Full CRUD access to all school-related records
- Cannot access data from other schools

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- MongoDB Atlas account (optional, for analytics)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rls-guard-dog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # MongoDB Configuration (Optional)
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=rls_guard_dog

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts in your Supabase SQL editor:
   ```bash
   # First run the schema
   database/schema.sql
   
   # Then run the RLS policies
   database/rls-policies.sql
   ```

5. **Deploy Supabase Edge Function** (Optional, for MongoDB analytics)
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Deploy the edge function
   supabase functions deploy calculate-class-stats
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### For Students
1. Sign up with your email and select "Student" role
2. Enter your school name to join or create a school
3. View your enrolled classes and progress on the dashboard

### For Teachers
1. Sign up with "Teacher" role
2. Access the teacher portal to:
   - Create and manage classrooms
   - Add student progress entries
   - View class statistics
   - Manage student enrollments

### For Head Teachers
1. Sign up with "Head Teacher" role
2. Full access to all school data:
   - Manage all classrooms in the school
   - View all student progress
   - Access comprehensive analytics

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Configure Domain**
   - Add custom domain in Vercel settings
   - Update NEXTAUTH_URL in environment variables

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
MONGODB_URI=your_production_mongodb_uri
MONGODB_DB_NAME=rls_guard_dog
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_production_secret
```

## 🧪 Testing RLS Policies

The application includes comprehensive Row-Level Security testing:

1. **Create test users** with different roles
2. **Test data isolation** between schools and roles
3. **Verify permissions** for CRUD operations
4. **Test edge cases** like role changes and data access

## 📊 MongoDB Analytics

The Edge Function provides advanced analytics:

- **Class averages** and performance metrics
- **Assignment statistics** across classes
- **Student performance** trends
- **Comparative analysis** between classes

## 🔧 Customization

### Adding New Roles
1. Update the `user_role` enum in schema.sql
2. Add RLS policies for the new role
3. Update TypeScript types
4. Modify middleware and auth functions

### Extending the Schema
1. Add new tables to schema.sql
2. Create appropriate RLS policies
3. Update TypeScript types
4. Add UI components for data management

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check profile creation after signup
   - Verify school_id associations

2. **Edge Function Issues**
   - Verify environment variables
   - Check MongoDB connection string
   - Review function logs in Supabase

3. **Authentication Problems**
   - Clear browser cookies
   - Check environment variables
   - Verify Supabase configuration

## 📚 API Documentation

### Supabase Tables
- `/api/profiles` - User profile management
- `/api/classrooms` - Classroom CRUD operations
- `/api/student-progress` - Progress tracking
- `/api/enrollments` - Student-classroom relationships

### Edge Functions
- `/functions/calculate-class-stats` - MongoDB analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Live Demo](https://your-app.vercel.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)

## 📞 Support

For support, email support@rlsguarddog.com or create an issue in the GitHub repository.

---

Built with ❤️ using modern web technologies and best practices for security and scalability.