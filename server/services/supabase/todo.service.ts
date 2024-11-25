import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {TodoService} from '../todo.service'
import {Todo} from '@/lib/types'
import {Database} from '@/lib/utils/supabase/supabase'

type DbTodo = Database['public']['Tables']['block_todos']['Row']

export class SupabaseTodoService implements TodoService {
    async getTodos(blockId: string): Promise<Todo[]> {
        const supabase = await createSupabaseClientForServer()

        const {data, error} = await supabase
            .from('block_todos')
            .select('*')
            .eq('block_id', blockId)
            .is('deleted_at', null)
            .order('created_at', {ascending: true})

        if (error) throw error

        return (data || []).map(this.mapDbTodoToTodo)
    }

    async addTodo(blockId: string, todoData: Partial<Todo>): Promise<Todo> {
        const supabase = await createSupabaseClientForServer()
        const {data: {user}} = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        const {data, error} = await supabase
            .from('block_todos')
            .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                block_id: blockId,
                content: todoData.content || '',
                is_completed: todoData.isCompleted || false
            })
            .select()
            .single()

        if (error) {
            console.error('Todo creation error:', error)
            throw error
        }

        return this.mapDbTodoToTodo(data)
    }

    async updateTodo(todoId: string, updates: Partial<Todo>): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('block_todos')
            .update({
                content: updates.content,
                is_completed: updates.isCompleted,
                updated_at: new Date().toISOString()
            })
            .eq('id', todoId)

        if (error) throw error
    }

    async deleteTodo(todoId: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('block_todos')
            .update({
                deleted_at: new Date().toISOString()
            })
            .eq('id', todoId)

        if (error) throw error
    }

    private mapDbTodoToTodo(dbTodo: DbTodo): Todo {
        return {
            id: dbTodo.id,
            block_id: dbTodo.block_id || '',
            content: dbTodo.content,
            isCompleted: dbTodo.is_completed,
            created_at: dbTodo.created_at,
            updated_at: dbTodo.updated_at
        }
    }
}
