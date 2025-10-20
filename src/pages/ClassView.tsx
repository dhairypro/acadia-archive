import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Database } from '@/types/database';

type Subject = Database['public']['Tables']['subjects']['Row'];
type Class = Database['public']['Tables']['classes']['Row'];

const ClassView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classData, setClassData] = useState<Class | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [classId, user]);

  const fetchData = async () => {
    try {
      const [classResult, subjectsResult] = await Promise.all([
        supabase.from('classes').select('*').eq('id', classId).single(),
        supabase.from('subjects').select('*').eq('class_id', classId).order('name')
      ]);

      if (classResult.error) throw classResult.error;
      if (subjectsResult.error) throw subjectsResult.error;

      setClassData(classResult.data);
      setSubjects(subjectsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/dashboard')} variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{classData?.name}</h1>
          {classData?.description && (
            <p className="text-muted-foreground text-lg">{classData.description}</p>
          )}
        </div>

        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subjects available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => navigate(`/subject/${subject.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    {subject.name}
                  </CardTitle>
                  {subject.description && (
                    <CardDescription>{subject.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassView;
