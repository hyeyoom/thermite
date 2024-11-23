import { NextResponse } from 'next/server'
import { AssessmentService } from '@/server/services/assessment.service'
import { BlockServiceImpl } from '@/server/services/legacy.block.service'

// 임시로 BlockService를 통해 AssessmentService를 얻습니다
const assessmentService: AssessmentService = new BlockServiceImpl()

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
        const assessments = await assessmentService.getAssessments(userId, date)
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
        const assessment = await assessmentService.addAssessment(userId, date, type, content)
        return NextResponse.json(assessment)
    } catch (error) {
        console.error('Error creating assessment:', error)
        return NextResponse.json(
            { error: 'Failed to create assessment' },
            { status: 500 }
        )
    }
}
