import type { Database } from '@/types/database'

type StudentProgress = Database['public']['Tables']['student_progress']['Row'] & {
  student?: Database['public']['Tables']['profiles']['Row']
  classroom?: Database['public']['Tables']['classrooms']['Row']
}

interface Props {
  progress: StudentProgress[]
}

export function ProgressList({ progress }: Props) {
  if (progress.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No progress entries yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {progress.map((entry) => (
        <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">
                {entry.assignment_name}
              </h3>
              <p className="text-sm text-gray-600">
                {entry.student?.full_name} • {entry.classroom?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                {entry.score}/{entry.max_score}
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((entry.score / entry.max_score) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{new Date(entry.assignment_date).toLocaleDateString()}</span>
            <span>{new Date(entry.created_at).toLocaleDateString()}</span>
          </div>
          
          {entry.notes && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {entry.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}