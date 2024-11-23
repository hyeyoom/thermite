import { NextResponse } from 'next/server'
import { MemoService } from '@/server/services/memo.service'
import { BlockServiceImpl } from '@/server/services/legacy.block.service'

const memoService: MemoService = new BlockServiceImpl()

interface RouteParams {
    userId: string
    date: string
}

export async function GET(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, date } = params

    try {
        const memos = await memoService.getMemos(userId, date)
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

    try {
        const memoData = await request.json()
        const memo = await memoService.createMemo(userId, { ...memoData, date })
        return NextResponse.json(memo)
    } catch (error) {
        console.error('Error creating memo:', error)
        return NextResponse.json(
            { error: 'Failed to create memo' },
            { status: 500 }
        )
    }
}
