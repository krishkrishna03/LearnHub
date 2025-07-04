import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'All Courses', href: '/courses' },
    { name: 'Web Development', href: '/courses' },
    { name: 'Data Science', href: '/courses' },
    { name: 'Mobile Development', href: '/courses' },
    { name: 'UI/UX Design', href: '/courses' },
    { name: 'Cybersecurity', href: '/courses' }
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/about' },
    { name: 'Careers', href: '/about' },
    { name: 'Press', href: '/about' },
    { name: 'Blog', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  const support = [
    { name: 'Help Center', href: '/contact' },
    { name: 'Student Support', href: '/contact' },
    { name: 'Instructor Support', href: '/contact' },
    { name: 'System Status', href: '/contact' },
    { name: 'Accessibility', href: '/contact' },
    { name: 'Terms of Service', href: '/contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LearnHub</span>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Empowering learners worldwide with high-quality education and expert-led courses. 
                Transform your career and unlock your potential with our comprehensive learning platform.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-blue-400" />
                  <span>support@learnhub.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-blue-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Courses</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                {support.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest course updates and learning tips delivered to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 lg:w-80"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-300 mb-4 md:mb-0">
              <p>&copy; 2024 LearnHub. All rights reserved.</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                    >
                      <IconComponent className="w-5 h-5 text-gray-300 hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
