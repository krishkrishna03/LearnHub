import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create instructor users
    const instructor1 = await User.create({
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@learnhub.com',
      password: 'instructor123',
      role: 'instructor'
    });

    const instructor2 = await User.create({
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael@learnhub.com',
      password: 'instructor123',
      role: 'instructor'
    });

    const instructor3 = await User.create({
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'emma@learnhub.com',
      password: 'instructor123',
      role: 'instructor'
    });

    console.log('👥 Created users');

    // Create sample courses (mix of free and paid)
    const course1 = await Course.create({
      title: 'Full Stack Web Development',
      description: 'Master React, Node.js, MongoDB, and Express.js to build complete web applications from scratch. This comprehensive course covers everything from frontend development with React to backend APIs with Node.js.',
      shortDescription: 'Master React, Node.js, MongoDB, and Express.js to build complete web applications.',
      instructor: instructor1._id,
      category: 'Web Development',
      level: 'Intermediate',
      price: 149,
      originalPrice: 199,
      thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '12 weeks',
      tags: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'],
      prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals'],
      learningOutcomes: [
        'Build full-stack web applications',
        'Master React and modern JavaScript',
        'Create RESTful APIs with Node.js',
        'Work with MongoDB databases',
        'Deploy applications to production'
      ],
      isPublished: true,
      isFeatured: true,
      rating: { average: 4.9, count: 156 }
    });

    const course2 = await Course.create({
      title: 'Python for Data Science',
      description: 'Learn Python fundamentals, pandas, NumPy, and machine learning for data analysis. Perfect for beginners who want to start their journey in data science.',
      shortDescription: 'Learn Python fundamentals, pandas, NumPy, and machine learning for data analysis.',
      instructor: instructor2._id,
      category: 'Data Science',
      level: 'Beginner',
      price: 0, // Free course
      originalPrice: 0,
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '10 weeks',
      tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy'],
      prerequisites: ['Basic programming knowledge'],
      learningOutcomes: [
        'Master Python programming',
        'Analyze data with pandas and NumPy',
        'Create data visualizations',
        'Build machine learning models',
        'Work with real datasets'
      ],
      isPublished: true,
      isFeatured: true,
      rating: { average: 4.8, count: 203 }
    });

    const course3 = await Course.create({
      title: 'UI/UX Design Masterclass',
      description: 'Learn design principles, Figma, user research, and create stunning interfaces. This course covers everything from design theory to practical application.',
      shortDescription: 'Learn design principles, Figma, user research, and create stunning interfaces.',
      instructor: instructor3._id,
      category: 'UI/UX Design',
      level: 'Beginner',
      price: 99,
      originalPrice: 129,
      thumbnail: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '6 weeks',
      tags: ['UI/UX', 'Figma', 'Design', 'Prototyping', 'User Research'],
      prerequisites: ['No prior experience required'],
      learningOutcomes: [
        'Master design principles',
        'Create wireframes and prototypes',
        'Conduct user research',
        'Design with Figma',
        'Build a design portfolio'
      ],
      isPublished: true,
      isFeatured: true,
      rating: { average: 4.8, count: 89 }
    });

    // Add more free courses
    const course4 = await Course.create({
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming language. Perfect for absolute beginners.',
      shortDescription: 'Learn the basics of JavaScript programming language.',
      instructor: instructor1._id,
      category: 'Web Development',
      level: 'Beginner',
      price: 0, // Free course
      originalPrice: 0,
      thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '4 weeks',
      tags: ['JavaScript', 'Programming', 'Web Development'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Understand JavaScript syntax',
        'Work with variables and functions',
        'Manipulate the DOM',
        'Handle events',
        'Build interactive web pages'
      ],
      isPublished: true,
      isFeatured: false,
      rating: { average: 4.7, count: 324 }
    });

    const course5 = await Course.create({
      title: 'Introduction to Cybersecurity',
      description: 'Learn the fundamentals of cybersecurity and protect yourself online.',
      shortDescription: 'Learn the fundamentals of cybersecurity and protect yourself online.',
      instructor: instructor2._id,
      category: 'Cybersecurity',
      level: 'Beginner',
      price: 0, // Free course
      originalPrice: 0,
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: '3 weeks',
      tags: ['Cybersecurity', 'Security', 'Privacy'],
      prerequisites: ['Basic computer knowledge'],
      learningOutcomes: [
        'Understand common security threats',
        'Learn password best practices',
        'Secure your devices',
        'Protect your privacy online',
        'Recognize phishing attempts'
      ],
      isPublished: true,
      isFeatured: false,
      rating: { average: 4.6, count: 156 }
    });

    console.log('📚 Created courses');

    // Create sample lessons for course 1
    const lesson1 = await Lesson.create({
      title: 'Introduction to Full Stack Development',
      description: 'Overview of full stack development and the technologies we will use',
      courseId: course1._id,
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '15 minutes',
      isPreview: true,
      resources: [
        {
          title: 'Course Syllabus',
          url: 'https://example.com/syllabus.pdf',
          type: 'pdf'
        }
      ]
    });

    const lesson2 = await Lesson.create({
      title: 'Setting Up Your Development Environment',
      description: 'Install Node.js, VS Code, and other essential tools',
      courseId: course1._id,
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '20 minutes',
      resources: [
        {
          title: 'Installation Guide',
          url: 'https://example.com/install-guide.pdf',
          type: 'pdf'
        }
      ]
    });

    const lesson3 = await Lesson.create({
      title: 'React Fundamentals',
      description: 'Learn the basics of React components and JSX',
      courseId: course1._id,
      order: 3,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '25 minutes',
      resources: []
    });

    // Add lessons to course
    course1.lessons = [lesson1._id, lesson2._id, lesson3._id];
    await course1.save();

    // Create lessons for free course (course2)
    const lesson4 = await Lesson.create({
      title: 'Python Basics',
      description: 'Introduction to Python syntax and basic concepts',
      courseId: course2._id,
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '18 minutes',
      isPreview: true,
      resources: []
    });

    const lesson5 = await Lesson.create({
      title: 'Working with Data',
      description: 'Learn how to manipulate data with pandas',
      courseId: course2._id,
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '22 minutes',
      resources: []
    });

    course2.lessons = [lesson4._id, lesson5._id];
    await course2.save();

    console.log('📖 Created lessons');

    // Create sample quiz
    const quiz1 = await Quiz.create({
      title: 'Full Stack Development Basics',
      lessonId: lesson1._id,
      questions: [
        {
          question: 'What does MERN stack stand for?',
          options: [
            'MongoDB, Express, React, Node.js',
            'MySQL, Express, React, Node.js',
            'MongoDB, Express, Redux, Node.js',
            'MongoDB, Express, React, Next.js'
          ],
          correctAnswer: 0,
          explanation: 'MERN stands for MongoDB, Express, React, and Node.js'
        },
        {
          question: 'Which of the following is a frontend framework?',
          options: ['Express.js', 'React', 'Node.js', 'MongoDB'],
          correctAnswer: 1,
          explanation: 'React is a frontend JavaScript library for building user interfaces'
        }
      ],
      passingScore: 70,
      timeLimit: 10
    });

    // Link quiz to lesson
    lesson1.quiz = quiz1._id;
    await lesson1.save();

    console.log('❓ Created quizzes');

    // Create some student users
    const student1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'student123',
      role: 'student'
    });

    const student2 = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'student123',
      role: 'student'
    });

    console.log('🎓 Created students');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@learnhub.com / admin123');
    console.log('Instructor: sarah@learnhub.com / instructor123');
    console.log('Student: john@example.com / student123');
    console.log('\n📚 Course Types:');
    console.log('- Free courses: Python for Data Science, JavaScript Fundamentals, Cybersecurity');
    console.log('- Paid courses: Full Stack Web Development, UI/UX Design Masterclass');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
  process.exit(0);
};

runSeed();