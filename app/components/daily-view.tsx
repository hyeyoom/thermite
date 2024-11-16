'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import MemoSection from './memo-section'
import Block from './block'

const DailyView = () => {
  const today = new Date()
  const [blocks, setBlocks] = React.useState([
    {
      id: '1',
      number: 1,
      title: '',
      startTime: '',
      endTime: '',
      todos: [],
      reflection: ''
    }
  ])

  const handleTitleChange = (blockId: string, title: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, title } : block
    ))
  }

  const handleAddTodo = (blockId: string, content: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          todos: [
            ...block.todos,
            { id: Date.now().toString(), content, isCompleted: false }
          ]
        }
      }
      return block
    }))
  }

  const handleToggleTodo = (blockId: string, todoId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          todos: block.todos.map(todo => 
            todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
          )
        }
      }
      return block
    }))
  }

  const handleAddMemo = (content: string) => {
    console.log('새 메모:', content)
  }

  const handleReflectionChange = (blockId: string, reflection: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, reflection } : block
    ))
  }

  const handleTimeChange = (blockId: string, start: string, end: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, startTime: start, endTime: end }
        : block
    ))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">
            {format(today, 'EEEE', { locale: ko })}
          </span>
          <span className="text-muted-foreground">
            {format(today, 'yyyy.MM.dd')}
          </span>
        </div>
      </div>

      <div className="space-y-0">
        {blocks.map(block => (
          <Block
            key={block.id}
            number={block.number}
            title={block.title}
            startTime={block.startTime}
            endTime={block.endTime}
            todos={block.todos}
            reflection={block.reflection}
            onTitleChange={(title) => handleTitleChange(block.id, title)}
            onTimeChange={(start, end) => handleTimeChange(block.id, start, end)}
            onAddTodo={(content) => handleAddTodo(block.id, content)}
            onToggleTodo={(todoId) => handleToggleTodo(block.id, todoId)}
            onReflectionChange={(reflection) => handleReflectionChange(block.id, reflection)}
          />
        ))}
      </div>

      <MemoSection 
        memos={[]} 
        onAddMemo={handleAddMemo} 
      />
    </div>
  )
}

export default DailyView 