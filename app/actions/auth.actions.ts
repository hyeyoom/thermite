'use server'

import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {redirect} from 'next/navigation'

export async function signOutServerAction() {
    const supabase = await createSupabaseClientForServer()
    await supabase.auth.signOut()
    redirect('/')
}
