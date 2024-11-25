import {createSupabaseClientForServer} from '@/lib/utils/supabase/server'
import {MemoService} from '../memo.service'
import {Memo} from '@/lib/types'

export class SupabaseMemoService implements MemoService {
    async getMemos(userId: string, date: string): Promise<Memo[]> {
        const supabase = await createSupabaseClientForServer()

        const {data, error} = await supabase
            .from('block_memos')
            .select('*')
            .eq('user_id', userId)
            .eq('date', date)
            .is('deleted_at', null)
            .order('created_at', {ascending: true})

        if (error) throw error

        return data.map(memo => ({
            id: memo.id,
            user_id: memo.user_id,
            date: memo.date,
            content: memo.content,
            created_at: memo.created_at,
            updated_at: memo.updated_at
        }))
    }

    async addMemo(userId: string, date: string, content: string): Promise<Memo> {
        const supabase = await createSupabaseClientForServer()

        const {data, error} = await supabase
            .from('block_memos')
            .insert({
                user_id: userId,
                date: date,
                content: content
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            user_id: data.user_id,
            date: data.date,
            content: data.content,
            created_at: data.created_at,
            updated_at: data.updated_at
        }
    }

    async updateMemo(memoId: string, content: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('block_memos')
            .update({
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('id', memoId)

        if (error) throw error
    }

    async deleteMemo(memoId: string): Promise<void> {
        const supabase = await createSupabaseClientForServer()

        const {error} = await supabase
            .from('block_memos')
            .update({
                deleted_at: new Date().toISOString()
            })
            .eq('id', memoId)

        if (error) throw error
    }
}
