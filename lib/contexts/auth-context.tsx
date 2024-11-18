'use client'

import {createContext, useContext, useEffect, useState} from 'react'
import {User} from '@supabase/supabase-js'
import {createSupabaseClientForBrowser} from "@/lib/utils/supabase/client";

type AuthContextType = {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => {},
})

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createSupabaseClientForBrowser()

    useEffect(() => {
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/' // 로그아웃 후 홈페이지로 리다이렉트
    }

    return (
        <AuthContext.Provider value={{user, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
