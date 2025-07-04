import express from 'express';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Issue certificate
// @route   POST /api/certificates
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      userId: req.user.id,
      courseId: courseId
    });

    if (existingCertificate) {
      return res.json({
        success: true,
        certificate: existingCertificate
      });
    }

    // Create new certificate
    const certificate = await Certificate.create({
      userId: req.user.id,
      courseId: courseId,
      studentName: `${req.user.firstName} ${req.user.lastName}`,
      courseName: course.title
    });

    res.status(201).json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
router.get('/my-certificates', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      certificates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId 
    }).populate('courseId', 'title');

    if (!certificate) {
      return res.status(404).json({ 
        success: false,
        message: 'Certificate not found' 
      });
    }

    res.json({
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        completionDate: certificate.completionDate,
        issuedDate: certificate.issuedDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;