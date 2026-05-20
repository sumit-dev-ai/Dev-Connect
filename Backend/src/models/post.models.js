import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new mongoose.Schema(
  {
    // WHO CREATED THE POST
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // POST TEXT CONTENT
    content: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // POST IMAGES
    images: [
      {
        type: String,
      },
    ],

    // USERS WHO LIKED THE POST
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // COMMENTS
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],


    // VISIBILITY
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

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

// PAGINATION PLUGIN
postSchema.plugin(aggregatePaginate);

const Post = mongoose.model("Post", postSchema);

export default Post;