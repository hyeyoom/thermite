'use server'

import {getBlockService} from '@/server/services/factories/block.service.factory'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {BlockType} from '@/lib/types'

export async function fetchBlocksServerAction(userId: string, date: string): Promise<BlockType[]> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const blockService = await getBlockService()
    return blockService.getBlocks(userId, date)
}

export async function addBlockServerAction(userId: string, date: string, blockNumber: number): Promise<BlockType> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const blockService = await getBlockService()
    return blockService.createBlock(userId, {
        date,
        number: blockNumber
    })
}

export async function updateBlockServerAction(
    blockId: string,
    updates: Partial<BlockType>
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const blockService = await getBlockService()
    await blockService.updateBlock(blockId, updates)
}

export async function fetchWeeklyBlocksServerAction(userId: string, weekDates: string[]): Promise<BlockType[]> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const blockService = await getBlockService()
    const blocksPromises = weekDates.map(date => blockService.getBlocks(userId, date))
    const blocksArrays = await Promise.all(blocksPromises)

    // 모든 날짜의 블록을 하나의 배열로 합침
    return blocksArrays.flat()
}
