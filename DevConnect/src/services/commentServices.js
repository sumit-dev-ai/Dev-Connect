import { api } from "@/api/axios";

export const createComment = async (postid,content)=>{
    try {
        const response = await api.post(`/comments/${postid}/create-comment`,{ content : content})
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.message ||error?.message || "something went wrong while comemnting"
        throw new Error(message);
        
    }
}

export const getComments = async (postid)=>{
    try {
        const response = await api.get(`/comments/${postid}/comments`);
        return response.data;
    } catch (error) {
         const message = error?.response?.data?.message ||error?.message || "something went wrong while comemnting"
        throw new Error(message);
    }
}