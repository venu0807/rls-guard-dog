'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { studentProgressSchema, type StudentProgressFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Database } from '@/types/database'

type Classroom = Database['public']['Tables']['classrooms']['Row'] & {
  teacher?: Database['public']['Tables']['profiles']['Row']
}

type StudentEnrollment = Database['public']['Tables']['student_enrollments']['Row'] & {
  student?: Database['public']['Tables']['profiles']['Row']
  classroom?: Database['public']['Tables']['classrooms']['Row']
}

interface Props {
  classrooms: Classroom[]
  students: StudentEnrollment[]
}

export function StudentProgressForm({ classrooms, students }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // Remove unused selectedClassroom state
  // const [selectedClassroom] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<StudentProgressFormData>({
    resolver: zodResolver(studentProgressSchema),
  })

  const classroomId = watch('classroom_id')
  
  // Filter students by selected classroom
  const availableStudents = students.filter(
    enrollment => enrollment.classroom_id === classroomId
  )

  const onSubmit = async (data: StudentProgressFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: insertError } = await supabase
        .from('student_progress')
        .insert({
          student_id: data.student_id,
          classroom_id: data.classroom_id,
          school_id: classrooms.find(c => c.id === data.classroom_id)?.school_id || '',
          assignment_name: data.assignment_name,
          score: data.score,
          max_score: data.max_score,
          assignment_date: data.assignment_date,
          notes: data.notes,
        })

      if (insertError) {
        setError(insertError.message)
        return
      }

      setSuccess('Progress added successfully!')
      reset()
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="classroom_id" className="block text-sm font-medium text-gray-700 mb-1">
          Classroom
        </label>
        <select
          {...register('classroom_id')}
          id="classroom_id"
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <option value="">Select classroom</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
        {errors.classroom_id && (
          <p className="mt-1 text-sm text-red-600">{errors.classroom_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">
          Student
        </label>
        <select
          {...register('student_id')}
          id="student_id"
          disabled={!classroomId}
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
        >
          <option value="">Select student</option>
          {availableStudents.map((enrollment) => (
            <option key={enrollment.student_id} value={enrollment.student_id}>
              {enrollment.student?.full_name}
            </option>
          ))}
        </select>
        {errors.student_id && (
          <p className="mt-1 text-sm text-red-600">{errors.student_id.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="assignment_name" className="block text-sm font-medium text-gray-700 mb-1">
          Assignment Name
        </label>
        <Input
          {...register('assignment_name')}
          id="assignment_name"
          type="text"
          placeholder="Math Quiz 1"
          className={errors.assignment_name ? 'border-red-500' : ''}
        />
        {errors.assignment_name && (
          <p className="mt-1 text-sm text-red-600">{errors.assignment_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
            Score
          </label>
          <Input
            {...register('score', { valueAsNumber: true })}
            id="score"
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="85"
            className={errors.score ? 'border-red-500' : ''}
          />
          {errors.score && (
            <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="max_score" className="block text-sm font-medium text-gray-700 mb-1">
            Max Score
          </label>
          <Input
            {...register('max_score', { valueAsNumber: true })}
            id="max_score"
            type="number"
            min="1"
            max="100"
            step="0.01"
            placeholder="100"
            defaultValue="100"
            className={errors.max_score ? 'border-red-500' : ''}
          />
          {errors.max_score && (
            <p className="mt-1 text-sm text-red-600">{errors.max_score.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="assignment_date" className="block text-sm font-medium text-gray-700 mb-1">
          Assignment Date
        </label>
        <Input
          {...register('assignment_date')}
          id="assignment_date"
          type="date"
          className={errors.assignment_date ? 'border-red-500' : ''}
        />
        {errors.assignment_date && (
          <p className="mt-1 text-sm text-red-600">{errors.assignment_date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={3}
          placeholder="Additional notes about the assignment..."
          className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Adding Progress...' : 'Add Progress'}
      </Button>
    </form>
  )
}