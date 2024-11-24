'use server'

import { getBlockService } from '@/server/services/factories/block.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { BlockType } from '@/lib/types'

export async function fetchBlocksServerAction(userId: string, date: string): Promise<BlockType[]> {
  const supabase = await createSupabaseClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const blockService = await getBlockService()
  return blockService.getBlocks(userId, date)
}

export async function addBlockServerAction(userId: string, date: string, blockNumber: number): Promise<BlockType> {
  const supabase = await createSupabaseClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const blockService = await getBlockService()
  return blockService.createBlock(userId, {
    date,
    number: blockNumber
  })
}
