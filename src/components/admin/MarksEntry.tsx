import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface MarksEntryProps {
  examId: string;
  onBack: () => void;
}

interface ExamSubject {
  id: string;
  subject_id: string;
  max_marks: number;
  subjects?: { name: string };
}

interface StudentMark {
  id: string;
  user_id: string;
  exam_subject_id: string;
  marks_obtained: number | null;
  profiles?: {
    full_name: string;
    roll_number: string | null;
  };
}

const MarksEntry = ({ examId, onBack }: MarksEntryProps) => {
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [marksData, setMarksData] = useState<Map<string, number | null>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
    fetchExamSubjects();
  }, [examId]);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudentMarks();
    }
  }, [selectedSubject]);

  const fetchExamSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_subjects')
        .select('*, subjects(name)')
        .eq('exam_id', examId);

      if (error) throw error;
      setExamSubjects(data || []);
      
      if (data && data.length > 0) {
        setSelectedSubject(data[0].id);
        setMaxMarks(data[0].max_marks);
      }
    } catch (error) {
      console.error('Error fetching exam subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchStudentMarks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_marks')
        .select('*, profiles(full_name, roll_number)')
        .eq('exam_subject_id', selectedSubject)
        .order('profiles(full_name)');

      if (error) throw error;
      
      setStudentMarks(data || []);
      
      // Pre-populate marks map
      const marks = new Map<string, number | null>();
      data?.forEach((mark) => {
        marks.set(mark.id, mark.marks_obtained);
      });
      setMarksData(marks);
      
      // Update max marks
      const subject = examSubjects.find(s => s.id === selectedSubject);
      if (subject) setMaxMarks(subject.max_marks);
    } catch (error) {
      console.error('Error fetching student marks:', error);
      toast.error('Failed to fetch student marks');
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (markId: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    if (numValue !== null && (numValue < 0 || numValue > maxMarks)) {
      toast.error(`Marks must be between 0 and ${maxMarks}`);
      return;
    }
    
    setMarksData(new Map(marksData.set(markId, numValue)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Array.from(marksData.entries()).map(([id, marks]) => ({
        id,
        marks_obtained: marks,
      }));

      const { error } = await supabase
        .from('student_marks')
        .upsert(updates);

      if (error) throw error;

      toast.success('Marks saved successfully');
      fetchStudentMarks();
    } catch (error: any) {
      console.error('Error saving marks:', error);
      toast.error(error.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    const subject = examSubjects.find(s => s.id === subjectId);
    if (subject) setMaxMarks(subject.max_marks);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enter Marks</CardTitle>
            <CardDescription>Enter or edit student marks for this exam</CardDescription>
          </div>
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Exams
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Subject</label>
          <Select value={selectedSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {examSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.subjects?.name} (Max: {subject.max_marks})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading students...</div>
        ) : studentMarks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No students found for this exam
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-right">Marks (out of {maxMarks})</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentMarks.map((mark) => (
                    <TableRow key={mark.id}>
                      <TableCell>{mark.profiles?.roll_number || 'N/A'}</TableCell>
                      <TableCell className="font-medium">{mark.profiles?.full_name}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={marksData.get(mark.id) ?? ''}
                          onChange={(e) => handleMarksChange(mark.id, e.target.value)}
                          className="w-24 ml-auto"
                          placeholder="0"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save All Marks'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarksEntry;
