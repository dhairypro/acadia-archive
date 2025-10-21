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
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type File = Database['public']['Tables']['files']['Row'];
type Chapter = Database['public']['Tables']['chapters']['Row'];

const FilesManager = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    chapter_id: '',
    file_type: 'pdf' as 'pdf' | 'video' | 'link' | 'note',
    file_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [filesResult, chaptersResult] = await Promise.all([
        supabase.from('files').select('*, chapters(name)').order('name'),
        supabase.from('chapters').select('*').order('name')
      ]);

      if (filesResult.error) throw filesResult.error;
      if (chaptersResult.error) throw chaptersResult.error;

      setFiles(filesResult.data || []);
      setChapters(chaptersResult.data || []);
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
      if (editingFile) {
        const { error } = await supabase
          .from('files')
          .update(formData)
          .eq('id', editingFile.id);

        if (error) throw error;
        toast.success('File updated successfully');
      } else {
        const { error } = await supabase
          .from('files')
          .insert(formData);

        if (error) throw error;
        toast.success('File created successfully');
      }

      setIsDialogOpen(false);
      setFormData({ name: '', description: '', chapter_id: '', file_type: 'pdf', file_url: '' });
      setEditingFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save file');
    }
  };

  const handleEdit = (file: File) => {
    setEditingFile(file);
    setFormData({ 
      name: file.name, 
      description: file.description || '', 
      chapter_id: file.chapter_id,
      file_type: file.file_type,
      file_url: file.file_url
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error } = await supabase.from('files').delete().eq('id', id);
      if (error) throw error;
      toast.success('File deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete file');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFile(null);
    setFormData({ name: '', description: '', chapter_id: '', file_type: 'pdf', file_url: '' });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Files Management</CardTitle>
            <CardDescription>Create and manage files</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (open) setIsDialogOpen(true);
            else handleDialogClose();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={chapters.length === 0}>
                <Plus className="h-4 w-4" />
                Add File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingFile ? 'Edit File' : 'Add New File'}</DialogTitle>
                <DialogDescription>
                  {editingFile ? 'Update file information' : 'Create a new file'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Select
                    value={formData.chapter_id}
                    onValueChange={(value) => setFormData({ ...formData, chapter_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file_type">File Type</Label>
                  <Select
                    value={formData.file_type}
                    onValueChange={(value: any) => setFormData({ ...formData, file_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">File Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Chapter 1 Notes"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file_url">File URL</Label>
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    placeholder="https://..."
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
                    {editingFile ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {chapters.length === 0 
              ? 'Please create a chapter first before adding files.'
              : 'No files yet. Create your first file.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{(file as any).chapters?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.file_type.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <a 
                      href={file.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(file)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(file.id)}>
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

export default FilesManager;
