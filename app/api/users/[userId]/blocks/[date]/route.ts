import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

interface RouteParams {
    userId: string
    date: string
}

// 날짜 형식 검증
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

    // 날짜 형식 검증
    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        const blocks = await blockService.getBlocks(userId, date)
        return NextResponse.json(blocks)
    } catch (error) {
        console.error('Error fetching blocks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch blocks' },
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
        const blockData = await request.json()
        const block = await blockService.createBlock(userId, { ...blockData, date })
        return NextResponse.json(block)
    } catch (error) {
        console.error('Error creating block:', error)
        return NextResponse.json(
            { error: 'Failed to create block' },
            { status: 500 }
        )
    }
} 