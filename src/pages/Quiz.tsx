import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  chapters: {
    name: string;
    subjects: {
      name: string;
    };
  };
}

const QuizPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchQuizzes();
    }
  }, [user, loading, navigate]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          chapters (
            name,
            subjects (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            Quizzes & Assessments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Test your knowledge and track your progress</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary">
                  {quiz.total_marks} marks
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {quiz.description || 'Test your understanding of the chapter concepts'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-4 w-4" />
                  <span>{quiz.chapters.subjects.name} - {quiz.chapters.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>Passing: {quiz.passing_marks} marks</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                onClick={() => toast.info('Quiz taking feature coming soon!')}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </Button>
            </Card>
          ))}

          {quizzes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No quizzes available yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
