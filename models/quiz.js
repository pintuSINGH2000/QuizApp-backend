const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    quizName: {
      type: String,
      required: true,
      trim: true,
    },
    quizType: {
      type: Number,
      enum: [1, 2], // Q&A type and Poll type
      required: true,
    },
    impression: {
      type: Number,
      default: 0,
    },

    optionType: {
      type: Number,
      enum: [1, 2, 3], //text,img,text&image
      required: true,
    },
    questions: [
      {
        questionName: {
          type: String,
          required: true,
          trim: true,
        },
        options: [
          {
            text: { type: String, trim: true },
            imgUrl: { type: String, trim: true },
            votes: { type: Number, default: 0 },
          },
        ],
        attempted: {
          type: Number,
          default: 0,
        },
        correctCount: {
          type: Number,
          default: 0,
        },
        correctAns: {
          type: Number,
          default: -1,
        },
        timer: {
          type: Number,
          enum: [0, 1, 2], // 0-> off 1->5sec 2->10sec
          default: 0,
        },
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Quiz", quizSchema);
