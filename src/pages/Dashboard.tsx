import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award,  
  Play,
  CheckCircle,
  BarChart3,
  Target,
  Star,
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface EnrolledCourse {
  _id: string;
  title: string;
  thumbnail: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface Certificate {
  _id: string;
  certificateId: string;
  courseName: string;
  completionDate: string;
  courseId: {
    title: string;
    thumbnail: string;
    category: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesResponse, certificatesResponse] = await Promise.all([
          axios.get('/enrollments/my-courses'),
          axios.get('/certificates/my-certificates')
        ]);

        const { enrolledCourses, progress } = coursesResponse.data;
        
        // Calculate progress for each course
        const coursesWithProgress = enrolledCourses.map((course: any) => {
          const courseProgress = progress.find((p: any) => 
            p.courseId._id === course._id
          );
          
          return {
            ...course,
            progress: courseProgress?.completionPercentage || 0,
            totalLessons: course.lessons?.length || 0,
            completedLessons: courseProgress?.lessonsCompleted?.length || 0
          };
        });

        setEnrolledCourses(coursesWithProgress);
        setCertificates(certificatesResponse.data.certificates || []);
        
        // Calculate stats
        const completedCourses = coursesWithProgress.filter(
          (course: any) => course.progress === 100
        ).length;
        
        setStats({
          totalCourses: coursesWithProgress.length,
          completedCourses,
          totalHours: coursesWithProgress.length * 10, // Estimate
          certificates: certificatesResponse.data.certificates?.length || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your learning journey and track your progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'certificates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Award className="w-5 h-5 inline mr-2" />
                Certificates
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* My Courses */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                    <Link 
                      to="/courses"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Browse More
                    </Link>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No courses yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start your learning journey by enrolling in a course.
                      </p>
                      <Link
                        to="/courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        Explore Courses
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div
                          key={course._id}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                by {course.instructor.firstName} {course.instructor.lastName}
                              </p>
                              <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${course.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <Link
                                  to={`/learn/${course._id}`}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                                >
                                  <Play className="w-4 h-4" />
                                  <span>Continue</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Learning Streak */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Learning Streak
                    </h3>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">7</span>
                      </div>
                      <p className="text-sm text-gray-600">Days in a row</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Keep it up! You're doing great.
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link
                        to="/courses"
                        className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
                      >
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-700 font-medium">Browse Courses</span>
                      </Link>
                      <button 
                        onClick={() => setActiveTab('certificates')}
                        className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 w-full"
                      >
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">View Certificates</span>
                      </button>
                      <button className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 w-full">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-700 font-medium">Learning Analytics</span>
                      </button>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Achievements
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">First Course</p>
                          <p className="text-xs text-gray-500">Enrolled in your first course</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Quick Learner</p>
                          <p className="text-xs text-gray-500">Completed 5 lessons in a day</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Certificates</h2>
                  <div className="text-sm text-gray-600">
                    {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned
                  </div>
                </div>

                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No certificates yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Complete courses to earn certificates and showcase your achievements.
                    </p>
                    <Link
                      to="/courses"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Start Learning
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <div
                        key={certificate._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {certificate.courseId.category}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {certificate.courseName}
                        </h3>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <p>Completed: {new Date(certificate.completionDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {certificate.certificateId}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // Re-download certificate logic here
                              window.open(`/verify/${certificate.certificateId}`, '_blank');
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/verify/${certificate.certificateId}`);
                              alert('Verification link copied to clipboard!');
                            }}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
