import {NextResponse} from 'next/server'
import {getBlockService} from '@/server/services/factories/block.service.factory'

interface RouteParams {
    userId: string
    date: string
}

export async function POST(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, date } = params
    const blockService = await getBlockService()

    try {
        const blockData = await request.json()
        console.log('Creating block with data:', {
            userId,
            date,
            blockData
        })

        const block = await blockService.createBlock(userId, {
            date,
            number: blockData.number,
            title: blockData.title || '',
            startTime: blockData.startTime || '',
            endTime: blockData.endTime || '',
            reflection: blockData.reflection || ''
        })

        return NextResponse.json(block)
    } catch (error: unknown) {
        console.error('Error creating block:', error)

        if (error instanceof Error && error.message === 'Unauthorized') {
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
