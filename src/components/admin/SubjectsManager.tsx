import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type Subject = Database['public']['Tables']['subjects']['Row'];
type Class = Database['public']['Tables']['classes']['Row'];

const SubjectsManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', class_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsResult, classesResult] = await Promise.all([
        supabase.from('subjects').select('*, classes(name)').order('name'),
        supabase.from('classes').select('*').order('name')
      ]);

      if (subjectsResult.error) throw subjectsResult.error;
      if (classesResult.error) throw classesResult.error;

      setSubjects(subjectsResult.data || []);
      setClasses(classesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update({ name: formData.name, description: formData.description, class_id: formData.class_id })
          .eq('id', editingSubject.id);

        if (error) throw error;
        toast.success('Subject updated successfully');
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert({ name: formData.name, description: formData.description, class_id: formData.class_id });

        if (error) throw error;
        toast.success('Subject created successfully');
      }

      setIsDialogOpen(false);
      setFormData({ name: '', description: '', class_id: '' });
      setEditingSubject(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save subject');
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ 
      name: subject.name, 
      description: subject.description || '', 
      class_id: subject.class_id 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Subject deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete subject');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingSubject(null);
    setFormData({ name: '', description: '', class_id: '' });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subjects Management</CardTitle>
            <CardDescription>Create and manage subjects</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={classes.length === 0}>
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
                <DialogDescription>
                  {editingSubject ? 'Update subject information' : 'Create a new subject'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSubject ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {classes.length === 0 
              ? 'Please create a class first before adding subjects.'
              : 'No subjects yet. Create your first subject.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{(subject as any).classes?.name}</TableCell>
                  <TableCell>{subject.description || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(subject)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectsManager;
