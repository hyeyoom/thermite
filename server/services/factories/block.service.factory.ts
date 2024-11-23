import { BlockService } from '../block.service'
import { SupabaseBlockService } from '../supabase/block.service'

let blockService: BlockService | null = null

export async function getBlockService(): Promise<BlockService> {
    if (!blockService) {
        blockService = new SupabaseBlockService()
    }
    return blockService
} 