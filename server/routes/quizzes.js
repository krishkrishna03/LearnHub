import express from 'express';
import Quiz from '../models/Quiz.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all quizzes (Admin only)
// @route   GET /api/quizzes
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('lessonId', 'title');
    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get quiz by lesson ID
// @route   GET /api/quizzes/lesson/:lessonId
// @access  Private
router.get('/lesson/:lessonId', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId })
      .select('-questions.correctAnswer -questions.explanation');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = answers.map((answer, index) => {
      const isCorrect = quiz.questions[index].correctAnswer === answer;
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect,
        correctAnswer: quiz.questions[index].correctAnswer,
        explanation: quiz.questions[index].explanation
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    // Save attempt
    const attempt = {
      user: req.user.id,
      score,
      answers: detailedAnswers.map(a => ({
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect
      }))
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    // Update user progress
    const user = await User.findById(req.user.id);
    const lesson = await Lesson.findById(quiz.lessonId);
    
    if (lesson && user) {
      let courseProgress = user.progress.find(p => p.courseId.toString() === lesson.courseId.toString());
      
      if (courseProgress) {
        // Update or add quiz score
        const existingQuizScore = courseProgress.quizScores.find(q => q.quizId.toString() === quiz._id.toString());
        if (existingQuizScore) {
          existingQuizScore.score = score;
          existingQuizScore.completedAt = new Date();
        } else {
          courseProgress.quizScores.push({
            quizId: quiz._id,
            score,
            completedAt: new Date()
          });
        }
        
        await user.save();
      }
    }

    res.json({
      success: true,
      score,
      passed: score >= quiz.passingScore,
      answers: detailedAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);

    // Update lesson with quiz reference if lessonId is provided
    if (req.body.lessonId) {
      await Lesson.findByIdAndUpdate(req.body.lessonId, { quiz: quiz._id });
    }

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Remove quiz reference from lesson
    if (quiz.lessonId) {
      await Lesson.findByIdAndUpdate(quiz.lessonId, { $unset: { quiz: 1 } });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;