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
    };
  };
}
