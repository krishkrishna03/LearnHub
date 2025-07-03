import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📚 Fetching courses...');
    const { category, level, search, page = 1, limit = 12 } = req.query;
    
    let query = { isPublished: true };
    
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    
    if (level && level !== 'All Levels') {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    console.log('🔍 Query:', query);

    // Use timeout and lean for better performance
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName')
      .populate('lessons')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean() // Use lean for better performance
      .maxTimeMS(20000); // 20 second timeout

    const total = await Course.countDocuments(query).maxTimeMS(10000);

    console.log(`✅ Found ${courses.length} courses`);

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses',
      error: error.message 
    });
  }
});

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    console.log('⭐ Fetching featured courses...');
    
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'firstName lastName')
      .limit(6)
      .lean()
      .maxTimeMS(15000);

    console.log(`✅ Found ${courses.length} featured courses`);

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('❌ Error fetching featured courses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch featured courses',
      error: error.message 
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log(`📖 Fetching course: ${req.params.id}`);
    
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      })
      .populate('reviews.user', 'firstName lastName')
      .maxTimeMS(15000);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    console.log(`✅ Found course: ${course.title}`);

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('❌ Error fetching course:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch course',
      error: error.message 
    });
  }
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('❌ Error creating course:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create course',
      error: error.message 
    });
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Delete associated lessons
    await Lesson.deleteMany({ courseId: req.params.id });

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Course already reviewed' });
    }

    const review = {
      user: req.user.id,
      rating,
      comment
    };

    course.reviews.push(review);
    course.calculateAverageRating();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;