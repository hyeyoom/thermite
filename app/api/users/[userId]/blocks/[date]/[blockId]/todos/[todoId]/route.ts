import { NextResponse } from 'next/server'
import { getTodoService } from '@/server/services/factories/todo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

interface RouteParams {
    userId: string
    date: string
    blockId: string
    todoId: string
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
