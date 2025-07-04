import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  X,

  HelpCircle,
  Video,
  Image,

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
  isPublished: boolean;
  isFeatured: boolean;
  lessons: any[];
}

interface Lesson {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  videoUrl: string;
  duration: string;
  isPreview: boolean;
}

interface Quiz {
  _id: string;
  title: string;
  lessonId: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  passingScore: number;
  timeLimit: number;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

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
    isPublished: false,
    isFeatured: false
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 1,
    videoUrl: '',
    duration: '',
    isPreview: false
  });

  const [quizForm, setQuizForm] = useState({
    title: '',
    lessonId: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ],
    passingScore: 70,
    timeLimit: 30
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCourses();
      fetchQuizzes();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/courses');
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/quizzes');
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Simulate file upload to cloud storage (you would replace this with actual upload logic)
  const uploadFile = async (file: File, type: 'video' | 'image'): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate upload delay
      setTimeout(() => {
        // In a real app, you would upload to AWS S3, Cloudinary, etc.
        // For demo purposes, we'll create a mock URL
        const mockUrl = type === 'video' 
          ? `https://example.com/videos/${file.name.replace(/\s+/g, '_')}`
          : `https://example.com/images/${file.name.replace(/\s+/g, '_')}`;
        resolve(mockUrl);
      }, 2000);
    });
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file size must be less than 500MB');
      return;
    }

    try {
      setUploadingVideo(true);
      const videoUrl = await uploadFile(file, 'video');
      setLessonForm({ ...lessonForm, videoUrl });
      alert('Video uploaded successfully!');
    } catch (error) {
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB');
      return;
    }

    try {
      setUploadingThumbnail(true);
      const thumbnailUrl = await uploadFile(file, 'image');
      setCourseForm({ ...courseForm, thumbnail: thumbnailUrl });
      alert('Thumbnail uploaded successfully!');
    } catch (error) {
      alert('Failed to upload thumbnail. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const courseData = {
        ...courseForm,
        tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingCourse) {
        await axios.put(`/courses/${editingCourse._id}`, courseData);
      } else {
        await axios.post('/courses', courseData);
      }

      setShowCourseModal(false);
      setEditingCourse(null);
      resetCourseForm();
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving course');
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await axios.put(`/lessons/${editingLesson._id}`, lessonForm);
      } else {
        await axios.post('/lessons', lessonForm);
      }

      setShowLessonModal(false);
      setEditingLesson(null);
      resetLessonForm();
      fetchCourses(); // Refresh to get updated lessons
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving lesson');
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        await axios.put(`/quizzes/${editingQuiz._id}`, quizForm);
      } else {
        await axios.post('/quizzes', quizForm);
      }

      setShowQuizModal(false);
      setEditingQuiz(null);
      resetQuizForm();
      fetchQuizzes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving quiz');
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This will also delete all associated lessons and quizzes.')) {
      try {
        await axios.delete(`/courses/${courseId}`);
        fetchCourses();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting course');
      }
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await axios.delete(`/lessons/${lessonId}`);
        fetchCourses();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting lesson');
      }
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/quizzes/${quizId}`);
        fetchQuizzes();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting quiz');
      }
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
      isPublished: false,
      isFeatured: false
    });
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      courseId: '',
      order: 1,
      videoUrl: '',
      duration: '',
      isPreview: false
    });
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      lessonId: '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ],
      passingScore: 70,
      timeLimit: 30
    });
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      ...course,
      tags: course.tags.join(', ')
    });
    setShowCourseModal(true);
  };

  const editLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm(lesson);
    setShowLessonModal(true);
  };

  const editQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizForm(quiz);
    setShowQuizModal(true);
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...quizForm.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }
    setQuizForm({ ...quizForm, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    if (quizForm.questions.length > 1) {
      const updatedQuestions = quizForm.questions.filter((_, i) => i !== index);
      setQuizForm({ ...quizForm, questions: updatedQuestions });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage courses, lessons, quizzes, and platform content.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Courses
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'lessons'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Video className="w-5 h-5 inline mr-2" />
                Lessons
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quizzes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <HelpCircle className="w-5 h-5 inline mr-2" />
                Quizzes
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Courses</h2>
                  <button
                    onClick={() => {
                      resetCourseForm();
                      setShowCourseModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {courses.map((course) => (
                    <div key={course._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4 mb-4">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                              <p className="text-gray-600 mb-4">{course.shortDescription}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                <span>{course.category}</span>
                                <span>{course.level}</span>
                                <span>${course.price}</span>
                                <span>{course.lessons?.length || 0} lessons</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Course Lessons */}
                          {course.lessons && course.lessons.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">Lessons:</h4>
                              <div className="space-y-2">
                                {course.lessons.map((lesson: any, index: number) => (
                                  <div key={lesson._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                    <div>
                                      <span className="font-medium">{index + 1}. {lesson.title}</span>
                                      <span className="text-sm text-gray-500 ml-2">({lesson.duration})</span>
                                      {lesson.isPreview && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2">
                                          Preview
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => editLesson(lesson)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteLesson(lesson._id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              resetLessonForm();
                              setLessonForm(prev => ({ ...prev, courseId: course._id }));
                              setShowLessonModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Add Lesson"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => editCourse(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Lessons</h2>
                  <button
                    onClick={() => {
                      resetLessonForm();
                      setShowLessonModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {courses.map((course) => 
                    course.lessons?.map((lesson: any) => (
                      <div key={lesson._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                            <p className="text-gray-600 mb-2">{lesson.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Course: {course.title}</span>
                              <span>Order: {lesson.order}</span>
                              <span>Duration: {lesson.duration}</span>
                              {lesson.isPreview && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Preview
                                </span>
                              )}
                            </div>
                            {lesson.videoUrl && (
                              <div className="mt-2 text-sm text-gray-500">
                                <Video className="w-4 h-4 inline mr-1" />
                                Video: {lesson.videoUrl}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editLesson(lesson)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteLesson(lesson._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Quizzes</h2>
                  <button
                    onClick={() => {
                      resetQuizForm();
                      setShowQuizModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Quiz</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{quiz.questions.length} questions</span>
                            <span>{quiz.timeLimit} minutes</span>
                            <span>{quiz.passingScore}% passing score</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editQuiz(quiz)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteQuiz(quiz._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Modal */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowCourseModal(false);
                    setEditingCourse(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCourseSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <input
                    type="text"
                    required
                    value={courseForm.shortDescription}
                    onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
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
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 8 weeks"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                  <div className="space-y-4">
                    <input
                      type="url"
                      value={courseForm.thumbnail}
                      onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                      placeholder="Enter thumbnail URL or upload image below"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">OR</span>
                      <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          disabled={uploadingThumbnail}
                        />
                        {uploadingThumbnail ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          <Image className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {uploadingThumbnail ? 'Uploading...' : 'Upload Image'}
                        </span>
                      </label>
                    </div>

                    {courseForm.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={courseForm.thumbnail}
                          alt="Course thumbnail preview"
                          className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={courseForm.tags}
                    onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                    placeholder="e.g., React, JavaScript, Frontend"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={courseForm.isPublished}
                      onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Published</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={courseForm.isFeatured}
                      onChange={(e) => setCourseForm({ ...courseForm, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCourseModal(false);
                      setEditingCourse(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lesson Modal */}
        {showLessonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h2>
                <button
                  onClick={() => {
                    setShowLessonModal(false);
                    setEditingLesson(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLessonSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select
                    required
                    value={lessonForm.courseId}
                    onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 15 minutes"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Video</label>
                  <div className="space-y-4">
                    <input
                      type="url"
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                      placeholder="Enter video URL or upload video below"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">OR</span>
                      <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          disabled={uploadingVideo}
                        />
                        {uploadingVideo ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                          <Video className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="text-sm text-gray-600">
                          {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                        </span>
                      </label>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>• Supported formats: MP4, WebM, MOV</p>
                      <p>• Maximum file size: 500MB</p>
                      <p>• Recommended resolution: 1080p or higher</p>
                    </div>

                    {lessonForm.videoUrl && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">Video URL set: {lessonForm.videoUrl}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lessonForm.isPreview}
                      onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Preview Lesson (Free to watch)</span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonModal(false);
                      setEditingLesson(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!lessonForm.videoUrl}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold"
                  >
                    {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {showQuizModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}
                </h2>
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    setEditingQuiz(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuizSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson (Optional)</label>
                  <select
                    value={quizForm.lessonId}
                    onChange={(e) => setQuizForm({ ...quizForm, lessonId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a lesson (optional)</option>
                    {courses.map((course) =>
                      course.lessons?.map((lesson: any) => (
                        <option key={lesson._id} value={lesson._id}>
                          {course.title} - {lesson.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={quizForm.passingScore}
                      onChange={(e) => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={quizForm.timeLimit}
                      onChange={(e) => setQuizForm({ ...quizForm, timeLimit: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {quizForm.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        {quizForm.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                          <input
                            type="text"
                            required
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Options (select correct answer)</label>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                required
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(index, 'options', newOptions);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
                          <textarea
                            rows={2}
                            value={question.explanation}
                            onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuizModal(false);
                      setEditingQuiz(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
