import { NextResponse } from 'next/server'
import { TodoService } from '@/server/services/todo.service'
import { BlockService } from '@/server/services/block.service'

const todoService: TodoService = new BlockService()

interface RouteParams {
    userId: string
    date: string
    blockId: string
}

export async function GET(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { blockId } = params

    try {
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
    const { blockId } = params

    try {
        const todoData = await request.json()
        const todo = await todoService.addTodo(blockId, todoData)
        return NextResponse.json(todo)
    } catch (error) {
        console.error('Error creating todo:', error)
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        )
    }
} 