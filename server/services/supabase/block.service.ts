import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { BlockType } from '@/lib/types'
import { BlockService } from '../block.service'

export class SupabaseBlockService implements BlockService {
    async getBlocks(userId: string, date: string): Promise<BlockType[]> {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('Unauthorized')
        }

        console.log('Fetching blocks with todos for date:', date)

        const { data, error } = await supabase
            .from('blocks')
            .select(`
                *,
                block_todos!inner (
                    *
                )
            `)
            .eq('user_id', user.id)
            .eq('date', date)
            .is('block_todos.deleted_at', null)
            .order('block_number', { ascending: true })

        if (error) {
            console.error('Error fetching blocks:', error)
            throw error
        }

        console.log('Found blocks with todos:', data)

        return (data || []).map(block => ({
            id: block.id,
            user_id: block.user_id,
            date: block.date,
            number: block.block_number,
            title: block.block_title,
            startTime: block.start_time,
            endTime: block.end_time,
            todos: (block.block_todos || []).map(todo => ({
                id: todo.id,
                block_id: todo.block_id,
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

    async createBlock(userId: string, blockData: Partial<BlockType>): Promise<BlockType> {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('Unauthorized')
        }

        const { data, error } = await supabase
            .from('blocks')
            .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                date: blockData.date,
                block_number: blockData.number || 1,
                block_title: blockData.title || '',
                start_time: blockData.startTime || '',
                end_time: blockData.endTime || '',
                reflection: blockData.reflection || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

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
        
        const { error } = await supabase
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
        
        const { error } = await supabase
            .from('blocks')
            .delete()
            .eq('id', blockId)

        if (error) throw error
    }

    async updateReflection(blockId: string, reflection: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()
        
        const { error } = await supabase
            .from('blocks')
            .update({
                reflection,
                updated_at: new Date().toISOString()
            })
            .eq('id', blockId)

        if (error) throw error
    }
} 