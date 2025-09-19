export type UserRole = 'student' | 'teacher' | 'head_teacher';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Classroom {
  id: string;
  name: string;
  school_id: string;
  teacher_id: string | null;
  grade_level?: number;
  subject?: string;
  created_at: string;
  updated_at: string;
  teacher?: Profile;
}

export interface StudentProgress {
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
  student?: Profile;
  classroom?: Classroom;
}

export interface StudentEnrollment {
  id: string;
  student_id: string;
  classroom_id: string;
  school_id: string;
  enrolled_at: string;
  student?: Profile;
  classroom?: Classroom;
}

export interface ClassStatistics {
  id: string;
  classroom_id: string;
  school_id: string;
  average_score: number;
  total_assignments: number;
  total_students: number;
  calculation_date: string;
  created_at: string;
  classroom?: Classroom;
}

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: School;
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<School, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      classrooms: {
        Row: Classroom;
        Insert: Omit<Classroom, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Classroom, 'id' | 'created_at' | 'updated_at'>>;
      };
      student_progress: {
        Row: StudentProgress;
        Insert: Omit<StudentProgress, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<StudentProgress, 'id' | 'created_at' | 'updated_at'>>;
      };
      student_enrollments: {
        Row: StudentEnrollment;
        Insert: Omit<StudentEnrollment, 'id' | 'enrolled_at'>;
        Update: Partial<Omit<StudentEnrollment, 'id' | 'enrolled_at'>>;
      };
      class_statistics: {
        Row: ClassStatistics;
        Insert: Omit<ClassStatistics, 'id' | 'created_at'>;
        Update: Partial<Omit<ClassStatistics, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_user_profile: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          role: UserRole;
          school_id: string;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
}