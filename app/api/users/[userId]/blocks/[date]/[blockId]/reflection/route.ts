import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

interface RouteParams {
    userId: string
    date: string
    blockId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { blockId } = params

    try {
        const { reflection } = await request.json()
        await blockService.updateReflection(blockId, reflection)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating reflection:', error)
        return NextResponse.json(
            { error: 'Failed to update reflection' },
            { status: 500 }
        )
    }
} 