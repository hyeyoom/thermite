'use client'

import {createContext, useCallback, useContext, useEffect, useState} from 'react'
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
    signOut: async () => {
    },
})

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // useCallback으로 fetchUser 메모이제이션
    const fetchUser = useCallback(async () => {
        try {
            const supabase = createSupabaseClientForBrowser()
            const {data: {user}, error} = await supabase.auth.getUser()

            // AuthSessionMissingError는 정상적인 로그아웃 상태를 의미하므로 무시
            if (error && error.name !== 'AuthSessionMissingError') {
                console.error('사용자 정보 조회 중 오류:', error)
            }

            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        } catch (error: unknown) {
            if (error instanceof Error){
                setUser(null)
            }
            setUser(null)
        }
    }, [])

    const signOut = useCallback(async () => {
        try {
            const supabase = createSupabaseClientForBrowser()
            const {error} = await supabase.auth.signOut()
            if (error) throw error

            setUser(null)
            window.location.replace('/')
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error)
        }
    }, [])

    useEffect(() => {
        // 초기 사용자 상태 확인
        fetchUser().finally(() => setLoading(false))

        // 인증 상태 변경 감지
        const supabase = createSupabaseClientForBrowser()
        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                await fetchUser()
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [fetchUser])

    return (
        <AuthContext.Provider value={{user, loading, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
