import {BlockType, Todo, Memo} from '@/lib/types'
import fs from 'fs'
import path from 'path'

// 메모리 스토리지 클래스
class MemoryStore {
    private blocks: Map<string, BlockType[]> = new Map() // key: userId_date
    private memos: Map<string, Memo[]> = new Map()       // key: userId_date
    private dataPath = path.join(process.cwd(), 'data', 'blocks.json')

    constructor() {
        this.loadFromStorage()
    }

    private loadFromStorage() {
        try {
            if (!fs.existsSync(path.dirname(this.dataPath))) {
                fs.mkdirSync(path.dirname(this.dataPath), { recursive: true })
            }
            
            if (fs.existsSync(this.dataPath)) {
                const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'))
                Object.entries(data).forEach(([key, value]) => {
                    this.blocks.set(key, value as BlockType[])
                })
            }
        } catch (e) {
            console.log('No saved data found')
        }
    }

    private saveToStorage() {
        try {
            const data: Record<string, BlockType[]> = {}
            this.blocks.forEach((value, key) => {
                data[key] = value
            })
            fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2))
        } catch (e) {
            console.error('Failed to save data:', e)
        }
    }

    // Blocks
    getAllBlocks(): BlockType[] {
        const allBlocks: BlockType[] = []
        this.blocks.forEach((blocks) => {
            allBlocks.push(...blocks)
        })
        return allBlocks
    }

    getBlocks(userId: string, date: string): BlockType[] {
        const key = `${userId}_${date}`
        return this.blocks.get(key) || []
    }

    addBlock(block: BlockType): void {
        const key = `${block.user_id}_${block.date}`
        const blocks = this.getBlocks(block.user_id, block.date)
        this.blocks.set(key, [...blocks, block])
        this.saveToStorage()
    }

    updateBlock(blockId: string, updates: Partial<BlockType>): void {
        this.blocks.forEach((blocks, key) => {
            const updatedBlocks = blocks.map(block =>
                block.id === blockId
                    ? { ...block, ...updates, updated_at: new Date().toISOString() }
                    : block
            )
            this.blocks.set(key, updatedBlocks)
        })
        this.saveToStorage()
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

    getBlockById(blockId: string): BlockType | undefined {
        let foundBlock: BlockType | undefined
        this.blocks.forEach((blocks) => {
            const block = blocks.find(b => b.id === blockId)
            if (block) {
                foundBlock = block
            }
        })
        return foundBlock
    }

    updateTodo(todoId: string, updates: Partial<Todo>): void {
        this.blocks.forEach((blocks, key) => {
            const updatedBlocks = blocks.map(block => ({
                ...block,
                todos: block.todos.map(todo =>
                    todo.id === todoId
                        ? { ...todo, ...updates, updated_at: new Date().toISOString() }
                        : todo
                )
            }))
            this.blocks.set(key, updatedBlocks)
        })
        this.saveToStorage()
    }

    deleteTodo(todoId: string): void {
        this.blocks.forEach((blocks, key) => {
            const updatedBlocks = blocks.map(block => ({
                ...block,
                todos: block.todos.filter(todo => todo.id !== todoId)
            }))
            this.blocks.set(key, updatedBlocks)
        })
        this.saveToStorage()
    }

    getTodos(blockId: string): Todo[] {
        const block = this.getBlockById(blockId)
        return block?.todos || []
    }
}

// 싱글톤 인스턴스 export
export const memoryStore = new MemoryStore()
