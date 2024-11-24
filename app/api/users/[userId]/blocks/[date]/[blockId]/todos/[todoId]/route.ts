import { NextResponse } from 'next/server'
import { getTodoService } from '@/server/services/factories/todo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

interface RouteParams {
    userId: string
    date: string
    blockId: string
    todoId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, todoId } = params

    try {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const updates = await request.json()
        const todoService = await getTodoService()
        await todoService.updateTodo(todoId, updates)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating todo:', error)
        return NextResponse.json(
            { error: 'Failed to update todo' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, todoId } = params

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
        await todoService.deleteTodo(todoId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting todo:', error)
        return NextResponse.json(
            { error: 'Failed to delete todo' },
            { status: 500 }
        )
    }
}
