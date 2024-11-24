import {Assessment} from "@/lib/types";

export type AssessmentType = 'good' | 'bad' | 'next'

export interface AssessmentService {

    getAssessments(userId: string, date: string): Promise<Assessment[]>

    addAssessment(userId: string, date: string, type: AssessmentType, content: string): Promise<Assessment>

    updateAssessment(assessmentId: string, content: string): Promise<void>

    deleteAssessment(assessmentId: string): Promise<void>
}
