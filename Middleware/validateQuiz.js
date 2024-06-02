const validateQuiz = (req, res, next) => {
  try {
    const { quizName, quizType } = req.body;
    // Check for missing required fields
    if (!quizName || quizName.trim().length===0|| !quizType) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }

    // Validate quizType
    if (![1, 2].includes(quizType)) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ errorMessage: "Internal server error" });
  }
};

const validateQuestion = (req, res, next) => {
  try {
    const { quizType, questions, optionType, timer } = req.body;
    // Validate optionType
    if (![1, 2, 3].includes(optionType)) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }
    // Validate each question
    for (let qIndex = 0; qIndex < questions.length; qIndex++) {
      const question = questions[qIndex];

      // Validate questionName
      if (!question.questionName || question.questionName.trim().length==0) {
        return res.status(400).send({ errorMessage: "Bad request" });
      }

      // Validate options length
      if (
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.length > 4
      ) {
        return res.status(400).send({ errorMessage: "Bad request" });
      }

      // Validate each option
      for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
        const option = question.options[oIndex];
        let isValidOptions = true;
        if (
          optionType === 1 &&
          (!option.text || option.text.trim().length === 0 || option.imgUrl)
        ) {
          isValidOptions = false;
        }

        if (
           optionType === 2 &&
          (!option.imgUrl || option.imgUrl.trim().length === 0 || option.text)
        ) {
          isValidOptions = false;
        }

        if (
             optionType === 3 &&
          (!option.text ||
            option.text.trim().length === 0 ||
            !option.imgUrl ||
            option.imgUrl.trim().length === 0)
        ) {
          isValidOptions = false;
        }
        if (!isValidOptions) {
          return res.status(400).send({ errorMessage: "Bad request" });
        }
      }
      // Validate correctAns
      if (
        quizType === 1 &&
        (question.correctAns === -1 ||
          question.correctAns >= question.options.length)
      ) {
        return res.status(400).send({ errorMessage: "Bad request" });
      } else if (
        quizType === 2 &&
        question.correctAns &&
        question.correctAns !== -1
      ) {
        return res.status(400).send({ errorMessage: "Bad request" });
      }

      // validate timer
      if (quizType === 2 && timer || (quizType === 1 && timer<0 || timer>2)) {
        return res.status(400).send({ errorMessage: "Bad request" });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errorMessage: "Internal server error" });
  }
};

module.exports = {
  validateQuiz,
  validateQuestion,
};
