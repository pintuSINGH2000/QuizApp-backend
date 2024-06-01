const mongoose = require("mongoose");
const Quiz = require("../models/quiz");

const createQuizController = async (req, res) => {
  try {
    const { quizName, quizType, questions, optionType, timer } = req.body;
    const creator = req.creator;
    const quiz = new Quiz({
      quizName,
      quizType,
      timer,
      optionType,
      creator,
      questions,
    });
    await quiz.save();
    res
      .status(201)
      .send({ quiz: quiz._id, message: "Quiz created Successfully" });
  } catch (error) {
    return res.status(500).send({ errorMessage: "Internal server error" });
  }
};
const updateQuizController = async (req, res) => {
  try {
    const { questions, optionType, timer } = req.body;
    const quizId = req.params.id;
    const updatedQuestion = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: { questions: questions, timer: timer, optionType: optionType } },
      { new: true, runValidators: true }
    );
    if (!updatedQuestion) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }
    res.status(201).send({
      quiz: updatedQuestion._id,
      message: "Quiz Updated Successfully",
    });
  } catch (error) {
    return res.status(500).send({ errorMessage: "Internal server error" });
  }
};

const feedbackController = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { quizData, quizType } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }

    let totalCorrect = 0;

    // Iterate over user's answers
    quizData.forEach((userAnswer, index) => {
      if (quizType === 1) {
        if (quiz.questions[index].correctAns === userAnswer) {
          quiz.questions[index].correctCount += 1;
          totalCorrect += 1;
        }

        if (userAnswer != -1) {
          quiz.questions[index].attempted += 1;
        }
      } else {
        if (
          userAnswer != -1 &&
          userAnswer < quiz.questions[index].options.length
        ) {
          quiz.questions[index].options[userAnswer].votes += 1;
        }
      }
    });

    await quiz.save();

    return res.status(201).send({ totalCorrect: totalCorrect });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuizController = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz by ID and increment its impression count
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $inc: { impression: 1 } },
      {
        new: true,
        projection: {
          impression: 0,
          "questions.attempted": 0,
          "questions.correctCount": 0,
          "questions.correctAns": 0,
          createdAt: 0,
          updatedAt: 0,
          creator: 0,
        },
      }
    );

    if (!quiz) {
      return res.status(404).json({ errorMessage: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const getAllQuizController = async (req, res) => {
  try {
    const userId = req.creator;
    const skip = req.query.skip;
    const impression = req.query.impression === "true";
    let totalImpression = 0;
    let totalQuizCreated = 0;
    let totalQuestionsCreated = 0;
    const isFirst = !skip || parseInt(skip) === 0;
    if (isFirst) {
      // Get total impressions
      const totalImpressionsResult = await Quiz.aggregate([
        { $match: { creator: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalImpressions: { $sum: "$impression" } } },
      ]);
      totalImpression =
        totalImpressionsResult.length > 0
          ? totalImpressionsResult[0].totalImpressions
          : 0;

      // Get total number of quizzes created
      totalQuizCreated = await Quiz.countDocuments({ creator: userId });

      const totalQuestionsResult = await Quiz.aggregate([
        { $match: { creator: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalQuestionsCreated: { $sum: { $size: "$questions" } },
          },
        },
      ]);
      totalQuestionsCreated =
        totalQuestionsResult.length > 0
          ? totalQuestionsResult[0].totalQuestionsCreated
          : 0;
    }
    const filter = { creator: userId };
    if (impression) {
      filter.impression = { $gt: 10 };
    }
    const quizzes = await Quiz.find(filter)
      .sort(impression ? { impression: -1 } : { createdAt: 1 })
      .limit(12)
      .skip(parseInt(skip)) // Assuming page number is passed as query parameter
      .select("quizName quizType impression createdAt");

    return res.status(200).json({
      totalImpression,
      totalQuizCreated,
      totalQuestionsCreated,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const deleteQuizController = async (req, res) => {
  try {
    const quizId = req.params.id;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).send({ errorMessage: "Bad Request" });
    }
    return res.status(200).send({ message: "Quiz deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const getQuestionAnalysis = async (req, res) => {
  try {
    const quizId = req.params.id;
    const creator = req.creator;
    const result = await Quiz.findOne({ _id: quizId, creator: creator}).lean();
    return res.status(200).send({ result });
  } catch (error) {

    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const getQestions = async (req, res) => {
  try {
    const quizId = req.params.id;
    const result = await Quiz.findById(quizId, { questions: 1 });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

module.exports = {
  createQuizController,
  updateQuizController,
  feedbackController,
  getQuizController,
  getAllQuizController,
  deleteQuizController,
  getQuestionAnalysis,
  getQestions,
};
