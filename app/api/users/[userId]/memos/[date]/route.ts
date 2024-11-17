import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

interface RouteParams {
    userId: string
    date: string
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
    const { userId, date } = params

    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        const memos = await blockService.getMemos(userId, date)
        return NextResponse.json(memos)
    } catch (error) {
        console.error('Error fetching memos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memos' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, date } = params

    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        const memoData = await request.json()
        const memo = await blockService.createMemo(userId, { ...memoData, date })
        return NextResponse.json(memo)
    } catch (error) {
        console.error('Error creating memo:', error)
        return NextResponse.json(
            { error: 'Failed to create memo' },
            { status: 500 }
        )
    }
} 