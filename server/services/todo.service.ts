import { Todo } from "@/lib/types"

export interface TodoService {
    getTodos(blockId: string): Promise<Todo[]>
    
    addTodo(blockId: string, todoData: Partial<Todo>): Promise<Todo>
    
    updateTodo(todoId: string, updates: Partial<Todo>): Promise<void>
    
    deleteTodo(todoId: string): Promise<void>
} 