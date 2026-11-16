import { getUserAPI, logoutAPI } from "@/services/allAPI";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(()=>{
        checkAuth()
    },[])

    const checkAuth = async () => {
        try {
            const response = await getUserAPI()
            setUser(response)
        } catch (error) {
            console.error(error)
            setUser(null)
        } finally {
            setAuthLoading(false)
        }
    }

    const login=(userData)=>{
        setUser(userData)
    }

    const logout=async()=>{
        try{
            await logoutAPI()
        }catch(error){
            console.error(error)
        }finally{
            setUser(null)
        }
    }

    const loggedIn = !!user

    return (
        <AuthContext.Provider value={{ loggedIn, user, authLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider

export function useAuth() {
    return useContext(AuthContext)
}