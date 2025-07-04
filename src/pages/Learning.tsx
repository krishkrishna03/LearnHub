import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle,
  Download,
  Settings,
  ArrowLeft,
  Clock,
  Award,
  HelpCircle
} from 'lucide-react';
import { useCourse } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import CertificateGenerator from '../components/CertificateGenerator';
import axios from 'axios';

const Learning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { course, loading } = useCourse(courseId!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  useEffect(() => {
    // Fetch user progress for this course
    const fetchProgress = async () => {
      try {
        const response = await axios.get('/enrollments/my-courses');
        const courseProgress = response.data.progress.find(
          (p: any) => p.courseId._id === courseId
        );
        if (courseProgress) {
          setCompletedLessons(courseProgress.lessonsCompleted);
          setProgress(courseProgress.completionPercentage);
          if (courseProgress.completionPercentage === 100) {
            setShowCertificate(true);
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    if (courseId) {
      fetchProgress();
    }
  }, [courseId]);

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await axios.post(`/enrollments/${courseId}/lessons/${lessonId}/complete`);
      setCompletedLessons(prev => [...prev, lessonId]);
      const newProgress = response.data.completionPercentage;
      setProgress(newProgress);
      
      // Check if course is completed
      if (newProgress === 100) {
        setShowCertificate(true);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const fetchQuiz = async (lessonId: string) => {
    try {
      const response = await axios.get(`/quizzes/lesson/${lessonId}`);
      if (response.data.success) {
        setCurrentQuiz(response.data.quiz);
        setQuizAnswers(new Array(response.data.quiz.questions.length).fill(-1));
        setShowQuiz(true);
        setQuizSubmitted(false);
        setQuizResults(null);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const submitQuiz = async () => {
    try {
      const response = await axios.post(`/quizzes/${currentQuiz._id}/submit`, {
        answers: quizAnswers
      });
      setQuizResults(response.data);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const goToNextLesson = () => {
    if (course?.lessons && currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setIsPlaying(false);
      setShowQuiz(false);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setIsPlaying(false);
      setShowQuiz(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading course...</p>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons?.[currentLessonIndex];
  const isCurrentLessonCompleted = currentLesson && completedLessons.includes(currentLesson._id);

  if (showCertificate && progress === 100) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Completed!</h1>
            <p className="text-gray-600">
              Congratulations on completing <strong>{course.title}</strong>
            </p>
          </div>

          <CertificateGenerator
            courseName={course.title}
            courseId={course._id}
            studentName={`${user?.firstName} ${user?.lastName}`}
            completionDate={new Date().toLocaleDateString()}
            onDownload={() => {
              // Certificate downloaded successfully
            }}
          />

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold mr-4"
            >
              Review Course Content
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold"
            >
              Explore More Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{course.title}</h1>
              <p className="text-sm text-gray-400">
                Lesson {currentLessonIndex + 1} of {course.lessons?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Progress: {progress}%
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {progress === 100 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!showQuiz ? (
            <>
              {/* Video Player */}
              <div className="flex-1 bg-black relative">
                {currentLesson ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-4xl">
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-all duration-200"
                               onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? (
                              <Pause className="w-10 h-10 text-white" />
                            ) : (
                              <Play className="w-10 h-10 text-white ml-1" />
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                          <p className="text-white/80">{currentLesson.description}</p>
                        </div>
                      </div>
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={goToPreviousLesson}
                              disabled={currentLessonIndex === 0}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <SkipBack className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6 ml-0.5" />
                              )}
                            </button>
                            <button
                              onClick={goToNextLesson}
                              disabled={currentLessonIndex === (course.lessons?.length || 1) - 1}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <SkipForward className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm">{currentLesson.duration}</span>
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200">
                              <Settings className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">No lesson selected</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              {currentLesson && (
                <div className="bg-gray-800 p-6 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
                    <div className="flex items-center space-x-4">
                      {currentLesson.quiz && (
                        <button
                          onClick={() => fetchQuiz(currentLesson._id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Take Quiz</span>
                        </button>
                      )}
                      {!isCurrentLessonCompleted && (
                        <button
                          onClick={() => markLessonComplete(currentLesson._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark Complete</span>
                        </button>
                      )}
                      {isCurrentLessonCompleted && (
                        <div className="flex items-center space-x-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{currentLesson.description}</p>
                  
                  {/* Resources */}
                  {currentLesson.resources && currentLesson.resources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Resources</h3>
                      <div className="space-y-2">
                        {currentLesson.resources.map((resource: any, index: number) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                          >
                            <Download className="w-4 h-4 text-blue-400" />
                            <span>{resource.title}</span>
                            <span className="text-xs text-gray-400 uppercase">{resource.type}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Quiz Interface */
            <div className="flex-1 bg-gray-800 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-8 text-gray-900">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{currentQuiz?.title}</h2>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>

                  {!quizSubmitted ? (
                    <div className="space-y-8">
                      {currentQuiz?.questions.map((question: any, questionIndex: number) => (
                        <div key={questionIndex} className="border-b border-gray-200 pb-6">
                          <h3 className="text-lg font-semibold mb-4">
                            {questionIndex + 1}. {question.question}
                          </h3>
                          <div className="space-y-3">
                            {question.options.map((option: string, optionIndex: number) => (
                              <label
                                key={optionIndex}
                                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={`question-${questionIndex}`}
                                  value={optionIndex}
                                  checked={quizAnswers[questionIndex] === optionIndex}
                                  onChange={() => {
                                    const newAnswers = [...quizAnswers];
                                    newAnswers[questionIndex] = optionIndex;
                                    setQuizAnswers(newAnswers);
                                  }}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={submitQuiz}
                        disabled={quizAnswers.includes(-1)}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  ) : (
                    /* Quiz Results */
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        quizResults?.passed ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-3xl font-bold ${
                          quizResults?.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {quizResults?.score}%
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        quizResults?.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizResults?.passed ? 'Congratulations!' : 'Try Again'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        You scored {quizResults?.score}% on this quiz.
                        {quizResults?.passed 
                          ? ' You have passed!' 
                          : ` You need ${currentQuiz?.passingScore}% to pass.`
                        }
                      </p>

                      <div className="space-y-4 mb-6">
                        {quizResults?.answers.map((answer: any, index: number) => (
                          <div key={index} className="text-left border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">
                              {index + 1}. {currentQuiz.questions[index].question}
                            </h4>
                            <div className={`p-2 rounded ${
                              answer.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                              Your answer: {currentQuiz.questions[index].options[answer.selectedAnswer]}
                              {!answer.isCorrect && (
                                <div className="mt-1 text-green-800">
                                  Correct answer: {currentQuiz.questions[index].options[answer.correctAnswer]}
                                </div>
                              )}
                            </div>
                            {answer.explanation && (
                              <p className="text-gray-600 text-sm mt-2">{answer.explanation}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowQuiz(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        Continue Learning
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Course Content */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.lessons?.map((lesson: any, index: number) => {
                const isCompleted = completedLessons.includes(lesson._id);
                const isCurrent = index === currentLessonIndex;
                
                return (
                  <button
                    key={lesson._id}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setShowQuiz(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : isCurrent ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{lesson.title}</p>
                        <div className="flex items-center space-x-2 text-sm opacity-75">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                          {lesson.quiz && (
                            <HelpCircle className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
