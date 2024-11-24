'use server'

import { getMemoService } from '@/server/services/factories/memo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { Memo } from '@/lib/types'

export async function fetchMemosServerAction(
  userId: string, 
  date: string
): Promise<Memo[]> {
  const supabase = await createSupabaseClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const memoService = await getMemoService()
  return memoService.getMemos(userId, date)
} 