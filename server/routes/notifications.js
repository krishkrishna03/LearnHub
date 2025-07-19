import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, message, type, recipients } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    let recipientIds = [];
    
    if (recipients && recipients.length > 0) {
      // Specific recipients
      recipientIds = recipients;
    } else {
      // All users (except admins)
      const allUsers = await User.find({ role: { $ne: 'admin' } }).select('_id');
      recipientIds = allUsers.map(user => user._id);
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      recipients: recipientIds,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'admin') {
      // Admin sees all notifications they created
      query = { createdBy: req.user.id };
    } else {
      // Users see notifications meant for them or for all users
      query = {
        $or: [
          { recipients: req.user.id },
          { recipients: { $size: 0 } } // Notifications for all users
        ],
        isActive: true
      };
    }

    const notifications = await Notification.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user already marked as read
    const alreadyRead = notification.readBy.find(
      read => read.user.toString() === req.user.id
    );

    if (!alreadyRead) {
      notification.readBy.push({
        user: req.user.id,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipients: req.user.id },
        { recipients: { $size: 0 } }
      ],
      isActive: true,
      'readBy.user': { $ne: req.user.id }
    });

    res.json({
      success: true,
      count: notifications.length
    });
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread notification count'
    });
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user created this notification
    if (notification.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

export default router;
