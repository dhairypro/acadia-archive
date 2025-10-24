import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, TrendingUp, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExamMark {
  exam_id: string;
  exam_name: string;
  exam_date: string;
  subject_name: string;
  marks_obtained: number;
  max_marks: number;
  percentage: number;
}

interface SubjectPerformance {
  subject: string;
  average: number;
  exams: number;
}

const MarksTracker = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [marks, setMarks] = useState<ExamMark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallPercentage, setOverallPercentage] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchMarks();
    }
  }, [user, loading, navigate]);

  const fetchMarks = async () => {
    try {
      const { data, error } = await supabase
        .from('student_marks')
        .select(`
          marks_obtained,
          exam_subjects (
            max_marks,
            exams (
              id,
              name,
              exam_date
            ),
            subjects (
              name
            )
          )
        `)
        .eq('user_id', user?.id)
        .not('marks_obtained', 'is', null);

      if (error) throw error;

      const formattedMarks: ExamMark[] = (data || []).map((item: any) => ({
        exam_id: item.exam_subjects.exams.id,
        exam_name: item.exam_subjects.exams.name,
        exam_date: item.exam_subjects.exams.exam_date,
        subject_name: item.exam_subjects.subjects.name,
        marks_obtained: item.marks_obtained,
        max_marks: item.exam_subjects.max_marks,
        percentage: (item.marks_obtained / item.exam_subjects.max_marks) * 100
      }));

      setMarks(formattedMarks);

      // Calculate overall percentage
      if (formattedMarks.length > 0) {
        const totalObtained = formattedMarks.reduce((sum, mark) => sum + mark.marks_obtained, 0);
        const totalMax = formattedMarks.reduce((sum, mark) => sum + mark.max_marks, 0);
        setOverallPercentage((totalObtained / totalMax) * 100);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
      toast.error('Failed to load marks');
    } finally {
      setIsLoading(false);
    }
  };

  // Group marks by exam
  const examGroups = marks.reduce((acc, mark) => {
    if (!acc[mark.exam_id]) {
      acc[mark.exam_id] = {
        exam_name: mark.exam_name,
        exam_date: mark.exam_date,
        subjects: []
      };
    }
    acc[mark.exam_id].subjects.push(mark);
    return acc;
  }, {} as Record<string, { exam_name: string; exam_date: string; subjects: ExamMark[] }>);

  // Calculate subject-wise performance
  const subjectPerformance: SubjectPerformance[] = Object.values(
    marks.reduce((acc, mark) => {
      if (!acc[mark.subject_name]) {
        acc[mark.subject_name] = { subject: mark.subject_name, total: 0, count: 0 };
      }
      acc[mark.subject_name].total += mark.percentage;
      acc[mark.subject_name].count += 1;
      return acc;
    }, {} as Record<string, { subject: string; total: number; count: number }>)
  ).map(item => ({
    subject: item.subject,
    average: Math.round(item.total / item.count),
    exams: item.count
  }));

  // Prepare trend data for line chart
  const trendData = Object.values(examGroups).map(exam => ({
    name: exam.exam_name.substring(0, 15),
    percentage: Math.round(
      exam.subjects.reduce((sum, s) => sum + s.percentage, 0) / exam.subjects.length
    )
  }));

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your marks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Marks Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Track your academic performance and progress</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {marks.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Marks Available</h3>
            <p className="text-muted-foreground">
              Your marks will appear here once your teacher publishes them.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overall Performance Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-bold text-primary">{overallPercentage.toFixed(1)}%</div>
                    <p className="text-muted-foreground mt-2">Average across all exams</p>
                  </div>
                  <div className={`px-6 py-3 rounded-lg ${getGradeColor(overallPercentage)} text-white`}>
                    <div className="text-3xl font-bold">{getGrade(overallPercentage)}</div>
                    <div className="text-sm">Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trend
                  </CardTitle>
                  <CardDescription>Your progress across exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subject-wise Average
                  </CardTitle>
                  <CardDescription>Performance by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="average" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Exam-wise Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Exam Details</h2>
              {Object.values(examGroups).sort((a, b) => 
                new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
              ).map((exam, idx) => {
                const examTotal = exam.subjects.reduce((sum, s) => sum + s.marks_obtained, 0);
                const examMax = exam.subjects.reduce((sum, s) => sum + s.max_marks, 0);
                const examPercentage = (examTotal / examMax) * 100;

                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exam.exam_name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(exam.exam_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{examPercentage.toFixed(1)}%</div>
                          <Badge className={`${getGradeColor(examPercentage)} text-white mt-1`}>
                            {getGrade(examPercentage)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {exam.subjects.map((subject, subIdx) => (
                          <div key={subIdx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-12 rounded-full ${getGradeColor(subject.percentage)}`} />
                              <div>
                                <div className="font-semibold">{subject.subject_name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {subject.marks_obtained} / {subject.max_marks}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">{subject.percentage.toFixed(1)}%</div>
                              <div className="text-sm text-muted-foreground">{getGrade(subject.percentage)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksTracker;
