import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, GraduationCap, Users, BookMarked, Award, Target, TrendingUp } from 'lucide-react';
import MouseGlow from '@/components/MouseGlow';
import TypingEffect from '@/components/TypingEffect';
import waveImage from '@/assets/wave.svg';
import studentImage from '@/assets/student.png';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-950 dark:via-gray-900 dark:to-purple-900 relative">
      <MouseGlow />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left space-y-8">
            <div 
              className="inline-flex items-center justify-center p-4 backdrop-blur-xl bg-white/10 dark:bg-purple-900/20 rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(147,51,234,0.37)] animate-fade-in"
            >
              <GraduationCap className="h-16 w-16 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 dark:from-purple-400 dark:via-purple-300 dark:to-purple-500">
              Graph Educations
            </h1>
            
            <div className="text-xl md:text-3xl text-gray-700 dark:text-gray-300 h-16 flex items-center">
              <TypingEffect 
                texts={[
                  'Excellence in Education',
                  'Build Your Future',
                  'Expert Teachers',
                  'Quality Learning'
                ]}
              />
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 animate-fade-in leading-relaxed">
              Join Graph Educations for comprehensive tuition classes with experienced teachers and proven results
            </p>
            
            <div className="flex gap-4 flex-wrap animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-8 py-6 gap-2 shadow-2xl border-0 rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                Enroll Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="backdrop-blur-xl bg-white/20 dark:bg-purple-900/20 border-2 border-purple-300/50 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 hover:bg-white/30 dark:hover:bg-purple-800/30 text-lg px-8 py-6 rounded-2xl transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* 3D Student Image */}
          <div className="relative h-[600px] animate-fade-in">
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <img 
                src={studentImage} 
                alt="Students" 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(147,51,234,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
              Our Courses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive curriculum designed for excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: BookMarked,
                title: 'Mathematics',
                description: 'From basics to advanced concepts with problem-solving techniques',
                delay: '0s',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Target,
                title: 'Science',
                description: 'Physics, Chemistry, and Biology with practical applications',
                delay: '0.2s',
                color: 'from-purple-600 to-purple-700'
              },
              {
                icon: TrendingUp,
                title: 'Competitive Exams',
                description: 'Special coaching for entrance exams and olympiads',
                delay: '0.4s',
                color: 'from-purple-700 to-purple-800'
              }
            ].map((course, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: course.delay }}
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
                  <div className={`inline-flex p-5 bg-gradient-to-br ${course.color} rounded-2xl mb-6 shadow-lg`}>
                    <course.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {course.description}
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
                About Graph Educations
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Graph Educations is committed to providing quality education with a focus on conceptual understanding and practical application. 
                Our experienced faculty and innovative teaching methods ensure students excel in their academic journey.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, text: '10+ Years of Excellence' },
                  { icon: Users, text: '1000+ Successful Students' },
                  { icon: Target, text: '95% Success Rate' }
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
                className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
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

      {/* Teachers Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
              Expert Teachers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn from experienced educators dedicated to your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Dr. Rajesh Kumar',
                subject: 'Mathematics',
                experience: '15 Years Experience',
                color: 'from-purple-500 to-purple-600'
              },
              {
                name: 'Prof. Priya Sharma',
                subject: 'Physics & Chemistry',
                experience: '12 Years Experience',
                color: 'from-purple-600 to-purple-700'
              },
              {
                name: 'Mr. Amit Verma',
                subject: 'Biology',
                experience: '10 Years Experience',
                color: 'from-purple-700 to-purple-800'
              }
            ].map((teacher, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div 
                  className="h-full p-8 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-purple-900/20 border border-white/20 dark:border-purple-500/20 shadow-[0_8px_32px_0_rgba(147,51,234,0.2)] hover:shadow-[0_8px_32px_0_rgba(147,51,234,0.4)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 text-center"
                >
                  <div className={`inline-flex p-8 bg-gradient-to-br ${teacher.color} rounded-full mb-6 shadow-lg`}>
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{teacher.name}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">{teacher.subject}</p>
                  <p className="text-gray-600 dark:text-gray-300">{teacher.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 rounded-3xl p-16 border border-white/20 shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600">
              Start Your Journey Today
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12">
              Join Graph Educations and unlock your potential
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl px-12 py-8 gap-3 shadow-2xl border-0 rounded-2xl transform hover:scale-105 transition-all duration-300"
            >
              Enroll Now
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Final Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-80">
          <img 
            src={waveImage} 
            alt="" 
            className="w-full h-full object-cover"
            style={{ 
              filter: 'hue-rotate(0deg) saturate(1.5)',
              animation: 'wave 20s ease-in-out infinite' 
            }}
          />
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
