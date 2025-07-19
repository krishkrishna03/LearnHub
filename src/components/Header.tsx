import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Search, LogOut, BarChart3, Settings, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ChatDropdown from './ChatDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className={`transition-colors duration-200 ${
                isActive('/courses') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Courses
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors duration-200 ${
                isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className={`transition-colors duration-200 ${
                isActive('/pricing') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-200 ${
                isActive('/contact') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <ChatDropdown />
                <Link
                  to="/dashboard"
                  className={`p-2 transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  title="Dashboard"
                >
                  <BarChart3 className="w-5 h-5" />
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className={`p-2 transition-colors duration-200 ${
                        isActive('/admin') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                      }`}
                      title="Admin Panel"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/config"
                      className={`p-2 transition-colors duration-200 ${
                        isActive('/config') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                      }`}
                      title="Configuration"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/courses" 
                className={`block transition-colors duration-200 ${
                  isActive('/courses') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                to="/about" 
                className={`block transition-colors duration-200 ${
                  isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/pricing" 
                className={`block transition-colors duration-200 ${
                  isActive('/pricing') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className={`block transition-colors duration-200 ${
                  isActive('/contact') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <span className="text-sm text-gray-700">
                        {user.firstName} {user.lastName}
                      </span>
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                        <Link
                          to="/config"
                          className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Configuration
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
