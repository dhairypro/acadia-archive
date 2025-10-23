import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Mail, Phone, GraduationCap, Calendar as CalendarIcon, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Attendance = Database['public']['Tables']['attendance']['Row'];

interface ProfileWithClass extends Profile {
  classes?: { name: string } | null;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<ProfileWithClass | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      const [profileResult, attendanceResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, classes(name)')
          .eq('id', studentId)
          .single(),
        supabase
          .from('attendance')
          .select('*')
          .eq('user_id', studentId)
          .order('date', { ascending: false }),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (attendanceResult.error) throw attendanceResult.error;

      setStudent(profileResult.data);
      setAttendance(attendanceResult.data || []);

      // Calculate stats
      const stats = {
        total: attendanceResult.data?.length || 0,
        present: attendanceResult.data?.filter(a => a.status === 'present').length || 0,
        absent: attendanceResult.data?.filter(a => a.status === 'absent').length || 0,
        late: attendanceResult.data?.filter(a => a.status === 'late').length || 0,
        percentage: 0,
      };
      
      if (stats.total > 0) {
        stats.percentage = Math.round(((stats.present + stats.late) / stats.total) * 100);
      }
      
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceDates = () => {
    const dates: { [key: string]: 'present' | 'absent' | 'late' } = {};
    attendance.forEach(record => {
      dates[record.date] = record.status;
    });
    return dates;
  };

  const attendanceDates = getAttendanceDates();

  const getDayColor = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const status = attendanceDates[dateStr];
    
    if (status === 'present') return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
    if (status === 'absent') return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
    if (status === 'late') return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Student not found</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/admin')} variant="outline" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Panel
        </Button>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{student.full_name}</CardTitle>
                  <CardDescription>Student Profile</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="font-medium text-sm">{student.classes?.name || 'Not Assigned'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Roll Number</p>
                  <p className="font-medium text-sm">{student.roll_number || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Parent Phone</p>
                  <p className="font-medium text-sm">{student.parent_phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="marks">Marks & Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Attendance Rate</CardDescription>
                    <CardTitle className="text-3xl font-bold text-primary">
                      {attendanceStats.percentage}%
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Present Days</CardDescription>
                    <CardTitle className="text-3xl font-bold text-green-600">
                      {attendanceStats.present}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Absent Days</CardDescription>
                    <CardTitle className="text-3xl font-bold text-red-600">
                      {attendanceStats.absent}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Late Days</CardDescription>
                    <CardTitle className="text-3xl font-bold text-yellow-600">
                      {attendanceStats.late}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Calendar */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Attendance Calendar
                  </CardTitle>
                  <CardDescription>Color-coded attendance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      className="rounded-md border"
                      modifiers={{
                        present: (date) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          return attendanceDates[dateStr] === 'present';
                        },
                        absent: (date) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          return attendanceDates[dateStr] === 'absent';
                        },
                        late: (date) => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          return attendanceDates[dateStr] === 'late';
                        },
                      }}
                      modifiersClassNames={{
                        present: 'bg-green-500/20 text-green-700 hover:bg-green-500/30',
                        absent: 'bg-red-500/20 text-red-700 hover:bg-red-500/30',
                        late: 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30',
                      }}
                    />
                  </div>
                  <div className="mt-4 flex gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Late</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>Last 10 records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {attendance.slice(0, 10).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <span className="text-sm">{format(new Date(record.date), 'PP')}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            record.status === 'present'
                              ? 'bg-green-500/20 text-green-700'
                              : record.status === 'absent'
                              ? 'bg-red-500/20 text-red-700'
                              : 'bg-yellow-500/20 text-yellow-700'
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    ))}
                    {attendance.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No attendance records yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marks" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Marks & Performance</CardTitle>
                    <CardDescription>Coming soon: View exam marks, subject-wise performance, and analytics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Marks tracking feature will be available once exams are created and marks are entered.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDetail;
