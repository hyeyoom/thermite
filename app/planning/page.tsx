import {PlanningView} from '@/components/features/planning/planning-view'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {redirect} from 'next/navigation'

export default async function PlanningPage() {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return <PlanningView userId={user.id}/>
}
