import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  class_id: string;
  classes: {
    name: string;
  };
}

const Attendance = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchAttendance();
    }
  }, [user, loading, navigate]);

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          classes (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setAttendance(data || []);
      
      // Calculate stats
      const present = data?.filter(a => a.status === 'present').length || 0;
      const absent = data?.filter(a => a.status === 'absent').length || 0;
      const late = data?.filter(a => a.status === 'late').length || 0;
      
      setStats({
        present,
        absent,
        late,
        total: data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      present: 'default',
      absent: 'destructive',
      late: 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const attendancePercentage = stats.total > 0 
    ? Math.round((stats.present / stats.total) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
            Attendance Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your class attendance and statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <div className="text-white font-bold text-xl">{attendancePercentage}%</div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar and Records */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Calendar View</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </Card>

          {/* Attendance Records */}
          <Card className="p-6 bg-white/50 dark:bg-purple-900/20 backdrop-blur-xl border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Attendance</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {attendance.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-purple-900/30 rounded-lg border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.classes.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              ))}
              {attendance.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No attendance records yet
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
