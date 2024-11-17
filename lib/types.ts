export interface Todo {
    id: string
    block_id: string
    content: string
    isCompleted: boolean
    created_at: string
    updated_at: string
}

export interface BlockType {
    id: string
    user_id: string
    date: string
    number: number
    title: string
    startTime: string
    endTime: string
    todos: Todo[]
    reflection: string
    created_at: string
    updated_at: string
}

export interface Memo {
    id: string
    user_id: string
    date: string
    content: string
    created_at: string
    updated_at: string
}

export interface BlockProps {
    number: number
    title: string
    startTime: string
    endTime: string
    todos: Todo[]
    reflection: string
    isLastBlock: boolean
    onTitleChange: (value: string) => void
    onTimeChange: (start: string, end: string) => void
    onAddTodo: (content: string) => void
    onToggleTodo: (todoId: string) => void
    onReflectionChange: (value: string) => void
    onDeleteTodo: (todoId: string) => void
    onDeleteBlock: () => void
}

export interface MemoSectionProps {
    memos: Memo[]
    assessments: Assessment[]
    onAddMemo: (content: string) => void
    onUpdateMemo: (memoId: string, content: string) => void
    onDeleteMemo: (memoId: string) => void
    onAddAssessment: (type: 'good' | 'bad' | 'next', content: string) => void
    onUpdateAssessment: (assessmentId: string, content: string) => void
    onDeleteAssessment: (assessmentId: string) => void
}

export interface Assessment {
    id: string
    type: 'good' | 'bad' | 'next'
    content: string
}
