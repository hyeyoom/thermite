import { NextResponse } from 'next/server'
import { BlockServiceImpl } from '@/server/services/legacy.block.service'
import {BlockType} from "@/lib/types";

const blockService = new BlockServiceImpl()

interface RouteParams {
    date: string
    blockId: string
}

function isValidDate(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateStr)) return false

    const date = new Date(dateStr)
    return date instanceof Date && !isNaN(date.getTime())
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { date, blockId } = params

    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        const updates: BlockType = await request.json()
        console.log(`blockId: ${blockId} updates: ${updates}`)
        await blockService.updateBlock(blockId, updates)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating block:', error)
        return NextResponse.json(
            { error: 'Failed to update block' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { date, blockId } = params

    if (!isValidDate(date)) {
        return NextResponse.json(
            { error: 'Invalid date format. Use YYYY-MM-DD' },
            { status: 400 }
        )
    }

    try {
        await blockService.deleteBlock(blockId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting block:', error)
        return NextResponse.json(
            { error: 'Failed to delete block' },
            { status: 500 }
        )
    }
}
