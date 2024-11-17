import { BlockType } from '@/lib/types'
import { memoryStore } from '../storage/memory-store'

export class BlockService {
  async getBlocks(userId: string, date: string): Promise<BlockType[]> {
    return memoryStore.getBlocks(userId, date)
  }

  async createBlock(userId: string, blockData: Partial<BlockType>): Promise<BlockType> {
    const newBlock: BlockType = {
      id: Date.now().toString(),
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      number: blockData.number || 1,
      title: blockData.title || '',
      startTime: blockData.startTime || '',
      endTime: blockData.endTime || '',
      todos: [],
      reflection: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    memoryStore.addBlock(newBlock)
    return newBlock
  }

  async updateBlock(blockId: string, updates: Partial<BlockType>): Promise<void> {
    memoryStore.updateBlock(blockId, updates)
  }

  async deleteBlock(blockId: string): Promise<void> {
    memoryStore.deleteBlock(blockId)
  }
} 