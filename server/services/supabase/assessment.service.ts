import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { AssessmentService, AssessmentType } from '../assessment.service'
import { Assessment } from '@/lib/types'

export class SupabaseAssessmentService implements AssessmentService {
    async getAssessments(userId: string, date: string): Promise<Assessment[]> {
        const supabase = await createSupabaseClientForServer()
        
        const { data, error } = await supabase
            .from('block_assessments')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .is('deleted_at', null)
            .order('created_at', { ascending: true })

        if (error) throw error

        return data.map(assessment => ({
            id: assessment.id,
            type: assessment.type as AssessmentType,
            content: assessment.content,
            created_at: assessment.created_at,
            updated_at: assessment.updated_at
        }))
    }

    async addAssessment(userId: string, date: string, type: AssessmentType, content: string): Promise<Assessment> {
        const supabase = await createSupabaseClientForServer()

        const { data, error } = await supabase
            .from('block_assessments')
            .insert({
                user_id: userId,
                date: date,
                type: type,
                content: content
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            type: data.type as AssessmentType,
            content: data.content,
            created_at: data.created_at,
            updated_at: data.updated_at
        }
    }

    async updateAssessment(assessmentId: string, content: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const { error } = await supabase
            .from('block_assessments')
            .update({
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('id', assessmentId)

        if (error) throw error
    }

    async deleteAssessment(assessmentId: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const { error } = await supabase
            .from('block_assessments')
            .update({
                deleted_at: new Date().toISOString()
            })
            .eq('id', assessmentId)

        if (error) throw error
    }
} 