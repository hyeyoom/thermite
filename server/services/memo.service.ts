import { Memo } from "@/lib/types"

export interface MemoService {
    getMemos(userId: string, date: string): Promise<Memo[]>
    
    createMemo(userId: string, memoData: Partial<Memo>): Promise<Memo>
    
    updateMemo(memoId: string, updates: Partial<Memo>): Promise<void>
    
    deleteMemo(memoId: string): Promise<void>
} 