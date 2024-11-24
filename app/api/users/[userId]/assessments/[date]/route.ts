import { NextResponse } from 'next/server'
import { getAssessmentService } from '@/server/services/factories/assessment.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { AssessmentType } from '@/server/services/assessment.service'

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
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const assessmentService = await getAssessmentService()
        const assessments = await assessmentService.getAssessments(userId, date)
        return NextResponse.json(assessments)
    } catch (error: unknown) {
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
        const supabase = await createSupabaseClientForServer()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user || user.id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { type, content } = await request.json()
        const assessmentService = await getAssessmentService()
        const assessment = await assessmentService.addAssessment(userId, date, type as AssessmentType, content)
        return NextResponse.json(assessment)
    } catch (error: unknown) {
        console.error('Error creating assessment:', error)
        return NextResponse.json(
            { error: 'Failed to create assessment' },
            { status: 500 }
        )
    }
}
