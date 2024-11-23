import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { DailyViewClient } from './daily-view-client'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'

export async function DailyViewServer() {
    const today = new Date()
    const formattedDate = format(today, 'yyyy-MM-dd')
    
    const supabase = await createSupabaseClientForServer()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        redirect('/auth/signin')
    }

    return (
        <DailyViewClient 
            userId={user.id} 
            date={formattedDate} 
        />
    )
} 