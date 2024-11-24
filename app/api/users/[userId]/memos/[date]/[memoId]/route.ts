import { NextResponse } from 'next/server'
import { getMemoService } from '@/server/services/factories/memo.service.factory'
import { createSupabaseClientForServer } from '@/lib/utils/supabase/server'

interface RouteParams {
    userId: string
    date: string
    memoId: string
}

export async function PATCH(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, memoId } = params
    
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
        await memoService.updateMemo(memoId, content)
        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Error updating memo:', error)
        return NextResponse.json(
            { error: 'Failed to update memo' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: RouteParams }
) {
    const { userId, memoId } = params
    
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
        await memoService.deleteMemo(memoId)
        return NextResponse.json({ success: true })
    } catch (error: unknown) {
        console.error('Error deleting memo:', error)
        return NextResponse.json(
            { error: 'Failed to delete memo' },
            { status: 500 }
        )
    }
}
