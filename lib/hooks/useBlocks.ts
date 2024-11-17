import { useState, useEffect, useCallback } from 'react'
import { BlockType, Memo } from '@/lib/types'

export function useBlocks(userId: string, date: string) {
  const [blocks, setBlocks] = useState<BlockType[]>([])
  const [memos, setMemos] = useState<Memo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBlocks = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}/blocks/${date}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blocks')
      }
      const data = await response.json()
      setBlocks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'))
    } finally {
      setIsLoading(false)
    }
  }, [userId, date])

  useEffect(() => {
    fetchBlocks()
  }, [userId, date, fetchBlocks])

  const addBlock = async () => {
    if (blocks.length >= 6) return

    try {
      const response = await fetch(`/api/users/${userId}/blocks/${date}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: blocks.length + 1 })
      })
      if (!response.ok) {
        throw new Error('Failed to add block')
      }
      const newBlock = await response.json()
      setBlocks([...blocks, newBlock])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add block'))
    }
  }

  const updateBlock = async (blockId: string, updates: Partial<BlockType>) => {
    try {
      const response = await fetch(
        `/api/users/${userId}/blocks/${date}/${blockId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update block')
      }

      setBlocks(blocks.map(block =>
        block.id === blockId
          ? { ...block, ...updates }
          : block
      ))
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
      const response = await fetch(
        `/api/users/${userId}/blocks/${date}/${blockId}/todos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            isCompleted: false
          })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to add todo')
      }
      const newTodo = await response.json()
      
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
      
      const response = await fetch(
        `/api/users/${userId}/blocks/${date}/${blockId}/todos/${todoId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isCompleted: !todo.isCompleted
          })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to toggle todo')
      }

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
      const response = await fetch(
        `/api/users/${userId}/blocks/${date}/${blockId}/todos/${todoId}`,
        {
          method: 'DELETE'
        }
      )
      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

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
      const response = await fetch(
        `/api/users/${userId}/memos/${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to add memo')
      }
      const newMemo = await response.json()
      setMemos([...memos, newMemo])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add memo'))
    }
  }

  const updateMemo = async (memoId: string, content: string) => {
    try {
      const response = await fetch(
        `/api/users/${userId}/memos/${date}/${memoId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update memo')
      }
      setMemos(memos.map(memo =>
        memo.id === memoId ? { ...memo, content } : memo
      ))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update memo'))
    }
  }

  const deleteMemo = async (memoId: string) => {
    try {
      const response = await fetch(
        `/api/users/${userId}/memos/${date}/${memoId}`,
        {
          method: 'DELETE'
        }
      )
      if (!response.ok) {
        throw new Error('Failed to delete memo')
      }
      setMemos(memos.filter(memo => memo.id !== memoId))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete memo'))
    }
  }

  const updateReflection = async (blockId: string, reflection: string) => {
    try {
      const response = await fetch(
        `/api/users/${userId}/blocks/${date}/${blockId}/reflection`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reflection })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update reflection')
      }

      setBlocks(blocks.map(block =>
        block.id === blockId
          ? { ...block, reflection }
          : block
      ))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update reflection'))
    }
  }

  useEffect(() => {
    const loadMemos = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/memos/${date}`)
        if (!response.ok) {
          throw new Error('Failed to fetch memos')
        }
        const data = await response.json()
        setMemos(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch memos'))
      }
    }
    loadMemos()
  }, [userId, date])

  return {
    blocks,
    memos,
    isLoading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    addTodo,
    toggleTodo,
    deleteTodo,
    addMemo,
    updateMemo,
    deleteMemo,
    updateReflection
  }
}