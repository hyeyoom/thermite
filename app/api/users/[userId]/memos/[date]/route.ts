import { NextResponse } from 'next/server'
import { getMemoService } from '@/server/services/factories/memo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

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

        const memoService = await getMemoService()
        const memos = await memoService.getMemos(userId, date)
        return NextResponse.json(memos)
    } catch (error: unknown) {
        console.error('Error fetching memos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch memos' },
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

        const { content } = await request.json()
        const memoService = await getMemoService()
        const memo = await memoService.addMemo(userId, date, content)
        return NextResponse.json(memo)
    } catch (error: unknown) {
        console.error('Error creating memo:', error)
        return NextResponse.json(
            { error: 'Failed to create memo' },
            { status: 500 }
        )
    }
}
