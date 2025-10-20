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

type Chapter = Database['public']['Tables']['chapters']['Row'];
type Subject = Database['public']['Tables']['subjects']['Row'];

const ChaptersManager = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', subject_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chaptersResult, subjectsResult] = await Promise.all([
        supabase.from('chapters').select('*, subjects(name)').order('name'),
        supabase.from('subjects').select('*').order('name')
      ]);

      if (chaptersResult.error) throw chaptersResult.error;
      if (subjectsResult.error) throw subjectsResult.error;

      setChapters(chaptersResult.data || []);
      setSubjects(subjectsResult.data || []);
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
      if (editingChapter) {
        const { error } = await supabase
          .from('chapters')
          .update({ name: formData.name, description: formData.description, subject_id: formData.subject_id })
          .eq('id', editingChapter.id);

        if (error) throw error;
        toast.success('Chapter updated successfully');
      } else {
        const { error } = await supabase
          .from('chapters')
          .insert({ name: formData.name, description: formData.description, subject_id: formData.subject_id });

        if (error) throw error;
        toast.success('Chapter created successfully');
      }

      setIsDialogOpen(false);
      setFormData({ name: '', description: '', subject_id: '' });
      setEditingChapter(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save chapter');
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({ 
      name: chapter.name, 
      description: chapter.description || '', 
      subject_id: chapter.subject_id 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    try {
      const { error } = await supabase.from('chapters').delete().eq('id', id);
      if (error) throw error;
      toast.success('Chapter deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete chapter');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingChapter(null);
    setFormData({ name: '', description: '', subject_id: '' });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chapters Management</CardTitle>
            <CardDescription>Create and manage chapters</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={subjects.length === 0}>
                <Plus className="h-4 w-4" />
                Add Chapter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
                <DialogDescription>
                  {editingChapter ? 'Update chapter information' : 'Create a new chapter'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={formData.subject_id}
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Chapter Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Introduction to Algebra"
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
                    {editingChapter ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {chapters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {subjects.length === 0 
              ? 'Please create a subject first before adding chapters.'
              : 'No chapters yet. Create your first chapter.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">{chapter.name}</TableCell>
                  <TableCell>{(chapter as any).subjects?.name}</TableCell>
                  <TableCell>{chapter.description || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(chapter)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(chapter.id)}>
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

export default ChaptersManager;
