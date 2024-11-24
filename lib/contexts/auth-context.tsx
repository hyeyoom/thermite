'use client'

import {createContext, useContext, useEffect, useState, useCallback} from 'react'
import {User} from '@supabase/supabase-js'
import {createSupabaseClientForBrowser} from "@/lib/utils/supabase/client"

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

    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            window.location.href = '/' // 홈페이지로 리다이렉트
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }, [supabase.auth])

    // useCallback으로 fetchUser 메모이제이션
    const fetchUser = useCallback(async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw error
            setUser(user)
        } catch (error) {
            console.error('Error getting user:', error)
            setUser(null)
        }
    }, [supabase.auth])

    useEffect(() => {
        // 초기 사용자 상태 확인
        fetchUser().finally(() => setLoading(false))

        // 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                await fetchUser()
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase.auth, fetchUser])

    return (
        <AuthContext.Provider value={{user, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
