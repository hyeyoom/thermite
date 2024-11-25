import {Memo} from "@/lib/types"

export interface MemoService {
    getMemos(userId: string, date: string): Promise<Memo[]>

    addMemo(userId: string, date: string, content: string): Promise<Memo>

    updateMemo(memoId: string, content: string): Promise<void>

    deleteMemo(memoId: string): Promise<void>
}
