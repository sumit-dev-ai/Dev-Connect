import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const createPostController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { content, visibility } = req.body;

  const trimmedContent = content?.trim();

  const localFiles = req.files;
  let images = [];


  if (!trimmedContent && (!localFiles || localFiles.length === 0)) {
    throw new ApiError(400, "The post can't be empty");
  }
  //visibility check because we only have two options in enum schema public and private
  const allowedVisibility = ["public", "private"];

  if (visibility && !allowedVisibility.includes(visibility)) {
    throw new ApiError(400, "Invalid visibility value");
  }

  //image upload

  if (localFiles && localFiles.length > 0) {    // check for all files 
    for (const file of localFiles) {
      const uploadedImage = await uploadOnCloudinary(file.path);

      if (!uploadedImage?.secure_url) { //if url isn't generated
        throw new ApiError(500, "Image upload failed");
      }

      images.push(uploadedImage.secure_url);  //url generated so we appended files
    }
  }

  const post = await Post.create({
    author: userId,
    content: trimmedContent || "",
    images,
    visibility: visibility,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully"));
});

export const getFeedPosts = asyncHandler(async (req, res) => {
  // page config
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  
  const userId = req.user?._id;   // need it for isLiked
  if (!userId) {
    throw new ApiError(401 , "Unauthorized request")
  }

  //for infinite scrolling
  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  const posts = await Post.aggregate([


    {
      $sort: {
        createdAt: -1,
      }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails"
      }
    },
    {
      $unwind: "$authorDetails"
    },
    {
      $project: {
        content: 1,
        images: 1,
        createdAt: 1,

        likesCount: {
          $size: {
            $ifNull: ["$likes", []]
          }
        },
        CommentCount: {
          $size: {
            $ifNull: ["$comments", []]
          }
        },
        isLiked: {
          $in: [userId, "$likes"]
        },

        "authorDetails._id": 1,
        "authorDetails.userName": 1,
        "authorDetails.fullName": 1,
        "authorDetails.profilePicture": 1


      }
    }
  ])
  return res.status(200)
    .json(new ApiResponse(
      200,
      {
        posts, page, limit, totalPosts,
        hasMore,   //need has more for infine scrolling
        totalPages: Math.ceil(totalPosts / limit) //need total pages for pagination
      },
      "posts fetched Succesfully"
    ))
})

export const likePostController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const postId = req.params?.postId

  if (!userId) {
    throw new ApiError(401, "unauthorized request")
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id")
  }

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: {
        likes: userId
      }
    },
    {

      new: true,
    }
  )
  if (!post) {
    throw new ApiError(404, "post not found")
  }

  return res.status(200)
    .json(new ApiResponse(200, {
      postId: post._id,
      likesCount: post.likes.length,
      isLiked: true
    },
      "post liked succesfully"

    ))

})
export const unlikePostController = asyncHandler(async (req, res) => {
  const userId = req.user?._id
  const postId = req.params?.postId

  if (!userId) {
    throw new ApiError(401, "unauthorized request")
  }
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid post id")
  }

  const post = await Post.findByIdAndUpdate(
    postId, {
    $pull: {
      likes: userId
    }
  }
    ,
    {
      new: true
    }
  )

  if (!post) {
    throw new ApiError(404, "Post not found")
  }

  return res.status(200).json(new ApiResponse(200, {
    postId: post._id,
    likesCount: post.likes.length,
    isLiked: false
  },
    "Post unliked successfully"

  ))

})