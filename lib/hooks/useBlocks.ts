import {useCallback, useEffect, useState} from 'react'
import {Assessment, BlockType, Memo} from '@/lib/types'
import {addBlockServerAction, fetchBlocksServerAction, updateBlockServerAction} from '@/app/actions/block.actions'
import {addTodoServerAction, toggleTodoServerAction, deleteTodoServerAction} from '@/app/actions/todo.actions'
import {fetchMemosServerAction, addMemoServerAction, updateMemoServerAction, deleteMemoServerAction} from '@/app/actions/memo.actions'
import {fetchAssessmentsServerAction, addAssessmentServerAction} from '@/app/actions/assessment.actions'

export function useBlocks(userId: string, date: string) {
    const [blocks, setBlocks] = useState<BlockType[]>([])
    const [memos, setMemos] = useState<Memo[]>([])
    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const initializeBlocks = useCallback(() => {
        const initialBlocks: BlockType[] = Array.from({length: 6}, (_, index) => ({
            id: `temp_${Date.now()}_${index}`,
            user_id: userId,
            date: date,
            number: index + 1,
            title: '',
            startTime: '',
            endTime: '',
            todos: [],
            reflection: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }))
        setBlocks(initialBlocks)
    }, [userId, date])

    const fetchBlocks = useCallback(async () => {
        try {
            const data = await fetchBlocksServerAction(userId, date)
            const existingBlocks = data || []

            // 1부터 6까지의 번호 중 비어있는 번호 찾기
            const existingNumbers = new Set(existingBlocks.map(block => block.number))
            const missingNumbers = Array.from({length: 6}, (_, i) => i + 1)
                .filter(num => !existingNumbers.has(num))
                .sort((a, b) => a - b)

            // 비어있는 번호에 대해 임시 블록 생성
            const emptyBlocks: BlockType[] = missingNumbers.map(number => ({
                id: `temp_${Date.now()}_${number}`,
                user_id: userId,
                date: date,
                number: number,
                title: '',
                startTime: '',
                endTime: '',
                todos: [],
                reflection: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }))

            // 모든 블록을 번호순으로 정렬
            const allBlocks = [...existingBlocks, ...emptyBlocks]
                .sort((a, b) => a.number - b.number)

            setBlocks(allBlocks)
        } catch (err) {
            console.error('Error fetching blocks:', err)
            initializeBlocks()
        } finally {
            setIsLoading(false)
        }
    }, [userId, date, initializeBlocks])

    useEffect(() => {
        fetchBlocks()
    }, [userId, date, fetchBlocks])

    const updateBlock = async (blockId: string, updates: Partial<BlockType>) => {
        try {
            const hasContent = updates.title?.trim() ||
                updates.startTime ||
                updates.endTime ||
                updates.reflection?.trim()

            if (blockId.startsWith('temp_') && hasContent) {
                // 임시 블록에 내용이 추가되면 실제 블록 생성
                const newBlock = await addBlockServerAction(userId, date,
                    blocks.findIndex(b => b.id === blockId) + 1)

                // 생성된 블록 업데이트
                await updateBlockServerAction(newBlock.id, updates)

                setBlocks(prevBlocks => prevBlocks.map(block =>
                    block.id === blockId ? { ...newBlock, ...updates } : block
                ))
            } else if (!blockId.startsWith('temp_')) {
                // 기존 블록 업데이트
                await updateBlockServerAction(blockId, updates)

                setBlocks(blocks.map(block =>
                    block.id === blockId ? { ...block, ...updates } : block
                ))
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update block'))
        }
    }

    const deleteBlock = async (blockId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}/blocks/${date}/${blockId}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('Failed to delete block')
            }
            const filteredBlocks = blocks.filter(block => block.id !== blockId)
            const reorderedBlocks = filteredBlocks.map((block, index) => ({
                ...block,
                number: index + 1
            }))
            setBlocks(reorderedBlocks)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete block'))
        }
    }

    const addTodo = async (blockId: string, content: string) => {
        try {
            const newTodo = await addTodoServerAction(userId, blockId, content)

            setBlocks(blocks.map(block =>
                block.id === blockId
                    ? { ...block, todos: [...block.todos, newTodo] }
                    : block
            ))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add todo'))
        }
    }

    const toggleTodo = async (blockId: string, todoId: string) => {
        try {
            const block = blocks.find(b => b.id === blockId)!
            const todo = block.todos.find(t => t.id === todoId)!

            await toggleTodoServerAction(userId, todoId, !todo.isCompleted)

            setBlocks(blocks.map(block =>
                block.id === blockId
                    ? {
                        ...block,
                        todos: block.todos.map(todo =>
                            todo.id === todoId
                                ? { ...todo, isCompleted: !todo.isCompleted }
                                : todo
                        )
                    }
                    : block
            ))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to toggle todo'))
        }
    }

    const deleteTodo = async (blockId: string, todoId: string) => {
        try {
            await deleteTodoServerAction(userId, todoId)

            setBlocks(blocks.map(block =>
                block.id === blockId
                    ? {
                        ...block,
                        todos: block.todos.filter(todo => todo.id !== todoId)
                    }
                    : block
            ))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete todo'))
        }
    }

    const addMemo = async (content: string) => {
        try {
            const newMemo = await addMemoServerAction(userId, date, content)
            setMemos([...memos, newMemo])
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add memo'))
        }
    }

    const updateMemo = async (memoId: string, content: string) => {
        try {
            await updateMemoServerAction(userId, memoId, content)
            setMemos(memos.map(memo =>
                memo.id === memoId ? {...memo, content} : memo
            ))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update memo'))
        }
    }

    const deleteMemo = async (memoId: string) => {
        try {
            await deleteMemoServerAction(userId, memoId)
            setMemos(memos.filter(memo => memo.id !== memoId))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete memo'))
        }
    }

    const addAssessment = async (type: 'good' | 'bad' | 'next', content: string) => {
        try {
            const newAssessment = await addAssessmentServerAction(userId, date, type, content)
            setAssessments([...assessments, newAssessment])
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to add assessment'))
        }
    }

    const updateAssessment = async (assessmentId: string, content: string) => {
        try {
            const response = await fetch(
                `/api/users/${userId}/assessments/${date}/${assessmentId}`,
                {
                    method: 'PATCH',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({content})
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update assessment')
            }
            setAssessments(assessments.map(assessment =>
                assessment.id === assessmentId
                    ? {...assessment, content}
                    : assessment
            ))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to update assessment'))
        }
    }

    const deleteAssessment = async (assessmentId: string) => {
        try {
            const response = await fetch(
                `/api/users/${userId}/assessments/${date}/${assessmentId}`,
                {
                    method: 'DELETE'
                }
            )
            if (!response.ok) {
                throw new Error('Failed to delete assessment')
            }
            setAssessments(assessments.filter(assessment => assessment.id !== assessmentId))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete assessment'))
        }
    }

    useEffect(() => {
        const loadMemos = async () => {
            try {
                const data = await fetchMemosServerAction(userId, date)
                setMemos(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch memos'))
            }
        }
        loadMemos()
    }, [userId, date])

    useEffect(() => {
        const loadAssessments = async () => {
            try {
                const data = await fetchAssessmentsServerAction(userId, date)
                setAssessments(data)
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch assessments'))
            }
        }
        loadAssessments()
    }, [userId, date])

    return {
        blocks,
        memos,
        assessments,
        isLoading,
        error,
        updateBlock,
        deleteBlock,
        addTodo,
        toggleTodo,
        deleteTodo,
        addMemo,
        updateMemo,
        deleteMemo,
        addAssessment,
        updateAssessment,
        deleteAssessment
    }
}
