import { useState, useEffect } from 'react'
import { BlockType, Todo } from '@/lib/types'

export function useBlocks() {
  const [blocks, setBlocks] = useState<BlockType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBlocks = async () => {
    try {
      const response = await fetch('/api/blocks')
      const data = await response.json()
      setBlocks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blocks'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlocks()
  }, [])

  const addBlock = async () => {
    if (blocks.length >= 6) return

    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: blocks.length + 1 })
      })
      const newBlock = await response.json()
      setBlocks([...blocks, newBlock])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add block'))
    }
  }

  const updateBlock = async (blockId: string, updates: Partial<BlockType>) => {
    try {
      await fetch(`/api/blocks/${blockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      setBlocks(blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update block'))
    }
  }

  const deleteBlock = async (blockId: string) => {
    try {
      await fetch(`/api/blocks/${blockId}`, { method: 'DELETE' })
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
    const newTodo: Todo = {
      id: Date.now().toString(),
      block_id: blockId,
      content,
      isCompleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      await updateBlock(blockId, {
        todos: [...blocks.find(b => b.id === blockId)!.todos, newTodo]
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add todo'))
    }
  }

  const toggleTodo = async (blockId: string, todoId: string) => {
    const block = blocks.find(b => b.id === blockId)!
    const updatedTodos = block.todos.map(todo =>
      todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
    )

    try {
      await updateBlock(blockId, { todos: updatedTodos })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle todo'))
    }
  }

  const deleteTodo = async (blockId: string, todoId: string) => {
    const block = blocks.find(b => b.id === blockId)!
    const updatedTodos = block.todos.filter(todo => todo.id !== todoId)

    try {
      await updateBlock(blockId, { todos: updatedTodos })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete todo'))
    }
  }

  return {
    blocks,
    isLoading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    addTodo,
    toggleTodo,
    deleteTodo
  }
} 