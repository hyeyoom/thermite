import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'
import { BlockServiceImpl } from '@/server/services/legacy.block.service'

const blockService: BlockService = new BlockServiceImpl()

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
