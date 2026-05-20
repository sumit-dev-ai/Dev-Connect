import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // WHO WROTE COMMENT
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // WHICH POST
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    // COMMENT TEXT
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // USERS WHO LIKED COMMENT
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // EDIT TRACKING
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;