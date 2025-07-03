import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Enroll in course
// @route   POST /api/enrollments/:courseId
// @access  Private
router.post('/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(req.user.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    user.progress.push({
      courseId: course._id,
      lessonsCompleted: [],
      quizScores: [],
      completionPercentage: 0,
      enrolledAt: new Date()
    });

    // Add user to course's enrolled students
    course.enrolledStudents.push(user._id);

    await user.save();
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark lesson as complete
// @route   POST /api/enrollments/:courseId/lessons/:lessonId/complete
// @access  Private
router.post('/:courseId/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId).populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const courseProgress = user.progress.find(p => p.courseId.toString() === course._id.toString());
    
    if (!courseProgress.lessonsCompleted.includes(req.params.lessonId)) {
      courseProgress.lessonsCompleted.push(req.params.lessonId);
      
      // Calculate completion percentage
      const totalLessons = course.lessons.length;
      const completedLessons = courseProgress.lessonsCompleted.length;
      courseProgress.completionPercentage = Math.round((completedLessons / totalLessons) * 100);
      
      await user.save();
    }

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      completionPercentage: courseProgress.completionPercentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
router.get('/my-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .populate('progress.courseId', 'title thumbnail');

    res.json({
      success: true,
      enrolledCourses: user.enrolledCourses,
      progress: user.progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;