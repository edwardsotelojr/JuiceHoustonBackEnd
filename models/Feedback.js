const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
    text: {
      type: String,
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);


FeedbackSchema.methods.like = function (userId) {
    if (!this.likes.some((id) => id.equals(userId))) {
      this.likes.push(userId);
      return this.save();
    }
    return Promise.resolve(this);
  };
  
  FeedbackSchema.methods.unlike = function (userId) {
    if (this.likes.some((id) => id.equals(userId))) {
      this.likes.remove(userId);
      return this.save();
    }
    return Promise.resolve(this);
  };

module.exports = Feedback = mongoose.model("feedbacks", feedbackSchema);
