import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import Post from "../models/post.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import Comment from "../models/comment.models.js";

export const createComment = asyncHandler(async (req, res) => {
    // get the post and user ids
    const userId = req.user?._id;
    const postId = req.params.postId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Not a valid post id")
    }

    const { content } = req.body;
    if (typeof content !== "string") {
        throw new ApiError(400, "content must be a string");
    }


    if (!content.trim()) {
        throw new ApiError(400, "Empty Comment is not allowed")
    }
    const trimmedContent = content.trim();
    if (trimmedContent.length > 500) {
        throw new ApiError(400, "Comment must not exceed 500 letters")
    }
    const post = await Post.findById(postId)
    if (!post) {
        throw new ApiError(400, "failed to find post")
    }

    console.log(trimmedContent);

    const comment = await Comment.create({
        author: userId,
        content: trimmedContent,
        post: postId,

    });

    console.log(comment, '23');
    if (!comment) {
        throw new ApiError(400, "Failed to create comment")
    }
    post.comments.push(comment._id)
    await post.save()


    return res.status(201).json(new ApiResponse(201, {
        comment,
        commentCount: post.comments.length,
        postId: post._id,

    },
        "commented succesfully "))

})

export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post id");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const currentUserId = new mongoose.Types.ObjectId(req.user._id);
    // const currentUserId = req.user._id
    const postObjectId = new mongoose.Types.ObjectId(postId);

    const comments = await Comment.aggregate([
        {
            $match: {
                post: postObjectId,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorDetails",
            },
        },
        {
            $unwind: "$authorDetails",
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isCommentLiked: {
                    $in: [currentUserId, "$likes"],
                },
            },
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                likesCount: 1,
                isCommentLiked: 1,
                "authorDetails._id": 1,
                "authorDetails.fullName": 1,
                "authorDetails.userName": 1,
                "authorDetails.profilePicture": 1,
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                page,
                limit,
            },
            "Comments fetched successfully"
        )
    );
});
