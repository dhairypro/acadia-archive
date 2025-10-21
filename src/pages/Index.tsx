import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Shield, Search, Upload, Sparkles, Layers, Lock } from 'lucide-react';
import MouseGlow from '@/components/MouseGlow';
import TypingEffect from '@/components/TypingEffect';
import waveImage from '@/assets/wave.svg';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900 relative overflow-hidden">
      <MouseGlow />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto text-center relative z-10">
          <div 
            className="inline-flex items-center justify-center p-6 backdrop-blur-xl bg-white/10 dark:bg-purple-900/20 rounded-3xl mb-8 border border-white/20 shadow-[0_8px_32px_0_rgba(147,51,234,0.37)] animate-fade-in"
            style={{ 
              transform: 'perspective(1000px) rotateX(5deg)',
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            <BookOpen className="h-20 w-20 text-purple-600 dark:text-purple-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500">
            Dharamgunj Resource Hub
          </h1>
          
          <div className="text-2xl md:text-4xl text-gray-700 dark:text-gray-300 mb-4 h-20 flex items-center justify-center">
            <TypingEffect 
              texts={[
                'Organize Your Studies',
                'Access Materials Anytime',
                'Learn Smarter, Not Harder',
                'Your Digital Library'
              ]}
            />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-fade-in">
            Your centralized platform for accessing study materials, organized by class, subject, and chapter
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl px-10 py-8 gap-3 shadow-2xl border-0 rounded-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="backdrop-blur-xl bg-white/20 dark:bg-purple-900/20 border-2 border-purple-300/50 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 hover:bg-white/30 dark:hover:bg-purple-800/30 text-xl px-10 py-8 rounded-2xl transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-60">
          <img 
            src={waveImage} 
            alt="" 
            className="w-full h-full object-cover animate-[wave_20s_ease-in-out_infinite]"
            style={{ animation: 'wave 20s ease-in-out infinite' }}
          />
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Organized, accessible, and always up-to-date with cutting-edge features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Search,
                title: 'Easy Navigation',
                description: 'Browse materials organized by class, subject, and chapter for quick access',
                delay: '0s',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Upload,
                title: 'Multiple Formats',
                description: 'Access PDFs, videos, notes, and external links all in one place',
                delay: '0.2s',
                color: 'from-purple-600 to-purple-700'
              },
              {
                icon: Shield,
                title: 'Always Updated',
                description: 'Content is managed by admins and automatically syncs across all users',
                delay: '0.4s',
                color: 'from-purple-700 to-purple-800'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: feature.delay }}
              >
                <div 
                  className="h-full p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-purple-900/20 border border-white/20 dark:border-purple-500/20 shadow-[0_8px_32px_0_rgba(147,51,234,0.2)] hover:shadow-[0_8px_32px_0_rgba(147,51,234,0.4)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                  style={{
                    transform: 'perspective(1000px) rotateX(0deg)',
                    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                  }}
                >
                  <div className={`inline-flex p-5 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
                About Our Platform
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Dharamgunj Resource Hub is designed to revolutionize how students access and organize their study materials. 
                Built with modern technology and a student-first approach, we make learning more accessible and efficient.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: 'Intelligent organization system' },
                  { icon: Layers, text: 'Multi-level content hierarchy' },
                  { icon: Lock, text: 'Secure and reliable platform' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl backdrop-blur-xl bg-white/30 dark:bg-purple-900/20 border border-white/20">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[500px] animate-fade-in">
              <div 
                className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-3xl border border-white/20 shadow-2xl"
                style={{
                  transform: 'perspective(1000px) rotateY(-10deg)',
                  animation: 'float 8s ease-in-out infinite'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <BookOpen className="h-48 w-48 text-purple-600/30 dark:text-purple-400/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-3xl p-16 border border-white/20 shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
              Ready to start learning?
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12">
              Join now and get instant access to all study materials
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl px-12 py-8 gap-3 shadow-2xl border-0 rounded-2xl transform hover:scale-105 transition-all duration-300"
            >
              Create Free Account
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: perspective(1000px) rotateX(5deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateX(5deg) translateY(-20px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-5%) translateY(-5px); }
          50% { transform: translateX(-10%) translateY(0); }
          75% { transform: translateX(-5%) translateY(5px); }
        }
      `}</style>
    </div>
  );
};

export default Index;
