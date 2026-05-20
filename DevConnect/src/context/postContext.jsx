import { createContext, useContext, useState } from "react";

const PostContext = createContext(null);

export const PostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [loading ,setLoading]=useState(false)
    const [error , setError] = useState(null)
   
    

    return (
        <PostContext.Provider
            value={{
                posts , setPosts , loading , setLoading , error , setError
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export function usePostContext() {
    return useContext(PostContext);
}