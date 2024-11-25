import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {DailyViewClient} from './daily-view-client'
import {Suspense} from "react";

interface DailyViewServerProps {
  date: string
}

export async function DailyViewServer({ date }: DailyViewServerProps) {
    const supabase = await createSupabaseClientForServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>로그인이 필요합니다.</div>
    }

    return (
        <Suspense>
            <DailyViewClient userId={user.id} date={date} />
        </Suspense>
    )
}
