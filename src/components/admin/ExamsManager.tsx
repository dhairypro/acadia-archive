import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, FileText, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Database } from '@/types/database';
import MarksEntry from './MarksEntry';

type Exam = Database['public']['Tables']['exams']['Row'];
type Class = Database['public']['Tables']['classes']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];

interface ExamWithDetails extends Exam {
  classes?: { name: string };
  exam_subjects?: Array<{
    id: string;
    subject_id: string;
    max_marks: number;
    subjects?: { name: string };
  }>;
}

interface SubjectSelection {
  subjectId: string;
  maxMarks: number;
}

const ExamsManager = () => {
  const [exams, setExams] = useState<ExamWithDetails[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamWithDetails | null>(null);
  const [selectedExamForMarks, setSelectedExamForMarks] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    exam_date: format(new Date(), 'yyyy-MM-dd'),
    class_id: '',
    description: '',
  });
  
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSelection[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsResult, classesResult] = await Promise.all([
        supabase
          .from('exams')
          .select('*, classes(name), exam_subjects(id, subject_id, max_marks, subjects(name))')
          .order('exam_date', { ascending: false }),
        supabase.from('classes').select('*').order('name'),
      ]);

      if (examsResult.error) throw examsResult.error;
      if (classesResult.error) throw classesResult.error;

      setExams(examsResult.data || []);
      setClasses(classesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectsForClass = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('class_id', classId)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  useEffect(() => {
    if (formData.class_id) {
      fetchSubjectsForClass(formData.class_id);
      setSelectedSubjects([]);
    }
  }, [formData.class_id]);

  const handleSubjectToggle = (subjectId: string) => {
    const exists = selectedSubjects.find(s => s.subjectId === subjectId);
    if (exists) {
      setSelectedSubjects(selectedSubjects.filter(s => s.subjectId !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, { subjectId, maxMarks: 100 }]);
    }
  };

  const handleMaxMarksChange = (subjectId: string, maxMarks: number) => {
    setSelectedSubjects(
      selectedSubjects.map(s => 
        s.subjectId === subjectId ? { ...s, maxMarks } : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    try {
      if (editingExam) {
        // Update exam
        const { error: examError } = await supabase
          .from('exams')
          .update({
            name: formData.name,
            exam_date: formData.exam_date,
            class_id: formData.class_id,
            description: formData.description,
          })
          .eq('id', editingExam.id);

        if (examError) throw examError;

        // Delete old exam subjects
        const { error: deleteError } = await supabase
          .from('exam_subjects')
          .delete()
          .eq('exam_id', editingExam.id);

        if (deleteError) throw deleteError;

        // Insert new exam subjects
        const { error: subjectsError } = await supabase
          .from('exam_subjects')
          .insert(
            selectedSubjects.map(s => ({
              exam_id: editingExam.id,
              subject_id: s.subjectId,
              max_marks: s.maxMarks,
            }))
          );

        if (subjectsError) throw subjectsError;

        toast.success('Exam updated successfully');
      } else {
        // Create new exam
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .insert({
            name: formData.name,
            exam_date: formData.exam_date,
            class_id: formData.class_id,
            description: formData.description,
          })
          .select()
          .single();

        if (examError) throw examError;

        // Insert exam subjects
        const { error: subjectsError } = await supabase
          .from('exam_subjects')
          .insert(
            selectedSubjects.map(s => ({
              exam_id: examData.id,
              subject_id: s.subjectId,
              max_marks: s.maxMarks,
            }))
          );

        if (subjectsError) throw subjectsError;

        toast.success('Exam created successfully');
      }

      handleDialogClose();
      fetchData();
    } catch (error: any) {
      console.error('Error saving exam:', error);
      toast.error(error.message || 'Failed to save exam');
    }
  };

  const handleEdit = (exam: ExamWithDetails) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      exam_date: exam.exam_date,
      class_id: exam.class_id,
      description: exam.description || '',
    });
    
    // Pre-populate selected subjects
    if (exam.exam_subjects) {
      setSelectedSubjects(
        exam.exam_subjects.map(es => ({
          subjectId: es.subject_id,
          maxMarks: es.max_marks,
        }))
      );
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam? All associated marks will also be deleted.')) {
      return;
    }

    try {
      const { error } = await supabase.from('exams').delete().eq('id', id);
      if (error) throw error;
      toast.success('Exam deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete exam');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingExam(null);
    setFormData({
      name: '',
      exam_date: format(new Date(), 'yyyy-MM-dd'),
      class_id: '',
      description: '',
    });
    setSelectedSubjects([]);
  };

  if (selectedExamForMarks) {
    return (
      <MarksEntry
        examId={selectedExamForMarks}
        onBack={() => setSelectedExamForMarks(null)}
      />
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Exams Management</CardTitle>
              <CardDescription>Create and manage exams and marks</CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={classes.length === 0}>
                <Plus className="h-4 w-4" />
                Add Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
                <DialogDescription>
                  {editingExam ? 'Update exam information' : 'Add a new exam with subjects and max marks'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Exam Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Mid-Term 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam_date">Exam Date</Label>
                    <Input
                      id="exam_date"
                      type="date"
                      value={formData.exam_date}
                      onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.class_id}
                    onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about the exam"
                  />
                </div>

                {formData.class_id && subjects.length > 0 && (
                  <div className="space-y-3">
                    <Label>Select Subjects & Max Marks</Label>
                    <div className="border rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                      {subjects.map((subject) => {
                        const selected = selectedSubjects.find(s => s.subjectId === subject.id);
                        return (
                          <div key={subject.id} className="flex items-center gap-3">
                            <Checkbox
                              checked={!!selected}
                              onCheckedChange={() => handleSubjectToggle(subject.id)}
                            />
                            <Label className="flex-1 cursor-pointer">
                              {subject.name}
                            </Label>
                            {selected && (
                              <Input
                                type="number"
                                min="1"
                                value={selected.maxMarks}
                                onChange={(e) => handleMaxMarksChange(subject.id, parseInt(e.target.value) || 100)}
                                className="w-24"
                                placeholder="Max"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingExam ? 'Update Exam' : 'Create Exam'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {classes.length === 0
              ? 'Please create a class first before adding exams.'
              : 'No exams yet. Create your first exam to get started.'}
          </div>
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{exam.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {exam.classes?.name}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Date: {format(new Date(exam.exam_date), 'PPP')}
                    </p>
                    {exam.description && (
                      <p className="text-sm text-muted-foreground mb-3">{exam.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {exam.exam_subjects?.map((es) => (
                        <span
                          key={es.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground"
                        >
                          {es.subjects?.name} ({es.max_marks} marks)
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedExamForMarks(exam.id)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Enter Marks
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(exam)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamsManager;
