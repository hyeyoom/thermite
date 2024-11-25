'use server'

import {getMemoService} from '@/server/services/factories/memo.service.factory'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {Memo} from '@/lib/types'

export async function fetchMemosServerAction(
    userId: string,
    date: string
): Promise<Memo[]> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const memoService = await getMemoService()
    return memoService.getMemos(userId, date)
}

export async function addMemoServerAction(
    userId: string,
    date: string,
    content: string
): Promise<Memo> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const memoService = await getMemoService()
    return memoService.addMemo(userId, date, content)
}

export async function updateMemoServerAction(
    userId: string,
    memoId: string,
    content: string
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const memoService = await getMemoService()
    await memoService.updateMemo(memoId, content)
}

export async function deleteMemoServerAction(
    userId: string,
    memoId: string
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const memoService = await getMemoService()
    await memoService.deleteMemo(memoId)
}
