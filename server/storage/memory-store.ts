import {BlockType, Todo, Memo, Assessment} from '@/lib/types'
import fs from 'fs'
import path from 'path'

// 메모리 스토리지 클래스
class MemoryStore {
    private blocks: Map<string, BlockType[]> = new Map() // key: userId_date
    private memos: Map<string, Memo[]> = new Map()       // key: userId_date
    private assessments: Map<string, Assessment[]> = new Map()  // key: userId_date
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
                if (data.blocks) {
                    Object.entries(data.blocks).forEach(([key, value]) => {
                        this.blocks.set(key, value as BlockType[])
                    })
                }
                if (data.memos) {
                    Object.entries(data.memos).forEach(([key, value]) => {
                        this.memos.set(key, value as Memo[])
                    })
                }
                if (data.assessments) {
                    Object.entries(data.assessments).forEach(([key, value]) => {
                        this.assessments.set(key, value as Assessment[])
                    })
                }
            }
        } catch (e) {
            console.log('No saved data found')
        }
    }

    private saveToStorage() {
        try {
            const data = {
                blocks: Object.fromEntries(this.blocks),
                memos: Object.fromEntries(this.memos),
                assessments: Object.fromEntries(this.assessments)
            }
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

    // Memos
    getMemos(userId: string, date: string): Memo[] {
        const key = `${userId}_${date}`
        return this.memos.get(key) || []
    }

    addMemo(memo: Memo): void {
        const key = `${memo.user_id}_${memo.date}`
        const memos = this.getMemos(memo.user_id, memo.date)
        this.memos.set(key, [...memos, memo])
        this.saveToStorage()
    }

    updateMemo(memoId: string, updates: Partial<Memo>): void {
        this.memos.forEach((memos, key) => {
            const updatedMemos = memos.map(memo =>
                memo.id === memoId
                    ? { ...memo, ...updates, updated_at: new Date().toISOString() }
                    : memo
            )
            this.memos.set(key, updatedMemos)
        })
        this.saveToStorage()
    }

    deleteMemo(memoId: string): void {
        this.memos.forEach((memos, key) => {
            const updatedMemos = memos.filter(memo => memo.id !== memoId)
            if (updatedMemos.length !== memos.length) {
                this.memos.set(key, updatedMemos)
            }
        })
        this.saveToStorage()
    }

    // Reflection은 Block의 일부이므로 updateBlock을 사용
    updateReflection(blockId: string, reflection: string): void {
        this.updateBlock(blockId, { reflection })
    }

    // Assessments
    getAssessments(userId: string, date: string): Assessment[] {
        const key = `${userId}_${date}`
        return this.assessments.get(key) || []
    }

    addAssessment(userId: string, date: string, assessment: Assessment): void {
        const key = `${userId}_${date}`
        const assessments = this.getAssessments(userId, date)
        this.assessments.set(key, [...assessments, assessment])
        this.saveToStorage()
    }

    updateAssessment(assessmentId: string, content: string): void {
        this.assessments.forEach((assessments, key) => {
            const updatedAssessments = assessments.map(assessment =>
                assessment.id === assessmentId
                    ? { ...assessment, content }
                    : assessment
            )
            this.assessments.set(key, updatedAssessments)
        })
        this.saveToStorage()
    }

    deleteAssessment(assessmentId: string): void {
        this.assessments.forEach((assessments, key) => {
            const updatedAssessments = assessments.filter(
                assessment => assessment.id !== assessmentId
            )
            if (updatedAssessments.length !== assessments.length) {
                this.assessments.set(key, updatedAssessments)
            }
        })
        this.saveToStorage()
    }
}

// 싱글톤 인스턴스 export
export const memoryStore = new MemoryStore()
