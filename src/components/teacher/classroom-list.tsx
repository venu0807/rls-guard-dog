import Link from 'next/link'
import type { Database } from '@/types/database'

type Classroom = Database['public']['Tables']['classrooms']['Row'] & {
  teacher?: Database['public']['Tables']['profiles']['Row']
}

interface Props {
  classrooms: Classroom[]
}

export function ClassroomList({ classrooms }: Props) {
  if (classrooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No classrooms assigned yet.</p>
        <Link href="/teacher/classrooms/new" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
          Create your first classroom
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {classrooms.map((classroom) => (
        <div key={classroom.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {classroom.name}
              </h3>
              {classroom.subject && (
                <p className="text-sm text-gray-600">{classroom.subject}</p>
              )}
              {classroom.grade_level && (
                <p className="text-sm text-gray-500">Grade {classroom.grade_level}</p>
              )}
            </div>
            <Link
              href={`/teacher/classrooms/${classroom.id}`}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View
            </Link>
          </div>
        </div>
      ))}
      
      <Link
        href="/teacher/classrooms/new"
        className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
      >
        + Add New Classroom
      </Link>
    </div>
  )
}