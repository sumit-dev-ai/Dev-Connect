import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    user: null,
    setUser: () => {}
});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [profiles , setProfiles] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                profiles,
                setProfiles
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    return useContext(AuthContext);
}