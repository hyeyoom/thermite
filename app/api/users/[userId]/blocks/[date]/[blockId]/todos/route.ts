import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

interface RouteParams {
    userId: string
    date: string
    blockId: string
}

function isValidDate(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateStr)) return false
    
    const date = new Date(dateStr)
    return date instanceof Date && !isNaN(date.getTime())
}

export async function GET(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { date, blockId } = params

    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        const todos = await blockService.getTodos(blockId)
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
        const todo = await blockService.addTodo(blockId, todoData)
        return NextResponse.json(todo)
    } catch (error) {
        console.error('Error creating todo:', error)
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        )
    }
} 