import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Save, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Class = Database['public']['Tables']['classes']['Row'];
type Attendance = Database['public']['Tables']['attendance']['Row'];

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

const AttendanceMarking = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);
  const [attendance, setAttendance] = useState<Map<string, 'present' | 'absent' | 'late'>>(new Map());
  const [existingAttendance, setExistingAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    }
  };

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const [studentsResult, attendanceResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('class_id', selectedClass)
          .order('full_name'),
        supabase
          .from('attendance')
          .select('*')
          .eq('class_id', selectedClass)
          .eq('date', format(date, 'yyyy-MM-dd'))
      ]);

      if (studentsResult.error) throw studentsResult.error;
      if (attendanceResult.error) throw attendanceResult.error;

      setStudents(studentsResult.data || []);
      setExistingAttendance(attendanceResult.data || []);

      // Pre-populate attendance map with existing data
      const attendanceMap = new Map<string, 'present' | 'absent' | 'late'>();
      attendanceResult.data?.forEach((record) => {
        attendanceMap.set(record.user_id, record.status);
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch students and attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(new Map(attendance.set(studentId, status)));
  };

  const markAllPresent = () => {
    const newAttendance = new Map(attendance);
    students.forEach(student => newAttendance.set(student.id, 'present'));
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = new Map(attendance);
    students.forEach(student => newAttendance.set(student.id, 'absent'));
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    setSaving(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const records = Array.from(attendance.entries()).map(([userId, status]) => ({
        user_id: userId,
        class_id: selectedClass,
        date: dateStr,
        status,
        marked_by: user?.id
      }));

      // Delete existing attendance for this date and class
      const { error: deleteError } = await supabase
        .from('attendance')
        .delete()
        .eq('class_id', selectedClass)
        .eq('date', dateStr);

      if (deleteError) throw deleteError;

      // Insert new attendance records
      const { error: insertError } = await supabase
        .from('attendance')
        .insert(records);

      if (insertError) throw insertError;

      toast.success('Attendance saved successfully');
      fetchStudentsAndAttendance();
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast.error(error.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const stats = {
    present: Array.from(attendance.values()).filter(s => s === 'present').length,
    absent: Array.from(attendance.values()).filter(s => s === 'absent').length,
    late: Array.from(attendance.values()).filter(s => s === 'late').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select date and class to mark attendance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Select Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedClass && students.length > 0 && (
          <>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Present: {stats.present}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Absent: {stats.absent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Late: {stats.late}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={markAllPresent}>
                  Mark All Present
                </Button>
                <Button size="sm" variant="outline" onClick={markAllAbsent}>
                  Mark All Absent
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading students...</div>
              ) : (
                students.map((student) => {
                  const currentStatus = attendance.get(student.id) || 'present';
                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(currentStatus)}
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Roll: {student.roll_number || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <RadioGroup
                        value={currentStatus}
                        onValueChange={(value) => handleStatusChange(student.id, value as any)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="present" id={`${student.id}-present`} />
                          <Label htmlFor={`${student.id}-present`} className="cursor-pointer">
                            Present
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="absent" id={`${student.id}-absent`} />
                          <Label htmlFor={`${student.id}-absent`} className="cursor-pointer">
                            Absent
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="late" id={`${student.id}-late`} />
                          <Label htmlFor={`${student.id}-late`} className="cursor-pointer">
                            Late
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </>
        )}

        {selectedClass && students.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            No students found in this class
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-12 text-muted-foreground">
            Please select a class to mark attendance
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceMarking;
