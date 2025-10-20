import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Video, Link2, StickyNote, Download, ExternalLink } from 'lucide-react';
import { Database } from '@/types/database';

type File = Database['public']['Tables']['files']['Row'];
type Chapter = Database['public']['Tables']['chapters']['Row'];

const ChapterView = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [chapterId, user]);

  const fetchData = async () => {
    try {
      const [chapterResult, filesResult] = await Promise.all([
        supabase.from('chapters').select('*, subjects(id, name, class_id)').eq('id', chapterId).single(),
        supabase.from('files').select('*').eq('chapter_id', chapterId).order('name')
      ]);

      if (chapterResult.error) throw chapterResult.error;
      if (filesResult.error) throw filesResult.error;

      setChapterData(chapterResult.data);
      setFiles(filesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <Link2 className="h-5 w-5" />;
      case 'note':
        return <StickyNote className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'video':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'link':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'note':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(`/subject/${(chapterData as any)?.subjects?.id}`)}
          variant="ghost"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subject
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{chapterData?.name}</h1>
          {chapterData?.description && (
            <p className="text-muted-foreground text-lg">{chapterData.description}</p>
          )}
        </div>

        {files.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-3 rounded-lg ${getFileTypeColor(file.file_type)}`}>
                        {getFileIcon(file.file_type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{file.name}</CardTitle>
                        {file.description && (
                          <CardDescription>{file.description}</CardDescription>
                        )}
                        <Badge className={`mt-2 ${getFileTypeColor(file.file_type)}`}>
                          {file.file_type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open
                      </Button>
                      {file.file_type === 'pdf' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.file_url;
                            link.download = file.name;
                            link.click();
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterView;
