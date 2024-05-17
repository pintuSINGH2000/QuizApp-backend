const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      enum: [1, 2], // Q&A type and Poll type
      required: true,
    },
    impression: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        optionType:{
            type: Number,
            enum: [1, 2, 3], //text,img,text&image
            required: true,
        },
        options:[{ option: String, votes: { type: Number, default: 0 } }],
        attempted:{
            type:Number,
            default:0
        },
        correctCount:{
            type:Number,
        },
        correctAns:{
            type:String,
        },
        timer:{
            type:Number,
        }
      },
    ],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("quiz", quizSchema);
