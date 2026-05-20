import useAuthContext from "@/context/authContext"
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){

    const {user}= useAuthContext();
    
    if (!user) {
        return <Navigate to="/login" />
    }
    return children;
}