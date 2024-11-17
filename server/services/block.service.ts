import { BlockType, Todo, Memo } from '@/lib/types'
import { memoryStore } from '../storage/memory-store'

export class BlockService {
  async getBlocks(userId: string, date: string): Promise<BlockType[]> {
    return memoryStore.getBlocks(userId, date)
  }

  async createBlock(userId: string, blockData: Partial<BlockType>): Promise<BlockType> {
    const newBlock: BlockType = {
      id: Date.now().toString(),
      user_id: userId,
      date: blockData.date || new Date().toISOString().split('T')[0],
      number: blockData.number || 1,
      title: blockData.title || '',
      startTime: blockData.startTime || '',
      endTime: blockData.endTime || '',
      todos: [],
      reflection: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Creating new block:', newBlock)
    memoryStore.addBlock(newBlock)
    return newBlock
  }

  async updateBlock(blockId: string, updates: Partial<BlockType>): Promise<void> {
    memoryStore.updateBlock(blockId, updates)
  }

  async deleteBlock(blockId: string): Promise<void> {
    memoryStore.deleteBlock(blockId)
  }

  async getTodos(blockId: string): Promise<Todo[]> {
    const block = await this.getBlockById(blockId)
    return block?.todos || []
  }

  async addTodo(blockId: string, todoData: Partial<Todo>): Promise<Todo> {
    console.log("Block Id:", blockId)
    const block = memoryStore.getBlockById(blockId)
    
    if (!block) {
        throw new Error(`Block not found with id: ${blockId}`)
    }

    const newTodo: Todo = {
        id: Date.now().toString(),
        block_id: blockId,
        content: todoData.content || '',
        isCompleted: todoData.isCompleted || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    const updatedTodos = [...block.todos, newTodo]
    await this.updateBlock(blockId, { todos: updatedTodos })

    return newTodo
  }

  async updateTodo(todoId: string, updates: Partial<Todo>): Promise<void> {
    memoryStore.updateTodo(todoId, updates)
  }

  async deleteTodo(todoId: string): Promise<void> {
    memoryStore.deleteTodo(todoId)
  }

  private async getAllBlocks(): Promise<BlockType[]> {
    return memoryStore.getAllBlocks()
  }

  private async getBlockById(blockId: string): Promise<BlockType | undefined> {
    const allBlocks = await this.getAllBlocks()
    return allBlocks.find(block => block.id === blockId)
  }

  // Memos
  async getMemos(userId: string, date: string): Promise<Memo[]> {
    return memoryStore.getMemos(userId, date)
  }

  async createMemo(userId: string, memoData: Partial<Memo>): Promise<Memo> {
    const newMemo: Memo = {
      id: Date.now().toString(),
      user_id: userId,
      date: memoData.date || new Date().toISOString().split('T')[0],
      content: memoData.content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    memoryStore.addMemo(newMemo)
    return newMemo
  }

  async updateMemo(memoId: string, updates: Partial<Memo>): Promise<void> {
    memoryStore.updateMemo(memoId, updates)
  }

  async deleteMemo(memoId: string): Promise<void> {
    memoryStore.deleteMemo(memoId)
  }

  // Reflection
  async updateReflection(blockId: string, reflection: string): Promise<void> {
    memoryStore.updateReflection(blockId, reflection)
  }
}
