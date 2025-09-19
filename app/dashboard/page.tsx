import { requireProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const profile = await requireProfile()
  const supabase = await createClient()

  // Get user's progress if they're a student
  let studentProgress = null
  let enrollments = null

  if (profile.role === 'student') {
    const { data: progressData } = await supabase
      .from('student_progress')
      .select(`
        *,
        classroom:classrooms(id, name, subject)
      `)
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10)

    const { data: enrollmentData } = await supabase
      .from('student_enrollments')
      .select(`
        *,
        classroom:classrooms(id, name, subject, grade_level)
      `)
      .eq('student_id', profile.id)

    studentProgress = progressData
    enrollments = enrollmentData
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile.full_name}
              </h1>
              <p className="text-gray-600">
                {profile.role === 'student' ? 'Student' : 
                 profile.role === 'teacher' ? 'Teacher' : 'Head Teacher'} Dashboard
              </p>
            </div>
            <div className="flex space-x-4">
              {profile.role !== 'student' && (
                <Link href="/teacher">
                  <Button>Teacher Portal</Button>
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {profile.role === 'student' ? (
          // Student Dashboard
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enrolled Classes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Classes
              </h2>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">
                        {enrollment.classroom?.name}
                      </h3>
                      {enrollment.classroom?.subject && (
                        <p className="text-sm text-gray-600">
                          {enrollment.classroom.subject}
                        </p>
                      )}
                      {enrollment.classroom?.grade_level && (
                        <p className="text-sm text-gray-500">
                          Grade {enrollment.classroom.grade_level}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No classes enrolled yet.</p>
              )}
            </div>

            {/* Recent Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Progress
              </h2>
              {studentProgress && studentProgress.length > 0 ? (
                <div className="space-y-4">
                  {studentProgress.map((progress) => (
                    <div key={progress.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {progress.assignment_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {progress.classroom?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {progress.score}/{progress.max_score}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.round((progress.score / progress.max_score) * 100)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(progress.assignment_date).toLocaleDateString()}
                      </div>
                      {progress.notes && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {progress.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No progress entries yet.</p>
              )}
            </div>
          </div>
        ) : (
          // Teacher/Head Teacher Dashboard
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Teacher Dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              Access your teacher portal to manage classrooms and student progress.
            </p>
            <Link href="/teacher">
              <Button size="lg">Go to Teacher Portal</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}