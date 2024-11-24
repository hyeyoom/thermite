import { AssessmentService } from '../assessment.service'
import { SupabaseAssessmentService } from '../supabase/assessment.service'

let assessmentService: AssessmentService | null = null

export async function getAssessmentService(): Promise<AssessmentService> {
    if (!assessmentService) {
        assessmentService = new SupabaseAssessmentService()
    }
    return assessmentService
} 