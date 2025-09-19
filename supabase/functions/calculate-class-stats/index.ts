// @deno-types="https://deno.land/x/types/deno.d.ts"
// ⚠️  IMPORTANT: This Edge Function runs in DENO runtime, NOT Node.js
// The TypeScript errors shown in your IDE are EXPECTED and NORMAL
// These errors do NOT affect the actual functionality when deployed to Supabase
// Your IDE's TypeScript checker is configured for Node.js, but this code runs in Deno

// @ts-nocheck - Suppress TypeScript errors for Deno-specific code
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts"

// Type definitions for better TypeScript support
interface ProgressData {
  id: string;
  student_id: string;
  classroom_id: string;
  school_id: string;
  assignment_name: string;
  score: number;
  max_score: number;
  assignment_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    full_name: string;
  };
  classroom?: {
    id: string;
    name: string;
  };
}

interface AssignmentGroup {
  [key: string]: number[];
}

interface StudentGroup {
  student_id: string;
  student_name: string;
  scores: number[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClassStatisticsPayload {
  classroom_id: string
  school_id: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request payload
    const { classroom_id, school_id }: ClassStatisticsPayload = await req.json()

    if (!classroom_id || !school_id) {
      return new Response(
        JSON.stringify({ error: 'classroom_id and school_id are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get student progress data from Supabase
    const { data: progressData, error: progressError } = await supabaseClient
      .from('student_progress')
      .select(`
        *,
        student:profiles(id, full_name),
        classroom:classrooms(id, name)
      `)
      .eq('classroom_id', classroom_id)

    if (progressError) {
      throw new Error(`Failed to fetch progress data: ${progressError.message}`)
    }

    if (!progressData || progressData.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No progress data found for this classroom',
          statistics: null 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Calculate statistics
    const totalAssignments = progressData.length
    const uniqueStudents = new Set(progressData.map((p: ProgressData) => p.student_id)).size
    const totalScore = progressData.reduce((sum: number, p: ProgressData) => sum + (p.score / p.max_score) * 100, 0)
    const averageScore = Math.round((totalScore / totalAssignments) * 100) / 100

    // Get assignment distribution
    const assignmentGroups = progressData.reduce((acc: AssignmentGroup, p: ProgressData) => {
      const key = p.assignment_name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push((p.score / p.max_score) * 100)
      return acc
    }, {} as Record<string, number[]>)

    const assignmentStats = Object.entries(assignmentGroups).map(([name, scores]: [string, number[]]) => ({
      assignment_name: name,
      average_score: Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 100) / 100,
      total_submissions: scores.length,
      highest_score: Math.max(...scores),
      lowest_score: Math.min(...scores)
    }))

    // Student performance summary
    const studentGroups = progressData.reduce((acc: Record<string, StudentGroup>, p: ProgressData) => {
      const key = p.student_id
      if (!acc[key]) {
        acc[key] = {
          student_id: p.student_id,
          student_name: p.student?.full_name || 'Unknown',
          scores: []
        }
      }
      acc[key].scores.push((p.score / p.max_score) * 100)
      return acc
    }, {} as Record<string, any>)

    const studentStats = Object.values(studentGroups).map((student: StudentGroup) => ({
      student_id: student.student_id,
      student_name: student.student_name,
      average_score: Math.round((student.scores.reduce((a: number, b: number) => a + b, 0) / student.scores.length) * 100) / 100,
      total_assignments: student.scores.length,
      highest_score: Math.max(...student.scores),
      lowest_score: Math.min(...student.scores)
    }))

    const statistics = {
      classroom_id,
      school_id,
      average_score: averageScore,
      total_assignments: totalAssignments,
      total_students: uniqueStudents,
      calculation_date: new Date().toISOString(),
      assignment_statistics: assignmentStats,
      student_statistics: studentStats,
      metadata: {
        calculated_at: new Date().toISOString(),
        total_data_points: progressData.length
      }
    }

    // Save to MongoDB
    const mongoUri = Deno.env.get('MONGODB_URI')
    const mongoDbName = Deno.env.get('MONGODB_DB_NAME') || 'rls_guard_dog'

    if (mongoUri) {
      try {
        const client = new MongoClient()
        await client.connect(mongoUri)
        
        const db = client.database(mongoDbName)
        const collection = db.collection('class_statistics')
        
        await collection.insertOne({
          ...statistics,
          created_at: new Date(),
          updated_at: new Date()
        })
        
        client.close()
        console.log('Statistics saved to MongoDB successfully')
      } catch (mongoError) {
        console.error('Failed to save to MongoDB:', mongoError)
        // Continue execution - MongoDB is not critical for the response
        // Continue execution - MongoDB is not critical for the response
      }
    }

    // Save summary to Supabase
    const { error: insertError } = await supabaseClient
      .from('class_statistics')
      .insert({
        classroom_id,
        school_id,
        average_score: averageScore,
        total_assignments: totalAssignments,
        total_students: uniqueStudents,
        calculation_date: new Date().toISOString()
      })

    if (insertError) {
      console.error('Failed to save to Supabase:', insertError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        statistics,
        message: 'Class statistics calculated successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: unknown) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})