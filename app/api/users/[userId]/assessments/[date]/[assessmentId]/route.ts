import { NextResponse } from 'next/server'
import { AssessmentService } from '@/server/services/assessment.service'
import { BlockService } from '@/server/services/block.service'

const assessmentService: AssessmentService = new BlockService()

interface RouteParams {
    userId: string
    date: string
    assessmentId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { assessmentId } = params

    try {
        const { content } = await request.json()
        await assessmentService.updateAssessment(assessmentId, content)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating assessment:', error)
        return NextResponse.json(
            { error: 'Failed to update assessment' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { assessmentId } = params

    try {
        await assessmentService.deleteAssessment(assessmentId)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting assessment:', error)
        return NextResponse.json(
            { error: 'Failed to delete assessment' },
            { status: 500 }
        )
    }
} 