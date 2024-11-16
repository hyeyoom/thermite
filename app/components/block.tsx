'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Todo {
  id: string
  content: string
  isCompleted: boolean
}

interface BlockProps {
  number: number
  title: string
  startTime: string
  endTime: string
  todos: Todo[]
  reflection: string
  onTitleChange: (title: string) => void
  onTimeChange: (start: string, end: string) => void
  onAddTodo: (content: string) => void
  onToggleTodo: (id: string) => void
  onReflectionChange: (reflection: string) => void
}

const Block = ({
  number,
  title,
  startTime,
  endTime,
  todos,
  reflection,
  onTitleChange,
  onTimeChange,
  onAddTodo,
  onToggleTodo,
  onReflectionChange
}: BlockProps) => {
  const [isAddingTodo, setIsAddingTodo] = React.useState(false)
  const [newTodoContent, setNewTodoContent] = React.useState('')
  const [isTimeDialogOpen, setIsTimeDialogOpen] = React.useState(false)
  const [tempStartTime, setTempStartTime] = React.useState(startTime)
  const [tempEndTime, setTempEndTime] = React.useState(endTime)

  const handleAddTodo = () => {
    if (newTodoContent.trim()) {
      onAddTodo(newTodoContent)
      setNewTodoContent('')
      setIsAddingTodo(false)
    }
  }

  const handleTimeSubmit = () => {
    onTimeChange(tempStartTime, tempEndTime)
    setIsTimeDialogOpen(false)
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex gap-4">
          {/* 블록 번호와 시간 */}
          <div className="flex-none w-24">
            <button
              onClick={() => setIsTimeDialogOpen(true)}
              className="w-12 h-12 flex flex-col items-center justify-center bg-muted rounded-full hover:bg-muted/80 transition-colors"
            >
              <span className="text-lg font-semibold">{number}</span>
              {startTime && endTime && (
                <span className="text-xs text-muted-foreground mt-1">
                  {startTime}~{endTime}
                </span>
              )}
            </button>
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

      <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>시간 범위 설정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">시작 시간</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded"
                  value={tempStartTime}
                  onChange={(e) => setTempStartTime(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">종료 시간</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded"
                  value={tempEndTime}
                  onChange={(e) => setTempEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTimeDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleTimeSubmit}>
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Block