export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          class_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      files: {
        Row: {
          id: string;
          chapter_id: string;
          name: string;
          description: string | null;
          file_type: 'pdf' | 'video' | 'link' | 'note';
          file_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          name: string;
          description?: string | null;
          file_type: 'pdf' | 'video' | 'link' | 'note';
          file_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          name?: string;
          description?: string | null;
          file_type?: 'pdf' | 'video' | 'link' | 'note';
          file_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          class_id: string | null;
          phone: string | null;
          parent_phone: string | null;
          roll_number: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          class_id?: string | null;
          phone?: string | null;
          parent_phone?: string | null;
          roll_number?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          class_id?: string | null;
          phone?: string | null;
          parent_phone?: string | null;
          roll_number?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exams: {
        Row: {
          id: string;
          name: string;
          exam_date: string;
          class_id: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          exam_date: string;
          class_id: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          exam_date?: string;
          class_id?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exam_subjects: {
        Row: {
          id: string;
          exam_id: string;
          subject_id: string;
          max_marks: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          subject_id: string;
          max_marks: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          subject_id?: string;
          max_marks?: number;
          created_at?: string;
        };
      };
      student_marks: {
        Row: {
          id: string;
          user_id: string;
          exam_subject_id: string;
          marks_obtained: number | null;
          remarks: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_subject_id: string;
          marks_obtained?: number | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_subject_id?: string;
          marks_obtained?: number | null;
          remarks?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          user_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          class_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          marked_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
