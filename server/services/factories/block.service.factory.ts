import {BlockService} from '../block.service'
import {SupabaseBlockService} from '../supabase/block.service'

let blockService: BlockService | null = null

export function getBlockService(): BlockService {
    if (!blockService) {
        blockService = new SupabaseBlockService()
    }
    return blockService
}
