'use server'

import {getAssessmentService} from '@/server/services/factories/assessment.service.factory'
import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {Assessment} from '@/lib/types'

export async function fetchAssessmentsServerAction(
    userId: string,
    date: string
): Promise<Assessment[]> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const assessmentService = getAssessmentService()
    return assessmentService.getAssessments(userId, date)
}

export async function addAssessmentServerAction(
    userId: string,
    date: string,
    type: 'good' | 'bad' | 'next',
    content: string
): Promise<Assessment> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const assessmentService = getAssessmentService()
    return assessmentService.addAssessment(userId, date, type, content)
}

export async function updateAssessmentServerAction(
    userId: string,
    assessmentId: string,
    content: string
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const assessmentService = getAssessmentService()
    await assessmentService.updateAssessment(assessmentId, content)
}

export async function deleteAssessmentServerAction(
    userId: string,
    assessmentId: string
): Promise<void> {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const assessmentService = getAssessmentService()
    await assessmentService.deleteAssessment(assessmentId)
}
