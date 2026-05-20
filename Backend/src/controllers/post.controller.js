import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPostController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { content, visibility } = req.body;

  const trimmedContent = content?.trim();

  const localFilePath = req.file?.path;

  if (!trimmedContent && !localFilePath) {
    throw new ApiError(400, "The post can't be empty");
  }

  let images = [];

  if (localFilePath) {
    const uploadedImage = await uploadOnCloudinary(localFilePath);

    if (!uploadedImage?.secure_url) {
      throw new ApiError(500, "Image upload failed");
    }

    images.push(uploadedImage.secure_url);
  }

  const post = await Post.create({
    author: userId,
    content: trimmedContent || "",
    images,
    visibility: visibility || "public",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully"));
});