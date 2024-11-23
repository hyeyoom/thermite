import { NextResponse } from 'next/server'
import { getBlockService } from '@/server/services/factories/block.service.factory'

interface RouteParams {
    userId: string
    date: string
}

export async function GET(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, date } = params
    const blockService = await getBlockService()

    try {
        const blocks = await blockService.getBlocks(userId, date)
        return NextResponse.json(blocks)
    } catch (error: any) {
        console.error('Error fetching blocks:', error)
        
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

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
    const blockService = await getBlockService()

    try {
        const blockData = await request.json()
        const block = await blockService.createBlock(userId, { ...blockData, date })
        return NextResponse.json(block)
    } catch (error: any) {
        console.error('Error creating block:', error)
        
        if (error.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create block' },
            { status: 500 }
        )
    }
}
