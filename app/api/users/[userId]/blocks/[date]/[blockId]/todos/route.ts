import { NextResponse } from 'next/server'
import { getTodoService } from '@/server/services/factories/todo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

interface RouteParams {
    userId: string
    date: string
    blockId: string
}

export async function GET(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, blockId } = params
    
    try {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const todoService = await getTodoService()
        const todos = await todoService.getTodos(blockId)
        return NextResponse.json(todos)
    } catch (error) {
        console.error('Error fetching todos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch todos' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, blockId } = params

    try {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const todoData = await request.json()
        const todoService = await getTodoService()
        const todo = await todoService.addTodo(blockId, todoData)
        return NextResponse.json(todo)
    } catch (error: any) {
        console.error('Error creating todo:', {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint
        })
        return NextResponse.json(
            { error: error.message || 'Failed to create todo' },
            { status: 500 }
        )
    }
}
