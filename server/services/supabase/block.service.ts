import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {BlockType} from '@/lib/types'
import {BlockService} from '../block.service'

interface CreateBlockData {
    date: string;
    number?: number;
    title?: string;
    startTime?: string;
    endTime?: string;
    reflection?: string;
}

export class SupabaseBlockService implements BlockService {
    async getBlocks(userId: string, date: string): Promise<BlockType[]> {
        const supabase = await createSupabaseClientForServer()
        const {data: {user}} = await supabase.auth.getUser()

        console.log('Fetching blocks for date:', date)

        if (!user) {
            throw new Error('Unauthorized')
        }

        // 먼저 blocks만 조회
        const {data: blocks, error: blocksError} = await supabase
            .from('blocks')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', date)
            .order('block_number', {ascending: true})

        if (blocksError) throw blocksError

        // 각 블록에 대한 todos 조회
        const {data: todos, error: todosError} = await supabase
            .from('block_todos')
            .select('*')
            .in('block_id', blocks.map(block => block.id))
            .is('deleted_at', null)

        if (todosError) throw todosError

        // 블록과 todos 매핑
        return blocks.map(block => ({
            id: block.id,
            user_id: block.user_id,
            date: block.date,
            number: block.block_number,
            title: block.block_title,
            startTime: block.start_time,
            endTime: block.end_time,
            todos: (todos || [])
                .filter(todo => todo.block_id === block.id)
                .map(todo => ({
                    id: todo.id,
                    block_id: todo.block_id || block.id,
                    content: todo.content,
                    isCompleted: todo.is_completed,
                    created_at: todo.created_at,
                    updated_at: todo.updated_at
                })),
            reflection: block.reflection,
            created_at: block.created_at,
            updated_at: block.updated_at
        }))
    }

    async createBlock(userId: string, blockData: CreateBlockData): Promise<BlockType> {
        const supabase = await createSupabaseClientForServer()
        const {data: {user}} = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        const {data, error} = await supabase
            .from('blocks')
            .insert({
                date: blockData.date,
                block_number: blockData.number || 1,
                block_title: blockData.title || '',
                start_time: blockData.startTime || '',
                end_time: blockData.endTime || '',
                reflection: blockData.reflection || '',
            })
            .select()
            .single()

        if (error) {
            console.error(error)
            throw error
        }

        return {
            id: data.id,
            user_id: data.user_id,
            date: data.date,
            number: data.block_number,
            title: data.block_title,
            startTime: data.start_time,
            endTime: data.end_time,
            todos: [],
            reflection: data.reflection,
            created_at: data.created_at,
            updated_at: data.updated_at
        }
    }

    async updateBlock(blockId: string, updates: Partial<BlockType>): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('blocks')
            .update({
                block_title: updates.title,
                start_time: updates.startTime,
                end_time: updates.endTime,
                reflection: updates.reflection,
                updated_at: new Date().toISOString()
            })
            .eq('id', blockId)

        if (error) throw error
    }

    async deleteBlock(blockId: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('blocks')
            .delete()
            .eq('id', blockId)

        if (error) throw error
    }

    async updateReflection(blockId: string, reflection: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('blocks')
            .update({
                reflection,
                updated_at: new Date().toISOString()
            })
            .eq('id', blockId)

        if (error) throw error
    }
}
