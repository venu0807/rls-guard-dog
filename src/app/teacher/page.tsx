import { requireTeacher } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Classroom } from '@/types/database'
import { StudentProgressForm } from '@/components/teacher/student-progress-form'
import { ProgressList } from '@/components/teacher/progress-list'
import { ClassroomList } from '@/components/teacher/classroom-list'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function TeacherPage() {
  const profile = await requireTeacher()
  const supabase = await createClient()

  // Get teacher's classrooms
  const { data: classrooms, error: classroomsError } = await supabase
    .from('classrooms')
    .select(`
      *,
      teacher:profiles(id, full_name)
    `)
    .eq('teacher_id', profile.id)

  // Get students in teacher's classes
  const { data: students, error: studentsError } = await supabase
    .from('student_enrollments')
    .select(`
      *,
      student:profiles(id, full_name, email),
      classroom:classrooms(id, name)    
    `)
    .in('classroom_id', classrooms?.map((c: Classroom) => c.id) || [])

  // Get recent progress entries
  const { data: recentProgress, error: progressError } = await supabase
    .from('student_progress')
    .select(`
      *,
      student:profiles(id, full_name),
      classroom:classrooms(id, name)
    `)
    .in('classroom_id', classrooms?.map((c: Classroom) => c.id) || [])
    .order('created_at', { ascending: false })
    .limit(10)

  if (classroomsError || studentsError || progressError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            Error loading data. Please try again.
          </div>
        </div>
      </div>
    )
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
                {profile.role === 'head_teacher' ? 'Head Teacher' : 'Teacher'} Dashboard
              </p>
            </div>
            <div className="flex space-x-4">
              <Link href="/teacher/classrooms">
                <Button variant="outline">Manage Classrooms</Button>
              </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Classrooms */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Classrooms
              </h2>
              <ClassroomList classrooms={classrooms || []} />
            </div>
          </div>

          {/* Middle Column - Add Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add Student Progress
              </h2>
              <StudentProgressForm 
                classrooms={classrooms || []}
                students={students || []}
              />
            </div>
          </div>

          {/* Right Column - Recent Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Progress
              </h2>
              <ProgressList progress={recentProgress || []} />
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {classrooms?.length || 0}
              </div>
              <div className="text-gray-600">Classrooms</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {students?.length || 0}
              </div>
              <div className="text-gray-600">Students</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {recentProgress?.length || 0}
              </div>
              <div className="text-gray-600">Progress Entries</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}