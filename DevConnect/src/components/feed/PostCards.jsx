import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { getFeedPosts } from "@/services/postServices";
import toast from "react-hot-toast";
import { usePostContext } from "@/context/postContext";
import { useCommentContext } from "@/context/commentContext";
import { CommentBox } from "../comments/commentbox";
import { CommentList } from "../comments/CommentList";

export const PostCards = () => {
  const [isCommenting, setIsCommenting] = useState(null)
  const [commentInputs, setCommentInputs] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});
  const { handleCreateComment, comments , handleGetComments } = useCommentContext();
  const { posts, setPosts, handleLikePost, handleUnlikePost } = usePostContext();

  //handling commment
  const handleSubmitComment = async (postId) => {
    const content = commentInputs[postId]?.trim();

    if (!content) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await handleCreateComment(postId, content);

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    

    } catch (error) {
      toast.error(error?.message || "Failed to create comment");
    }
  };

  //handle like unlike 
  const handleLikeClick = async (post) => {
    try {
      if (post.isLiked) {
        await handleUnlikePost(post._id);
      } else {
        await handleLikePost(post._id);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const dropdownRef = useRef(null);

  // Next image logic
  const handleNextImage = (postId, totalImages) => {
    setImageIndexes((prev) => {
      const current = prev[postId] || 0;

      return {
        ...prev,
        [postId]: current === totalImages - 1 ? 0 : current + 1,
      };
    });
  };

  // Previous image logic
  const handlePrevImage = (postId, totalImages) => {
    setImageIndexes((prev) => {
      const current = prev[postId] || 0;

      return {
        ...prev,
        [postId]: current === 0 ? totalImages - 1 : current - 1,
      };
    });
  };

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPostsForFeed = async () => {
    try {
      const data = await getFeedPosts();

      if (data?.data?.posts) {
        setPosts(data.data.posts);
      }
    } catch (error) {
      toast.error(error?.message || "Couldn't fetch posts from server");
    }
  };

  useEffect(() => {
    getPostsForFeed();
  }, []);

  //handle comment click and fetch comments
  const handleCommentClick = (postId) => {
  setIsCommenting((prev) => {
    const isAlreadyOpen = prev === postId;

    if (!isAlreadyOpen) {
      handleGetComments(postId);
    }

    return isAlreadyOpen ? null : postId;
  });
};

  return (
    <div>
      <div className="flex flex-col gap-2 mt-2 md:max-w-screen">
        {posts?.map((post) => {
          const currentImageIndex = imageIndexes[post._id] || 0;

          const formattedDate = new Date(post?.createdAt);
          const now = new Date();
          const diffInMs = now - formattedDate;

          const minutes = Math.floor(diffInMs / (1000 * 60));
          const hours = Math.floor(diffInMs / (1000 * 60 * 60));
          const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

          let uploadedTime = "";

          if (minutes < 60) {
            uploadedTime = `${minutes}m ago`;
          } else if (hours < 24) {
            uploadedTime = `${hours}h ago`;
          } else {
            uploadedTime = `${days}d ago`;
          }

          return (
            <div key={post._id} className="border p-4 rounded-md">
              {/* Post top menu */}
              <div className="flex items-center justify-between gap-2 md:gap-5">
                <Avatar>
                  <AvatarImage src={post?.profilePicture} />
                  <AvatarFallback>
                    {post?.authorDetails?.fullName?.toUpperCase()?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-1 w-full md:w-fit text-sm md:text-base">
                    <div>
                      <div className="font-bold whitespace-nowrap">
                        {post?.authorDetails?.fullName}
                      </div>

                      <div className="text-gray-500 min-w-0 truncate text-xs md:text-base">
                        @{post?.authorDetails?.userName}
                      </div>
                    </div>

                    <div className="text-gray-500 flex items-center text-xs md:text-base">
                      <Dot />
                      {uploadedTime}
                    </div>
                  </div>
                </div>

                <div
                  className="relative"
                  ref={openMenuId === post._id ? dropdownRef : null}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === post._id ? null : post._id
                      )
                    }
                  >
                    <Ellipsis />
                  </button>

                  {openMenuId === post._id && (
                    <div className="z-10 absolute right-0 top-full gap-1 mt-2 w-28 md:w-40 text-sm md:text-base rounded-xl border bg-background shadow-md flex flex-col overflow-hidden">
                      <button className="cursor-pointer border-b py-1">
                        Edit
                      </button>
                      <button className="cursor-pointer border-b py-1">
                        Delete
                      </button>
                      <button className="cursor-pointer border-b py-1">
                        Copy Link
                      </button>
                      <button className="cursor-pointer py-1">
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="mt-4 text-sm md:text-base">
                  {post?.content}
                </div>

                {/* Images */}
                {post?.images?.length > 0 && (
                  <div className="overflow-hidden relative mt-3 rounded-md md:rounded-xl border">
                    <div
                      className="flex transition-transform duration-300"
                      style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                      }}
                    >
                      {post.images.map((image, index) => (
                        <div key={index} className="min-w-full">
                          <img
                            src={image}
                            alt={`post image ${index + 1}`}
                            className="w-full object-cover max-h-125"
                          />
                        </div>
                      ))}
                    </div>

                    {post.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="absolute z-10 top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 cursor-pointer"
                          onClick={() =>
                            handlePrevImage(post._id, post.images.length)
                          }
                        >
                          <ArrowLeft />
                        </button>

                        <button
                          type="button"
                          className="absolute z-10 top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 cursor-pointer"
                          onClick={() =>
                            handleNextImage(post._id, post.images.length)
                          }
                        >
                          <ArrowRight />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Interaction Menu */}
              <div className="flex items-center justify-between my-4 md:w-2/3 mx-3 text-sm md:text-base">
                <div className="flex-1">
                  <button className="flex gap-2 items-center" onClick={() => handleLikeClick(post)}>
                    <Heart className={`cursor-pointer w-4 h-4 md:h-7 md:w-7 ${post.isLiked ? "fill-red-500 text-red-500" : ""
                      }`} />
                    {post?.likesCount || 0}
                  </button>
                </div>

                <div className="flex-1">
                  <button className="flex gap-2 items-center" onClick={()=>handleCommentClick(post._id)}>
                    <MessageCircle className="cursor-pointer w-4 h-4 md:h-7 md:w-7" />
                    {post?.CommentCount || 0}
                  </button>
                </div>

                <div className="flex-1">
                  <button className="flex gap-2 items-center">
                    <Share2 className="cursor-pointer w-4 h-4 md:h-7 md:w-7" />
                    Share
                  </button>
                </div>
              </div>
              {/* comment box */}

              {isCommenting === post?._id &&
                (<div>
                  <CommentList postId={post._id} />
                  <CommentBox
                    postId={post._id}
                    value={commentInputs[post._id] || ""}
                    onChange={(postId, value) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [postId]: value,
                      }))}

                      onSubmit={handleSubmitComment}
                      />

                
              </div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
};