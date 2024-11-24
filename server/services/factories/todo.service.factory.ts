import { TodoService } from '../todo.service'
import { SupabaseTodoService } from '../supabase/todo.service'

let todoService: TodoService | null = null

export async function getTodoService(): Promise<TodoService> {
    if (!todoService) {
        todoService = new SupabaseTodoService()
    }
    return todoService
} 