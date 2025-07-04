import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Martinez',
      role: 'Full Stack Developer',
      company: 'Tech Innovations Inc.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'The Full Stack Web Development course completely transformed my career. The hands-on projects and expert guidance helped me land my dream job within 3 months of completion.',
      course: 'Full Stack Web Development'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'Outstanding Python course! The instructors explain complex concepts clearly, and the practical exercises prepared me perfectly for real-world data science challenges.',
      course: 'Python for Data Science'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      role: 'UX Designer',
      company: 'Creative Studios',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'The UI/UX Design Masterclass exceeded my expectations. The portfolio projects I created during the course helped me secure multiple job offers. Highly recommended!',
      course: 'UI/UX Design Masterclass'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Mobile Developer',
      company: 'App Solutions Ltd.',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'Learning React Native through this platform was incredible. The step-by-step approach and real app building exercises gave me the confidence to become a mobile developer.',
      course: 'Mobile App Development'
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      role: 'Cloud Architect',
      company: 'CloudTech Solutions',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'The AWS course provided comprehensive cloud knowledge that directly applies to my daily work. The certification preparation was excellent and I passed on my first attempt.',
      course: 'Cloud Computing & AWS'
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Security Analyst',
      company: 'CyberSafe Corp',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      content: 'The cybersecurity course opened up a whole new career path for me. The practical labs and ethical hacking modules were particularly valuable for understanding real threats.',
      course: 'Cybersecurity Fundamentals'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from successful graduates who transformed their careers with our comprehensive courses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative"
            >
              <div className="absolute top-4 right-4 text-blue-100 group-hover:text-blue-200 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>

              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Course: {testimonial.course}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join 50,000+ Successful Students</h3>
            <p className="text-gray-600 mb-6">
              Ready to write your own success story? Start learning today and join thousands of students who have transformed their careers.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
