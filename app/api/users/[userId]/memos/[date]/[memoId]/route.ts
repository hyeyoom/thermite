import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

interface RouteParams {
    userId: string
    date: string
    memoId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { memoId } = params

    try {
        const updates = await request.json()
        await blockService.updateMemo(memoId, updates)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating memo:', error)
        return NextResponse.json(
            { error: 'Failed to update memo' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { memoId } = params

    try {
        await blockService.deleteMemo(memoId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting memo:', error)
        return NextResponse.json(
            { error: 'Failed to delete memo' },
            { status: 500 }
        )
    }
} 