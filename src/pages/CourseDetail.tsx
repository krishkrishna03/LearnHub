import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Lock,
  BookOpen,
  Award,
  Globe,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useCourse } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { course, loading, error } = useCourse(id!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course?.price === 0) {
      // Free course - direct enrollment
      try {
        setEnrolling(true);
        await axios.post(`/enrollments/${course._id}`);
        navigate(`/learn/${course._id}`);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to enroll in course');
      } finally {
        setEnrolling(false);
      }
    } else {
      // Paid course - show payment modal
      setShowPayment(true);
    }
  };

  const handlePayment = async () => {
    try {
      setEnrolling(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.post(`/enrollments/${course?._id}`);
      setShowPayment(false);
      navigate(`/learn/${course?._id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Payment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600">{error || 'Course not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.includes(course._id);
  const isFree = course.price === 0;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{course.rating.average}</span>
                  <span className="text-gray-300">({course.rating.count} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledStudents.length} students</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${course.instructor.firstName}+${course.instructor.lastName}&background=3b82f6&color=fff`}
                  alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                  <p className="text-gray-300">Course Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 sticky top-24">
                <div className="relative mb-6">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  {isFree ? (
                    <div className="text-3xl font-bold text-green-600">Free</div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold">${course.price}</span>
                      {course.originalPrice > 0 && (
                        <span className="text-lg text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/learn/${course._id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {enrolling ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {isFree ? <BookOpen className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        <span>{isFree ? 'Enroll for Free' : 'Buy Now'}</span>
                      </>
                    )}
                  </button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{course.duration} total</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>English</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span>Mobile & Desktop</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* What you'll learn */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content/Roadmap */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.lessons?.map((lesson: any, index: number) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                        {lesson.isPreview ? (
                          <Play className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Prerequisites</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">{course.title}</span>
                <span className="font-semibold">${course.price}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${course.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={enrolling}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {enrolling ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
