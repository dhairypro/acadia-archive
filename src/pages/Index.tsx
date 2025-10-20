import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Shield, Search, Upload } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-accent to-secondary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-3xl mb-6">
            <BookOpen className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Dharamgunj Resource Hub
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your centralized platform for accessing study materials, organized by class, subject, and chapter
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 gap-2 shadow-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Organized, accessible, and always up-to-date
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Navigation</h3>
              <p className="text-muted-foreground">
                Browse materials organized by class, subject, and chapter for quick access
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex p-4 bg-accent/10 rounded-2xl mb-4">
                <Upload className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Formats</h3>
              <p className="text-muted-foreground">
                Access PDFs, videos, notes, and external links all in one place
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
              <div className="inline-flex p-4 bg-secondary/10 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Always Updated</h3>
              <p className="text-muted-foreground">
                Content is managed by admins and automatically syncs across all users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join now and get instant access to all study materials
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-6 gap-2"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
