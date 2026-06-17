import Document from "../models/Document.js"; // Sahi model import
import Flashcard from "../models/Flashcard.js"; // Flashcard model import
import Quiz from '../models/Quiz.js';

//@desc     Get user learning statistics
//@router   GET api/progress/dashboard
//@access   Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get basic counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const compeletedQuizzes = await Quiz.countDocuments({ userId, compeletedAt: { $ne: null } });

    // Get all flashcard sets for this user
    const flashcardSets = await Flashcard.find({ userId });
    
    // Yahan counts ko handle karne ka sahi tarika
    const totalFlashcardSets = flashcardSets.length;
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach(set => {
      totalFlashcards += set.cards.length; // Sahi variable update
      reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter(c => c.isStarred).length;
    });

    // Get quiz statistics
    const completedQuizData = await Quiz.find({ userId, compeletedAt: { $ne: null } });
    
    // Average score calculation (fixed potential syntax issue)
    const averageScore = completedQuizData.length > 0
      ? Math.round(completedQuizData.reduce((sum, q) => sum + q.score, 0) / completedQuizData.length)
      : 0;

    // Recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('title fileName lastAccessed status');

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('documentId', 'title')
      .select('title score totalQuestions compeletedAt');

    // Mock study streak
    const studyStreak = Math.floor(Math.random() * 7) + 1;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          compeletedQuizzes,
          averageScore,
          studyStreak
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};