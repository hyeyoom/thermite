import { BlockType, Todo, Memo } from '@/lib/types'

// 메모리 스토리지 클래스
class MemoryStore {
  private blocks: Map<string, BlockType[]> = new Map() // key: userId_date
  private todos: Map<string, Todo[]> = new Map()       // key: blockId
  private memos: Map<string, Memo[]> = new Map()       // key: userId_date

  // Blocks
  getBlocks(userId: string, date: string): BlockType[] {
    const key = `${userId}_${date}`
    return this.blocks.get(key) || []
  }

  addBlock(block: BlockType): void {
    const key = `${block.user_id}_${block.date}`
    const blocks = this.getBlocks(block.user_id, block.date)
    this.blocks.set(key, [...blocks, block])
  }

  updateBlock(blockId: string, updates: Partial<BlockType>): void {
    this.blocks.forEach((blocks, key) => {
      const updatedBlocks = blocks.map(block => 
        block.id === blockId ? { ...block, ...updates, updated_at: new Date().toISOString() } : block
      )
      this.blocks.set(key, updatedBlocks)
    })
  }

  deleteBlock(blockId: string): void {
    this.blocks.forEach((blocks, key) => {
      const filteredBlocks = blocks.filter(block => block.id !== blockId)
      if (filteredBlocks.length !== blocks.length) {
        // Reorder block numbers
        const reorderedBlocks = filteredBlocks.map((block, index) => ({
          ...block,
          number: index + 1
        }))
        this.blocks.set(key, reorderedBlocks)
      }
    })
  }

  // Todos
  addTodo(blockId: string, todo: Todo): void {
    const todos = this.todos.get(blockId) || []
    this.todos.set(blockId, [...todos, todo])
  }

  updateTodo(todoId: string, updates: Partial<Todo>): void {
    this.todos.forEach((todos, blockId) => {
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, ...updates, updated_at: new Date().toISOString() } : todo
      )
      this.todos.set(blockId, updatedTodos)
    })
  }

  deleteTodo(todoId: string): void {
    this.todos.forEach((todos, blockId) => {
      const filteredTodos = todos.filter(todo => todo.id !== todoId)
      if (filteredTodos.length !== todos.length) {
        this.todos.set(blockId, filteredTodos)
      }
    })
  }
}

// 싱글톤 인스턴스 export
export const memoryStore = new MemoryStore() 