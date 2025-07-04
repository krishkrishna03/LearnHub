import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
let dbConnection = null;
connectDB()
  .then(conn => {
    dbConnection = conn;
    if (conn) {
      console.log('🎉 Database connection established - Ready for production!');
    } else {
      console.log('🔄 Running without database connection');
    }
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
    console.log('⚠️  Server will continue running without database');
  });

// Middleware to check database connection
const requireDB = (req, res, next) => {
  if (!dbConnection) {
    return res.status(503).json({ 
      success: false,
      error: 'Database not available', 
      message: 'Database connection is not established. Please check your MongoDB configuration.' 
    });
  }
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'LearnHub API is running!',
    database: dbConnection ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import and use routes with database requirement
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import quizRoutes from './routes/quizzes.js';
import enrollmentRoutes from './routes/enrollments.js';
import certificateRoutes from './routes/certificates.js';

// Apply database requirement middleware to API routes that need DB
app.use('/api/auth', requireDB, authRoutes);
app.use('/api/users', requireDB, userRoutes);
app.use('/api/courses', requireDB, courseRoutes);
app.use('/api/lessons', requireDB, lessonRoutes);
app.use('/api/quizzes', requireDB, quizRoutes);
app.use('/api/enrollments', requireDB, enrollmentRoutes);
app.use('/api/certificates', requireDB, certificateRoutes);

// Error handling middleware
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 LearnHub Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (dbConnection) {
    console.log('\n🎓 LearnHub is ready!');
    console.log('🔐 To create an admin account:');
    console.log('   1. Go to /register');
    console.log('   2. Use email: admin@learnhub.com');
    console.log('   3. Use password: admin123');
    console.log('   4. Update the user role to "admin" in your MongoDB database');
    console.log('\n📚 Start adding courses and content through the admin panel!');
  } else {
    console.log('\n⚠️  Database not connected. Please check your MongoDB Atlas configuration.');
  }
});