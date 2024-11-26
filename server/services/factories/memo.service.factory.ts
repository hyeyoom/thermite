import { MemoService } from '../memo.service'
import { SupabaseMemoService } from '../supabase/memo.service'

let memoService: MemoService | null = null

export function getMemoService(): MemoService {
    if (!memoService) {
        memoService = new SupabaseMemoService()
    }
    return memoService
}
