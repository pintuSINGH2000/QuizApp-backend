const express= require('express');
const { createQuiz, createQuizController, feedbackController, getQuizController, getAllQuizController, deleteQuizController, getQuestionAnalysis, getQestions, updateQuizController }  = require('../controllers/quiz');
const { verifyToken } = require('../Middleware/verifyToken');
const { validateQuiz, validateQuestion } = require('../Middleware/validateQuiz');
const router = express.Router();

router.post("/create-quiz",verifyToken,validateQuiz,validateQuestion,createQuizController);
router.post("/feedback/:quizId",feedbackController);
router.get("/get-quiz/:quizId",getQuizController);
router.get("/get-quiz-analysis",verifyToken,getAllQuizController);
router.delete("/delete-quiz/:id",verifyToken,deleteQuizController);
router.get("/get-question-analysys/:id",verifyToken,getQuestionAnalysis);
router.get("/get-question/:id",verifyToken,getQestions);
router.post("/update-quiz/:id",verifyToken,validateQuestion,updateQuizController);

module.exports = router;