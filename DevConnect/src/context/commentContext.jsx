import { createComment, getComments } from "@/services/commentServices";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { usePostContext } from "./postContext";

const CommentContext = createContext(null);

export const CommentContextProvider = ({ children }) => {
  const { setPosts } = usePostContext();

  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const handleCreateComment = async (postId, content) => {
  try {
    setLoading(true);
    setError(null);

    const response = await createComment(postId, content);

    const newComment = response?.data?.comment;
    const newCommentCount = response?.data?.commentCount;

    if (!newComment) {
      throw new Error("Comment created but response data is missing");
    }

    setComments((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              CommentCount:
                newCommentCount !== undefined
                  ? newCommentCount
                  : (post.CommentCount || 0) + 1,
            }
          : post
      )
    );

    toast.success("Comment added successfully");

    return newComment;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while commenting";

    setError(message);
    toast.error(message);

    throw error;
  } finally {
    setLoading(false);
  }
};
const handleGetComments = async (postId) => {
  try {
    setLoading(true);
    setError(null);

    const response = await getComments(postId);

    const fetchedComments = response?.data?.comments || response?.data || [];

    setComments((prev) => ({
      ...prev,
      [postId]: fetchedComments,
    }));

    return fetchedComments;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong while fetching comments";

    setError(message);
    toast.error(message);

    throw error;
  } finally {
    setLoading(false);
  }
};


  return (
    <CommentContext.Provider
      value={{
        comments,
        setComments,
        loading,
        error,
        handleCreateComment,
        handleGetComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error(
      "useCommentContext must be used inside CommentContextProvider"
    );
  }

  return context;
}