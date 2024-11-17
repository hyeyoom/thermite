export interface Todo {
    id: string
    content: string
    isCompleted: boolean
}

export interface BlockType {
    id: string
    number: number
    title: string
    startTime: string
    endTime: string
    todos: Todo[]
    reflection: string
}

export interface Memo {
    id: string
    content: string
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
    onAddMemo: (content: string) => void
    onUpdateMemo?: (id: string, content: string) => void
    onDeleteMemo?: (id: string) => void
}

export interface Assessment {
    id: string
    type: 'good' | 'bad' | 'next'
    content: string
}
