import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Shield } from 'lucide-react';
import ClassesManager from '@/components/admin/ClassesManager';
import SubjectsManager from '@/components/admin/SubjectsManager';
import ChaptersManager from '@/components/admin/ChaptersManager';
import FilesManager from '@/components/admin/FilesManager';
import StudentsManager from '@/components/admin/StudentsManager';
import AttendanceMarking from '@/components/admin/AttendanceMarking';
import ExamsManager from '@/components/admin/ExamsManager';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage all resources</p>
            </div>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-7 h-auto">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="students" className="mt-6">
            <StudentsManager />
          </TabsContent>
          <TabsContent value="attendance" className="mt-6">
            <AttendanceMarking />
          </TabsContent>
          <TabsContent value="exams" className="mt-6">
            <ExamsManager />
          </TabsContent>
          <TabsContent value="classes" className="mt-6">
            <ClassesManager />
          </TabsContent>
          <TabsContent value="subjects" className="mt-6">
            <SubjectsManager />
          </TabsContent>
          <TabsContent value="chapters" className="mt-6">
            <ChaptersManager />
          </TabsContent>
          <TabsContent value="files" className="mt-6">
            <FilesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
