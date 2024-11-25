import {useCallback, useEffect, useState} from 'react'
import {Assessment, BlockType, Memo} from '@/lib/types'
import {addBlockServerAction, fetchBlocksServerAction, updateBlockServerAction} from '@/app/actions/block.actions'
import {addTodoServerAction, deleteTodoServerAction, toggleTodoServerAction} from '@/app/actions/todo.actions'
import {
    addMemoServerAction,
    deleteMemoServerAction,
    fetchMemosServerAction,
    updateMemoServerAction
} from '@/app/actions/memo.actions'
import {
    addAssessmentServerAction,
    deleteAssessmentServerAction,
    fetchAssessmentsServerAction,
    updateAssessmentServerAction
} from '@/app/actions/assessment.actions'

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
        return initialBlocks
    }, [userId, date])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const [blocksData, memosData, assessmentsData] = await Promise.all([
                    fetchBlocksServerAction(userId, date),
                    fetchMemosServerAction(userId, date),
                    fetchAssessmentsServerAction(userId, date)
                ])

                const existingBlockNumbers = blocksData.map(block => block.number)
                const missingBlocks = initializeBlocks().filter(block =>
                    !existingBlockNumbers.includes(block.number)
                )

                setBlocks([...blocksData, ...missingBlocks].sort((a, b) => a.number - b.number))
                setMemos(memosData)
                setAssessments(assessmentsData)
            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err instanceof Error ? err : new Error('데이터를 불러오는데 실패했습니다'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [userId, date, initializeBlocks])

    const updateBlock = async (blockId: string, updates: Partial<BlockType>) => {
        try {
            const hasContent = updates.title?.trim() ||
                updates.startTime ||
                updates.endTime ||
                updates.reflection?.trim()

            if (blockId.startsWith('temp_') && hasContent) {
                const newBlock = await addBlockServerAction(userId, date,
                    blocks.findIndex(b => b.id === blockId) + 1)

                await updateBlockServerAction(newBlock.id, updates)

                setBlocks(prevBlocks => prevBlocks.map(block =>
                    block.id === blockId ? {...newBlock, ...updates} : block
                ))
            } else if (!blockId.startsWith('temp_')) {
                await updateBlockServerAction(blockId, updates)

                setBlocks(blocks.map(block =>
                    block.id === blockId ? {...block, ...updates} : block
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
                    ? {...block, todos: [...block.todos, newTodo]}
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
                                ? {...todo, isCompleted: !todo.isCompleted}
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
            await updateAssessmentServerAction(userId, assessmentId, content)
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
            await deleteAssessmentServerAction(userId, assessmentId)
            setAssessments(assessments.filter(assessment => assessment.id !== assessmentId))
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to delete assessment'))
        }
    }

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
