import { NextResponse } from 'next/server'
import { getBlockService } from '@/server/services/factories/block.service.factory'

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
