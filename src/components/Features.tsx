import { 
  BookOpen, 
  Play, 
  Users, 
  Award, 
  Target, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Video,
  FileText,
  MessageCircle,
  Shield
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Video,
      title: 'Interactive Video Lessons',
      description: 'High-quality video content with pause, rewind, and note-taking capabilities.',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Personalized Learning Paths',
      description: 'AI-driven recommendations based on your skill level and learning goals.',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'Certificates & Badges',
      description: 'Earn industry-recognized certificates and showcase your achievements.',
      color: 'bg-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Connect with fellow learners, join study groups, and get peer support.',
      color: 'bg-orange-500'
    },
    {
      icon: CheckCircle,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and milestones.',
      color: 'bg-pink-500'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Learn at your own pace with offline access and mobile compatibility.',
      color: 'bg-indigo-500'
    },
    {
      icon: FileText,
      title: 'Rich Resources',
      description: 'Access downloadable materials, code samples, and reference guides.',
      color: 'bg-teal-500'
    },
    {
      icon: Shield,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience.',
      color: 'bg-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Master New Skills</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive learning platform provides all the tools and resources you need to succeed in your educational journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Advanced Learning Analytics</h3>
              <p className="text-blue-100 text-lg mb-6">
                Get detailed insights into your learning patterns, strengths, and areas for improvement with our AI-powered analytics dashboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Goal Setting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Smart Recommendations</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Weekly Progress</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[87%]"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-blue-100 text-sm">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">48h</div>
                    <div className="text-blue-100 text-sm">Studied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-blue-100 text-sm">Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
