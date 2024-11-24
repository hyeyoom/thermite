import { NextResponse } from 'next/server'
import { getAssessmentService } from '@/server/services/factories/assessment.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

interface RouteParams {
    userId: string
    date: string
    assessmentId: string
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, assessmentId } = params
    
    try {
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const assessmentService = await getAssessmentService()
        await assessmentService.deleteAssessment(assessmentId)
        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Error deleting assessment:', error)
        return NextResponse.json(
            { error: 'Failed to delete assessment' },
            { status: 500 }
        )
    }
}
