import { Users, BookOpen, Award, Globe } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Students',
      description: 'Learning and growing every day',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      value: '500+',
      label: 'Expert Courses',
      description: 'Across multiple domains',
      color: 'bg-emerald-500'
    },
    {
      icon: Award,
      value: '25,000+',
      label: 'Certificates Issued',
      description: 'Professional achievements',
      color: 'bg-purple-500'
    },
    {
      icon: Globe,
      value: '120+',
      label: 'Countries Reached',
      description: 'Global learning community',
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Learners <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a global community of learners who are transforming their careers and lives through education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-gray-800 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Join Our Learning Community?</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Start your learning journey today and become part of our success stories. With expert instructors and comprehensive courses, your goals are within reach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105">
              Browse Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
