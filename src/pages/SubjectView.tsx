import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Database } from '@/types/database';

type Chapter = Database['public']['Tables']['chapters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];

const SubjectView = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjectData, setSubjectData] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [subjectId, user]);

  const fetchData = async () => {
    try {
      const [subjectResult, chaptersResult] = await Promise.all([
        supabase.from('subjects').select('*, classes(id, name)').eq('id', subjectId).single(),
        supabase.from('chapters').select('*').eq('subject_id', subjectId).order('name')
      ]);

      if (subjectResult.error) throw subjectResult.error;
      if (chaptersResult.error) throw chaptersResult.error;

      setSubjectData(subjectResult.data);
      setChapters(chaptersResult.data || []);
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
        <Button
          onClick={() => navigate(`/class/${(subjectData as any)?.classes?.id}`)}
          variant="ghost"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Class
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{subjectData?.name}</h1>
          {subjectData?.description && (
            <p className="text-muted-foreground text-lg">{subjectData.description}</p>
          )}
        </div>

        {chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No chapters available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Card
                key={chapter.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => navigate(`/chapter/${chapter.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    {chapter.name}
                  </CardTitle>
                  {chapter.description && (
                    <CardDescription>{chapter.description}</CardDescription>
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

export default SubjectView;
