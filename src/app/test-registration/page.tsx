'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function RegistrationTestPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setTestResult('')

    const results: string[] = []
    
    try {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      results.push('=== ENVIRONMENT VARIABLES ===')
      results.push(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl || 'NOT SET'}`)
      results.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'SET (hidden)' : 'NOT SET'}`)
      
      // Determine mode
      const isDemoMode = !supabaseUrl || 
                        supabaseUrl === 'demo_mode_no_supabase_url' ||
                        supabaseUrl === 'your_supabase_project_url' ||
                        !supabaseUrl.startsWith('http')
      
      results.push('')
      results.push('=== MODE DETECTION ===')
      results.push(`Demo Mode: ${isDemoMode ? 'YES' : 'NO'}`)
      results.push(`Valid HTTP URL: ${supabaseUrl?.startsWith('http') ? 'YES' : 'NO'}`)
      
      // Test basic functionality
      results.push('')
      results.push('=== BASIC TESTS ===')
      
      if (isDemoMode) {
        results.push('✅ Demo mode detected - registration will work in simulation mode')
        results.push('✅ Form validation should work normally')
        results.push('✅ Demo alerts will show registration details')
        results.push('✅ Redirects to dashboard will work')
      } else {
        results.push('⚠️  Production mode detected - requires valid Supabase setup')
        results.push('⚠️  Database connection required for full registration')
        results.push('⚠️  May encounter errors without proper Supabase configuration')
      }
      
      // Test form validation
      results.push('')
      results.push('=== FORM VALIDATION TEST ===')
      try {
        const { signupSchema } = await import('@/lib/validations')
        const testData = {
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          role: 'student',
          schoolName: 'Test School'
        }
        
        const validation = signupSchema.safeParse(testData)
        if (validation.success) {
          results.push('✅ Form validation schema is working correctly')
        } else {
          results.push('❌ Form validation schema has issues:')
          validation.error.errors.forEach(err => {
            results.push(`   - ${err.path.join('.')}: ${err.message}`)
          })
        }
      } catch (err) {
        results.push('❌ Error testing form validation: ' + (err instanceof Error ? err.message : 'Unknown error'))
      }
      
      results.push('')
      results.push('=== RECOMMENDATIONS ===')
      if (isDemoMode) {
        results.push('📝 To test registration:')
        results.push('   1. Go to /auth/signup')
        results.push('   2. Fill out the form with any valid data')
        results.push('   3. Click \"Create account\"')
        results.push('   4. You should see a demo success alert')
        results.push('   5. You should be redirected to the dashboard')
      } else {
        results.push('📝 To enable full registration:')
        results.push('   1. Set up a Supabase project')
        results.push('   2. Update .env.local with real credentials')
        results.push('   3. Apply database schema and RLS policies')
        results.push('   4. Test with real user registration')
      }
      
    } catch (err) {
      results.push('❌ Diagnostic error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
    
    setTestResult(results.join('\n'))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            RLS Guard Dog - Registration Diagnostics
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This page helps diagnose registration issues by checking environment setup,
              form validation, and providing specific recommendations.
            </p>
            
            <Button 
              onClick={runDiagnostics}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Running Diagnostics...' : 'Run Registration Diagnostics'}
            </Button>
          </div>

          {testResult && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Diagnostic Results
              </h2>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {testResult}
                </pre>
              </div>
            </div>
          )}
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Actions
            </h2>
            <div className="flex space-x-4">
              <a 
                href="/auth/signup" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Test Registration
              </a>
              <a 
                href="/auth/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Test Login
              </a>
              <a 
                href="/" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}