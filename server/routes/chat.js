import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Send message
// @route   POST /api/chat/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { recipient, message } = req.body;

    if (!recipient || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and message are required'
      });
    }

    const chat = await Chat.create({
      sender: req.user.id,
      recipient,
      message
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    res.status(201).json({
      success: true,
      chat: populatedChat
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @desc    Get messages
// @route   GET /api/chat/messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      // Get conversation between current user and specific user
      query = {
        $or: [
          { sender: req.user.id, recipient: userId },
          { sender: userId, recipient: req.user.id }
        ]
      };
    } else if (req.user.role === 'admin') {
      // Admin can see all messages
      query = {};
    } else {
      // Regular users see their messages
      query = {
        $or: [
          { sender: req.user.id },
          { recipient: req.user.id }
        ]
      };
    }

    const messages = await Chat.find(query)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .sort({ timestamp: -1 })
      .limit(100);

    // Add senderName for easier display
    const messagesWithNames = messages.map(msg => ({
      ...msg.toObject(),
      senderName: `${msg.sender.firstName} ${msg.sender.lastName}`
    }));

    res.json({
      success: true,
      messages: messagesWithNames
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// @desc    Mark messages as read
// @route   PUT /api/chat/mark-read
// @access  Private
router.put('/mark-read', protect, async (req, res) => {
  try {
    const { senderId } = req.body;

    await Chat.updateMany(
      {
        sender: senderId,
        recipient: req.user.id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

export default router;
