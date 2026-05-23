import { api } from "@/api/axios";

export const createPost = async (formData) => {

    try {
        const response = await api.post("/posts/create-post", formData);
        return response.data;

    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error.message || "Something went wrong";

        throw new Error(message);
    }

}

export const getFeedPosts = async ()=>{
   try {
     const response = await api.get("/posts")
     return response.data;
   } catch (error) {
    const message =
            error?.response?.data?.message ||
            error.message || "Something went wrong";

        throw new Error(message);
   }

}

export const likePostController = async (postId)=>{
    try {
        const response= await api.patch(`/posts/${postId}/like`)
        return response.data;

    } catch (error) {
            const message =
            error?.response?.data?.message ||
            error.message || "Something went wrong";

        throw new Error(message);
    }
}
export const unlikePostController = async (postId)=>{
    try {
        const response= await api.patch(`/posts/${postId}/unlike`)
        return response.data;

    } catch (error) {
            const message =
            error?.response?.data?.message ||
            error.message || "Something went wrong";

        throw new Error(message);
    }
}