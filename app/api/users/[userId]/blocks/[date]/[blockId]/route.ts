import { NextResponse } from 'next/server'
import { getBlockService } from '@/server/services/factories/block.service.factory'
import { BlockType } from '@/lib/types'

interface RouteParams {
    blockId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { blockId } = params
    const blockService = await getBlockService()

    try {
        const updates: Partial<BlockType> = await request.json()
        await blockService.updateBlock(blockId, updates)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error updating block:', error)
        
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to update block' },
            { status: 500 }
        )
    }
}
