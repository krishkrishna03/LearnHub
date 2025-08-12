import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  BarChart3, 
  Save, 
  Upload, 
  X,
  FileText,
  MessageCircle,
  Bell,
  Send,
  Eye,
  Clock,
  Video,
  Image,
  Link,
  Loader2,
  Mail,
  Phone,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  duration: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  isPublished: boolean;
  isFeatured: boolean;
  lessons: Lesson[];
  enrolledStudents: string[];
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  isPreview: boolean;
  resources: Resource[];
}

interface Resource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'document' | 'code';
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enrolledCourses: string[];
  isActive: boolean;
}

interface ChatMessage {
  _id: string;
  sender: string;
  recipient: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  senderName: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  recipients: string[];
  createdAt: Date;
  isActive: boolean;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    thumbnail: '',
    duration: '',
    tags: '',
    prerequisites: '',
    learningOutcomes: '',
    isPublished: false,
    isFeatured: false
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
    isPreview: false,
    resources: [] as Resource[]
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
    isPreview: false,
    resources: [{ title: '', url: '', type: 'link' }]
  });

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    recipients: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, usersRes, messagesRes, notificationsRes] = await Promise.all([
        axios.get('/courses'),
        axios.get('/users'),
        axios.get('/chat/messages'),
        axios.get('/notifications')
      ]);

      setCourses(coursesRes.data.courses || []);
      setUsers(usersRes.data.users || []);
      setMessages(messagesRes.data.messages || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const courseData = {
        ...courseForm,
        tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        prerequisites: courseForm.prerequisites.split('\n').filter(p => p.trim()),
        learningOutcomes: courseForm.learningOutcomes.split('\n').filter(o => o.trim())
      };

      if (editingCourse) {
        await axios.put(`/courses/${editingCourse._id}`, courseData);
      } else {
        await axios.post('/courses', courseData);
      }

      setShowCourseModal(false);
      setEditingCourse(null);
      resetCourseForm();
      fetchData();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleCreateLesson = async () => {
    if (!editingCourse) return;

    try {
      const lessonData = {
        ...lessonForm,
        courseId: editingCourse._id
      };

      if (editingLesson) {
        await axios.put(`/lessons/${editingLesson._id}`, lessonData);
      } else {
        await axios.post('/lessons', lessonData);
      }

      setShowLessonModal(false);
      setEditingLesson(null);
      resetLessonForm();
      fetchData();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson');
    }
  };

  const handleAddLesson = async () => {
    if (!selectedCourseForLesson || !newLesson.title || !newLesson.videoUrl) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await axios.post('/lessons', {
        ...newLesson,
        courseId: selectedCourseForLesson._id,
        resources: newLesson.resources.filter(r => r.title && r.url)
      });
      
      setNewLesson({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1,
        isPreview: false,
        resources: [{ title: '', url: '', type: 'link' }]
      });
      setShowAddLesson(false);
      setSelectedCourseForLesson(null);
      fetchCourses();
      alert('Lesson added successfully!');
    } catch (error: any) {
      console.error('Error adding lesson:', error);
      alert(error.response?.data?.message || 'Failed to add lesson');
    }
  };

  const addLessonResource = () => {
    setNewLesson({
      ...newLesson,
      resources: [...newLesson.resources, { title: '', url: '', type: 'link' }]
    });
  };

  const removeLessonResource = (index: number) => {
    setNewLesson({
      ...newLesson,
      resources: newLesson.resources.filter((_, i) => i !== index)
    });
  };

  const updateLessonResource = (index: number, field: string, value: string) => {
    const updatedResources = newLesson.resources.map((resource, i) => 
      i === index ? { ...resource, [field]: value } : resource
    );
    setNewLesson({ ...newLesson, resources: updatedResources });
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    try {
      await axios.post('/chat/send', {
        recipient: selectedUser._id,
        message: newMessage
      });

      setNewMessage('');
      fetchData();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleSendNotification = async () => {
    try {
      await axios.post('/notifications', {
        ...notificationForm,
        recipients: notificationForm.recipients === 'all' ? [] : [notificationForm.recipients]
      });

      setShowNotificationModal(false);
      setNotificationForm({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all'
      });
      fetchData();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Web Development',
      level: 'Beginner',
      price: 0,
      thumbnail: '',
      duration: '',
      tags: '',
      prerequisites: '',
      learningOutcomes: '',
      isPublished: false,
      isFeatured: false
    });
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: 1,
      isPreview: false,
      resources: []
    });
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      category: course.category,
      level: course.level,
      price: course.price,
      thumbnail: course.thumbnail,
      duration: course.duration,
      tags: course.tags.join(', '),
      prerequisites: course.prerequisites.join('\n'),
      learningOutcomes: course.learningOutcomes.join('\n'),
      isPublished: course.isPublished,
      isFeatured: course.isFeatured
    });
    setShowCourseModal(true);
  };

  const deleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/courses/${courseId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const addResource = () => {
    setLessonForm({
      ...lessonForm,
      resources: [...lessonForm.resources, { title: '', url: '', type: 'link' }]
    });
  };

  const updateResource = (index: number, field: keyof Resource, value: string) => {
    const updatedResources = [...lessonForm.resources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setLessonForm({ ...lessonForm, resources: updatedResources });
  };

  const removeResource = (index: number) => {
    const updatedResources = lessonForm.resources.filter((_, i) => i !== index);
    setLessonForm({ ...lessonForm, resources: updatedResources });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage courses, users, and communications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'messages', label: 'Messages', icon: MessageCircle },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Course</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.shortDescription}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{course.category}</span>
                        <span>{course.level}</span>
                        <span>${course.price}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{course.lessons?.length || 0} lessons</span>
                        <span>{course.enrolledStudents.length} students</span>
                        <span className={`px-2 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => editCourse(course)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourseForLesson(course);
                            setShowAddLesson(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          Add Lesson
                        </button>
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setShowLessonModal(true);
                          }}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Lessons
                        </button>
                        <button
                          onClick={() => deleteCourse(course._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Messages & Communication</h2>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Chat with Students</h3>
                  <p className="text-blue-700 mb-4">
                    Use the chat icon in the header to communicate directly with students. 
                    You can send messages and receive replies in real-time.
                  </p>
                  <div className="text-sm text-blue-600">
                    💬 Click the message icon in the top navigation to start chatting
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Courses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                  {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'instructor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.enrolledCourses?.length || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {users.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Yet</h3>
                      <p className="text-gray-600">Users will appear here once they register for your platform.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h3>
                        <p className="text-gray-600">{selectedUser.email}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          selectedUser.role === 'instructor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedUser.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Joined:</span>
                            <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium">{new Date(selectedUser.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Learning Progress</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Enrolled Courses:</span>
                            <span className="font-medium">{selectedUser.enrolledCourses?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Progress Records:</span>
                            <span className="font-medium">{selectedUser.progress?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>New Message</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message._id} className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                        {!message.isRead && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Unread
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Send Notification</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification._id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.type === 'success' ? 'bg-green-100 text-green-800' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <div className="text-xs text-gray-500">
                        Sent: {new Date(notification.createdAt).toLocaleString()} | 
                        Recipients: {notification.recipients.length === 0 ? 'All users' : `${notification.recipients.length} users`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Enrollments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0)}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Messages</p>
                        <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                      </div>
                      <MessageCircle className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowCourseModal(false);
                    setEditingCourse(null);
                    resetCourseForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                    <textarea
                      value={courseForm.shortDescription}
                      onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description for course cards"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed course description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                      <input
                        type="number"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 10 hours"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL *</label>
                    <input
                      type="url"
                      value={courseForm.thumbnail}
                      onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    {courseForm.thumbnail && (
                      <img
                        src={courseForm.thumbnail}
                        alt="Thumbnail preview"
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Trailer/Preview Video URL
                    </label>
                    <input
                      type="url"
                      value={courseForm.previewVideo || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, previewVideo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=... or direct video URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={courseForm.tags}
                      onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, JavaScript, Frontend"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites (one per line)</label>
                    <textarea
                      value={courseForm.prerequisites}
                      onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Basic HTML knowledge&#10;JavaScript fundamentals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes (one per line)</label>
                    <textarea
                      value={courseForm.learningOutcomes}
                      onChange={(e) => setCourseForm({ ...courseForm, learningOutcomes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Build modern web applications&#10;Master React components"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={courseForm.isPublished}
                        onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                        Published (visible to students)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={courseForm.isFeatured}
                        onChange={(e) => setCourseForm({ ...courseForm, isFeatured: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                        Featured (show on homepage)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowCourseModal(false);
                    setEditingCourse(null);
                    resetCourseForm();
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Modal */}
        {showLessonModal && editingCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Lessons - {editingCourse.title}
                </h2>
                <button
                  onClick={() => {
                    setShowLessonModal(false);
                    setEditingLesson(null);
                    resetLessonForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Existing Lessons */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Lessons</h3>
                <div className="space-y-3">
                  {editingCourse.lessons?.map((lesson, index) => (
                    <div key={lesson._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {lesson.order}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setLessonForm({
                              title: lesson.title,
                              description: lesson.description,
                              videoUrl: lesson.videoUrl,
                              duration: lesson.duration,
                              order: lesson.order,
                              isPreview: lesson.isPreview,
                              resources: lesson.resources || []
                            });
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No lessons yet</p>}
                </div>
              </div>

              {/* Add/Edit Lesson Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter lesson title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={lessonForm.description}
                        onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Lesson description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                      <input
                        type="url"
                        value={lessonForm.videoUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=... or video file URL"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                        <input
                          type="text"
                          value={lessonForm.duration}
                          onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 15:30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order *</label>
                        <input
                          type="number"
                          value={lessonForm.order}
                          onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPreview"
                        checked={lessonForm.isPreview}
                        onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-700">
                        Free preview (accessible without enrollment)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Resources</label>
                        <button
                          onClick={addResource}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Resource</span>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {lessonForm.resources.map((resource, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                value={resource.title}
                                onChange={(e) => updateResource(index, 'title', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Resource title"
                              />
                              <select
                                value={resource.type}
                                onChange={(e) => updateResource(index, 'type', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="link">Link</option>
                                <option value="pdf">PDF</option>
                                <option value="document">Document</option>
                                <option value="code">Code</option>
                              </select>
                            </div>
                            <div className="flex space-x-2">
                              <input
                                type="url"
                                value={resource.url}
                                onChange={(e) => updateResource(index, 'url', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Resource URL"
                              />
                              <button
                                onClick={() => removeResource(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => {
                      setEditingLesson(null);
                      resetLessonForm();
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLesson}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    {editingLesson ? 'Update Lesson' : 'Add Lesson'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showAddLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add Lesson to: {selectedCourseForLesson?.title}
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Introduction to React - Part 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Order
                    </label>
                    <input
                      type="number"
                      value={newLesson.order}
                      onChange={(e) => setNewLesson({ ...newLesson, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL * (YouTube, Vimeo, or Direct Video Link)
                  </label>
                  <input
                    type="url"
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What will students learn in this lesson?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (e.g., 15:30)
                  </label>
                  <input
                    type="text"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15:30"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPreview"
                    checked={newLesson.isPreview}
                    onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPreview" className="ml-2 block text-sm text-gray-700">
                    Free Preview (students can watch without enrolling)
                  </label>
                </div>

                {/* Lesson Resources */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Lesson Resources (PDFs, Links, Code, etc.)
                    </label>
                    <button
                      type="button"
                      onClick={addLessonResource}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Resource
                    </button>
                  </div>
                  
                  {newLesson.resources.map((resource, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={resource.title}
                          onChange={(e) => updateLessonResource(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Resource title"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="url"
                          value={resource.url}
                          onChange={(e) => updateLessonResource(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Resource URL"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={resource.type}
                          onChange={(e) => updateLessonResource(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="link">Link</option>
                          <option value="pdf">PDF</option>
                          <option value="document">Document</option>
                          <option value="code">Code</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeLessonResource(index)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-2 rounded text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowAddLesson(false);
                    setSelectedCourseForLesson(null);
                    setNewLesson({
                      title: '',
                      description: '',
                      videoUrl: '',
                      duration: '',
                      order: 1,
                      isPreview: false,
                      resources: [{ title: '', url: '', type: 'link' }]
                    });
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLesson}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Add Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedUser ? `Message ${selectedUser.firstName} ${selectedUser.lastName}` : 'Send Message'}
                </h2>
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedUser(null);
                    setNewMessage('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!selectedUser && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                  <select
                    onChange={(e) => {
                      const user = users.find(u => u._id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {users.filter(u => u.role !== 'admin').map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedUser(null);
                    setNewMessage('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!selectedUser || !newMessage.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notification message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <select
                      value={notificationForm.recipients}
                      onChange={(e) => setNotificationForm({ ...notificationForm, recipients: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      {users.filter(u => u.role !== 'admin').map(user => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Bell className="w-5 h-5" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
