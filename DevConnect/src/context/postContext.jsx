import { likePostController, unlikePostController } from "@/services/postServices";
import { createContext, useContext, useState } from "react";

const PostContext = createContext(null);

export const PostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLikePost = async (postid) => {
        try {
            
            const data = await likePostController(postid);
            const updatedPost = data.data;
            console.log(updatedPost)
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedPost.postId
                        ? {
                            ...post,
                            likesCount: updatedPost.likesCount,
                            isLiked: updatedPost.isLiked,
                        }
                        : post
                )
            );

        } catch (error) {
            throw error
        }
    }
    const handleUnlikePost = async (postid) => {
        try {
            const data = await unlikePostController(postid);
            const updatedPost = data.data;
            console.log(updatedPost)
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedPost.postId
                        ? {
                            ...post,
                            likesCount: updatedPost.likesCount,
                            isLiked: updatedPost.isLiked,
                        }
                        : post
                )
            );

        } catch (error) {
            throw error
        }
    }


    return (
        <PostContext.Provider
            value={{
                posts, setPosts, loading, setLoading, error, setError, handleLikePost , handleUnlikePost
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export function usePostContext() {
    return useContext(PostContext);
}