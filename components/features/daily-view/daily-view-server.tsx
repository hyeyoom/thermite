import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {DailyViewClient} from './daily-view-client'
import {format} from 'date-fns'
import {Suspense} from "react";

export async function DailyViewServer() {
    const today = new Date()
    const formattedDate = format(today, 'yyyy-MM-dd')

    const supabase = await createSupabaseClientForServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>로그인이 필요합니다.</div>
    }

    return (
        <Suspense>
            <DailyViewClient userId={user.id} date={formattedDate} />
        </Suspense>
    )
}
