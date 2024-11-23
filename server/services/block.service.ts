import {BlockType} from "@/lib/types"

export interface BlockService {
    getBlocks(userId: string, date: string): Promise<BlockType[]>

    createBlock(userId: string, blockData: Partial<BlockType>): Promise<BlockType>

    updateBlock(blockId: string, updates: Partial<BlockType>): Promise<void>

    deleteBlock(blockId: string): Promise<void>

    updateReflection(blockId: string, reflection: string): Promise<void>
}
