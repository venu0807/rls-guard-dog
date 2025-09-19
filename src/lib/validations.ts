import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['student', 'teacher', 'head_teacher']),
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const studentProgressSchema = z.object({
  student_id: z.string().uuid('Please select a valid student'),
  classroom_id: z.string().uuid('Please select a valid classroom'),
  assignment_name: z.string().min(1, 'Assignment name is required'),
  score: z.number().min(0, 'Score cannot be negative').max(100, 'Score cannot exceed 100'),
  max_score: z.number().min(1, 'Max score must be at least 1').max(100, 'Max score cannot exceed 100'),
  assignment_date: z.string().min(1, 'Assignment date is required'),
  notes: z.string().optional(),
})

export const classroomSchema = z.object({
  name: z.string().min(1, 'Classroom name is required'),
  grade_level: z.number().min(1, 'Grade level must be at least 1').max(12, 'Grade level cannot exceed 12').optional(),
  subject: z.string().min(1, 'Subject is required').optional(),
})

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type StudentProgressFormData = z.infer<typeof studentProgressSchema>
export type ClassroomFormData = z.infer<typeof classroomSchema>
export type ProfileFormData = z.infer<typeof profileSchema>