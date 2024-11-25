import {PlanningView} from '@/components/features/planning/planning-view'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'

export default async function PlanningPage() {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h1 className="text-4xl font-bold">:(</h1>
                <p className="text-xl text-muted-foreground">로그인이 필요해요</p>
                <p className="text-xl text-muted-foreground">상단의 Google 로그인을 눌러주세요.</p>
            </div>
        )
    }

    return <PlanningView userId={user.id}/>
}
