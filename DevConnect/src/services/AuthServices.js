import { api } from "@/api/axios"

export const createUser = async (userData) => {
    try {
        const response = await api.post("/users/register", userData);
        console.log(response.data)
        return response.data;

    } catch (error) {
       throw error;
    }
}


export const loginUser = async (userData) => {
    try {
        const response = await api.post("/users/login", userData);

        return response.data;

    } catch (error) {
        throw  error;
}
}

export const logoutUser = async()=>{
    try {
        const response = await api.post("/users/logout");
        return response.data;
    } catch (error) {
        throw error
    }
}

export const editProfileDetails=async(userData)=>{
try {
    const response = await api.patch("/users/editprofile",userData);
    return response.data;
} catch (error) {
    throw error;
}
}

export const getProfiles=async()=>{
    try {
        const response = await api.get("/users/getprofiles")
        return response.data
    } catch (error) {
     throw error;   
    }
}
export const followController=async(profileid)=>{
    try {
        const response = await api.post(`/users/${profileid}/follow`)
        return response.data
    } catch (error) {
     throw error;   
    }
}

export const unFollowController = async (profileId) => {
  const response = await api.delete(`/users/${profileId}/unfollow`);
  return response.data;
};