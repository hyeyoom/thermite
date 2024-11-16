'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PlusCircle, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

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
  onDeleteTodo: (id: string) => void
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
  onReflectionChange,
  onDeleteTodo,
}: BlockProps) => {
  const [isAddingTodo, setIsAddingTodo] = React.useState(false)
  const [newTodoContent, setNewTodoContent] = React.useState('')
  const [isTimeDialogOpen, setIsTimeDialogOpen] = React.useState(false)
  const [tempStartTime, setTempStartTime] = React.useState(startTime)
  const [tempEndTime, setTempEndTime] = React.useState(endTime)
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)

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

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
      setIsEditingTitle(false)
    }
  }

  return (
    <>
      <Card className="p-4 border-2">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 블록 번호와 시간 */}
          <div className="flex lg:flex-none lg:w-24 items-center gap-4 lg:gap-0">
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
            
            {/* 모바일에서만 보이는 제목 */}
            <div className="flex-1 lg:hidden">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={() => setIsEditingTitle(false)}
                  className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-ring px-2"
                  placeholder="블록 제목"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="w-full text-left text-lg font-semibold px-2 hover:bg-muted/50 rounded"
                >
                  {title || "블록 제목"}
                </button>
              )}
            </div>
          </div>

          {/* 데스크톱에서만 보이는 제목 */}
          <div className="hidden lg:block lg:flex-none lg:w-48">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={() => setIsEditingTitle(false)}
                className="w-full text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-ring px-2"
                placeholder="블록 제목"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="w-full text-left text-lg font-semibold px-2 hover:bg-muted/50 rounded"
              >
                {title || "블록 제목"}
              </button>
            )}
          </div>

          {/* Todo 리스트 */}
          <div className="flex-1 min-w-0 lg:min-w-[300px]">
            <div className="space-y-2">
              {todos.map((todo) => (
                <div key={todo.id} className="group flex items-center gap-2">
                  <Checkbox
                    checked={todo.isCompleted}
                    onCheckedChange={() => onToggleTodo(todo.id)}
                  />
                  <span className={cn(
                    "flex-1",
                    todo.isCompleted && "line-through text-muted-foreground"
                  )}>
                    {todo.content}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteTodo(todo.id)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}

              {isAddingTodo ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTodoContent}
                    onChange={(e) => setNewTodoContent(e.target.value)}
                    className="flex-1 text-sm px-2 py-1 border-b-2 border-input focus:outline-none focus:border-foreground transition-colors"
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
                  className="w-full justify-start"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  할 일 추가 ({todos.length}/6)
                </Button>
              )}
            </div>
          </div>

          {/* 회고 메모 */}
          <div className="lg:flex-none lg:w-64">
            <Textarea
              value={reflection}
              onChange={(e) => onReflectionChange(e.target.value)}
              className="w-full h-24 resize-none border-none focus:ring-0 hover:bg-muted/50 transition-colors"
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