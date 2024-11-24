'use server'

import { getAssessmentService } from '@/server/services/factories/assessment.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'
import { Assessment } from '@/lib/types'

export async function fetchAssessmentsServerAction(
  userId: string, 
  date: string
): Promise<Assessment[]> {
  const supabase = await createSupabaseClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const assessmentService = await getAssessmentService()
  return assessmentService.getAssessments(userId, date)
} 