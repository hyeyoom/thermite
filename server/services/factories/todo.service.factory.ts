import {TodoService} from '../todo.service'
import {SupabaseTodoService} from '../supabase/todo.service'

let todoService: TodoService | null = null

export function getTodoService(): TodoService {
    if (!todoService) {
        todoService = new SupabaseTodoService()
    }
    return todoService
}
