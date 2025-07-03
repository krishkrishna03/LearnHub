import express from 'express';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId })
      .sort({ order: 1 })
      .populate('quiz');

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('courseId', 'title instructor')
      .populate('quiz');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is enrolled in the course or is instructor/admin
    const course = await Course.findById(lesson.courseId);
    const isEnrolled = course.enrolledStudents.includes(req.user.id);
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isEnrolled && !isInstructor && !isAdmin && !lesson.isPreview) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if course exists and user owns it
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await Lesson.create(req.body);

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('courseId');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user owns the course or is admin
    if (lesson.courseId.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Instructor/Admin)
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('courseId');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user owns the course or is admin
    if (lesson.courseId.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this lesson' });
    }

    // Remove lesson from course
    await Course.findByIdAndUpdate(lesson.courseId._id, {
      $pull: { lessons: lesson._id }
    });

    await Lesson.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;