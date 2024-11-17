import { NextResponse } from 'next/server'
import { BlockService } from '@/server/services/block.service'

const blockService = new BlockService()

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
        const assessments = await blockService.getAssessments(userId, date)
        return NextResponse.json(assessments)
    } catch (error) {
        console.error('Error fetching assessments:', error)
        return NextResponse.json(
            { error: 'Failed to fetch assessments' },
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
        const { type, content } = await request.json()
        const assessment = await blockService.addAssessment(userId, date, type, content)
        return NextResponse.json(assessment)
    } catch (error) {
        console.error('Error creating assessment:', error)
        return NextResponse.json(
            { error: 'Failed to create assessment' },
            { status: 500 }
        )
    }
} 