-- Row-Level Security Policies for RLS Guard Dog

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's profile
CREATE OR REPLACE FUNCTION get_current_user_profile()
RETURNS TABLE (
    id UUID,
    role user_role,
    school_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.role, p.school_id
    FROM profiles p
    WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schools policies
-- Only head teachers and teachers can view their school
CREATE POLICY "Users can view their own school" ON schools
    FOR SELECT USING (
        id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role IN ('teacher', 'head_teacher')
        )
    );

-- Only head teachers can modify schools
CREATE POLICY "Head teachers can manage schools" ON schools
    FOR ALL USING (
        id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

-- Head teachers can view all profiles in their school
CREATE POLICY "Head teachers can view school profiles" ON profiles
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Teachers can view profiles of students in their classes
CREATE POLICY "Teachers can view their students profiles" ON profiles
    FOR SELECT USING (
        role = 'student' AND
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'teacher'
        ) AND
        id IN (
            SELECT se.student_id FROM student_enrollments se
            JOIN classrooms c ON se.classroom_id = c.id
            WHERE c.teacher_id = auth.uid()
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- Head teachers can manage all profiles in their school
CREATE POLICY "Head teachers can manage school profiles" ON profiles
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Classrooms policies
-- Teachers can view classrooms they teach
CREATE POLICY "Teachers can view their classrooms" ON classrooms
    FOR SELECT USING (teacher_id = auth.uid());

-- Head teachers can view all classrooms in their school
CREATE POLICY "Head teachers can view school classrooms" ON classrooms
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Students can view classrooms they're enrolled in
CREATE POLICY "Students can view enrolled classrooms" ON classrooms
    FOR SELECT USING (
        id IN (
            SELECT classroom_id FROM student_enrollments
            WHERE student_id = auth.uid()
        )
    );

-- Teachers can manage their own classrooms
CREATE POLICY "Teachers can manage their classrooms" ON classrooms
    FOR ALL USING (teacher_id = auth.uid());

-- Head teachers can manage all classrooms in their school
CREATE POLICY "Head teachers can manage school classrooms" ON classrooms
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Student Progress policies
-- Students can only view their own progress
CREATE POLICY "Students can view own progress" ON student_progress
    FOR SELECT USING (student_id = auth.uid());

-- Teachers can view progress of students in their classes
CREATE POLICY "Teachers can view their students progress" ON student_progress
    FOR SELECT USING (
        classroom_id IN (
            SELECT id FROM classrooms WHERE teacher_id = auth.uid()
        )
    );

-- Teachers can manage progress of students in their classes
CREATE POLICY "Teachers can manage their students progress" ON student_progress
    FOR ALL USING (
        classroom_id IN (
            SELECT id FROM classrooms WHERE teacher_id = auth.uid()
        )
    );

-- Head teachers can view all progress in their school
CREATE POLICY "Head teachers can view school progress" ON student_progress
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Head teachers can manage all progress in their school
CREATE POLICY "Head teachers can manage school progress" ON student_progress
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Student Enrollments policies
-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments" ON student_enrollments
    FOR SELECT USING (student_id = auth.uid());

-- Teachers can view enrollments in their classes
CREATE POLICY "Teachers can view their class enrollments" ON student_enrollments
    FOR SELECT USING (
        classroom_id IN (
            SELECT id FROM classrooms WHERE teacher_id = auth.uid()
        )
    );

-- Teachers can manage enrollments in their classes
CREATE POLICY "Teachers can manage their class enrollments" ON student_enrollments
    FOR ALL USING (
        classroom_id IN (
            SELECT id FROM classrooms WHERE teacher_id = auth.uid()
        )
    );

-- Head teachers can view all enrollments in their school
CREATE POLICY "Head teachers can view school enrollments" ON student_enrollments
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Head teachers can manage all enrollments in their school
CREATE POLICY "Head teachers can manage school enrollments" ON student_enrollments
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Class Statistics policies
-- Teachers can view statistics for their classes
CREATE POLICY "Teachers can view their class statistics" ON class_statistics
    FOR SELECT USING (
        classroom_id IN (
            SELECT id FROM classrooms WHERE teacher_id = auth.uid()
        )
    );

-- Head teachers can view all statistics in their school
CREATE POLICY "Head teachers can view school statistics" ON class_statistics
    FOR SELECT USING (
        school_id IN (
            SELECT school_id FROM get_current_user_profile()
            WHERE role = 'head_teacher'
        )
    );

-- Only system can insert/update statistics (via service role)
CREATE POLICY "System can manage statistics" ON class_statistics
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;