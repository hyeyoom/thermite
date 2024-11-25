'use server'

import {getTodoService} from '@/server/services/factories/todo.service.factory'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {Todo} from '@/lib/types'

export async function addTodoServerAction(
    userId: string,
    blockId: string,
    content: string
): Promise<Todo> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const todoService = await getTodoService()
    return todoService.addTodo(blockId, {
        content,
        isCompleted: false
    })
}

export async function toggleTodoServerAction(
    userId: string,
    todoId: string,
    isCompleted: boolean
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const todoService = await getTodoService()
    await todoService.updateTodo(todoId, {isCompleted})
}

export async function deleteTodoServerAction(
    userId: string,
    todoId: string
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const todoService = await getTodoService()
    await todoService.deleteTodo(todoId)
}
