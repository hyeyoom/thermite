import { NextResponse } from 'next/server'
import { TodoService } from '@/server/services/todo.service'
import { BlockService } from '@/server/services/block.service'

const todoService: TodoService = new BlockService()

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
    const { todoId } = params

    try {
        const updates = await request.json()
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
    const { todoId } = params

    try {
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