'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface Todo {
  id: string
  content: string
  isCompleted: boolean
}

interface BlockProps {
  number: number
  title: string
  todos: Todo[]
  reflection: string
  onTitleChange: (title: string) => void
  onAddTodo: (content: string) => void
  onToggleTodo: (id: string) => void
  onReflectionChange: (reflection: string) => void
}

const Block = ({
  number,
  title,
  todos,
  reflection,
  onTitleChange,
  onAddTodo,
  onToggleTodo,
  onReflectionChange
}: BlockProps) => {
  const [isAddingTodo, setIsAddingTodo] = React.useState(false)
  const [newTodoContent, setNewTodoContent] = React.useState('')

  const handleAddTodo = () => {
    if (newTodoContent.trim()) {
      onAddTodo(newTodoContent)
      setNewTodoContent('')
      setIsAddingTodo(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* 블록 번호 */}
        <div className="flex-none w-12 h-12 flex items-center justify-center bg-muted rounded-full">
          {number}
        </div>

        {/* 블록 제목 */}
        <div className="flex-none w-48">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-ring rounded px-2"
            placeholder="블록 제목"
          />
        </div>

        {/* Todo 리스트 */}
        <div className="flex-1 min-w-[300px]">
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox
                  checked={todo.isCompleted}
                  onCheckedChange={() => onToggleTodo(todo.id)}
                />
                <span className={todo.isCompleted ? 'line-through text-muted-foreground' : ''}>
                  {todo.content}
                </span>
              </div>
            ))}

            {isAddingTodo ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTodoContent}
                  onChange={(e) => setNewTodoContent(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border rounded"
                  placeholder="할 일을 입력하세요"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTodo()
                    }
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleAddTodo}>추가</Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsAddingTodo(false)
                    setNewTodoContent('')
                  }}
                >
                  취소
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTodo(true)}
                disabled={todos.length >= 6}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                할 일 추가
              </Button>
            )}
          </div>
        </div>

        {/* 회고 메모 */}
        <div className="flex-none w-64">
          <Textarea
            value={reflection}
            onChange={(e) => onReflectionChange(e.target.value)}
            className="w-full h-24 resize-none"
            placeholder="회고 메모..."
          />
        </div>
      </div>
    </Card>
  )
}

export default Block 