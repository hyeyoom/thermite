'use client'

import React from 'react'
import {Card} from '@/components/ui/card'
import {Checkbox} from '@/components/ui/checkbox'
import {Button} from '@/components/ui/button'
import {PlusCircle, Trash2, X} from 'lucide-react'
import {Textarea} from '@/components/ui/textarea'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {cn} from '@/lib/utils'
import {BlockProps} from "@/lib/types";

const Block = ({
                   number,
                   title,
                   startTime,
                   endTime,
                   todos,
                   reflection,
                   isLastBlock,
                   onTitleChange,
                   onTimeChange,
                   onAddTodo,
                   onToggleTodo,
                   onReflectionChange,
                   onDeleteTodo,
                   onDeleteBlock,
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
            <Card className="p-4 border-2 relative group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* 블록 번호와 시간 */}
                    <button
                        onClick={() => setIsTimeDialogOpen(true)}
                        className="flex-none w-14 h-14 flex flex-col items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                        <span className="text-lg font-semibold">{number}</span>
                        {startTime && endTime ? (
                            <div className="text-[11px] text-muted-foreground leading-tight">
                                <span>{startTime}</span>
                                <span className="mx-0.5">~</span>
                                <span>{endTime}</span>
                            </div>
                        ) : (
                            <span className="text-[11px] text-muted-foreground">시간 설정</span>
                        )}
                    </button>

                    {/* 제목 */}
                    <div className="flex-none lg:w-48">
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
                                className="w-full text-left text-lg font-semibold px-2 hover:bg-muted/50 rounded truncate"
                            >
                                {title || "블록 제목"}
                            </button>
                        )}
                    </div>

                    {/* Todo 리스트 */}
                    <div className="flex-1 min-w-0">
                        <div className="space-y-2">
                            {todos.map((todo) => (
                                <div key={todo.id} className="group flex items-center gap-2">
                                    <div
                                        className="flex items-center gap-2 flex-1 min-w-0"
                                        onClick={() => onToggleTodo(todo.id)}
                                    >
                                        <Checkbox
                                            checked={todo.isCompleted}
                                            onCheckedChange={() => onToggleTodo(todo.id)}
                                            className="h-5 w-5 lg:h-4 lg:w-4"
                                        />
                                        <span
                                            className={cn(
                                                "flex-1 min-w-0 truncate py-1",
                                                todo.isCompleted && "line-through text-muted-foreground"
                                            )}
                                        >
                      {todo.content}
                    </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-none"
                                        onClick={() => onDeleteTodo(todo.id)}
                                    >
                                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
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
                                    <PlusCircle className="h-4 w-4 mr-2"/>
                                    할 일 추가 ({todos.length}/6)
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 회고 메모 */}
                    <div className="flex-none lg:w-64">
                        <Textarea
                            value={reflection}
                            onChange={(e) => onReflectionChange(e.target.value)}
                            className="w-full h-24 resize-none border-none focus:ring-0 hover:bg-muted/50 transition-colors"
                            placeholder="회고 메모..."
                        />
                    </div>
                </div>

                {/* 삭제 버튼 */}
                {!isLastBlock && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-12 top-4 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity lg:top-1/2 lg:-translate-y-1/2"
                        onClick={onDeleteBlock}
                    >
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                )}

                {/* 모바일용 삭제 버튼 */}
                {!isLastBlock && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 lg:hidden"
                        onClick={onDeleteBlock}
                    >
                        <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                )}
            </Card>

            <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>시간 범위 설정</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">시작 시간</label>
                                <select
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                    value={tempStartTime}
                                    onChange={(e) => setTempStartTime(e.target.value)}
                                >
                                    <option value="">선택...</option>
                                    {Array.from({length: 48}).map((_, i) => {
                                        const hour = Math.floor(i / 2).toString().padStart(2, '0')
                                        const minute = i % 2 === 0 ? '00' : '30'
                                        const time = `${hour}:${minute}`
                                        return (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">종료 시간</label>
                                <select
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                    value={tempEndTime}
                                    onChange={(e) => setTempEndTime(e.target.value)}
                                >
                                    <option value="">선택...</option>
                                    {Array.from({length: 48}).map((_, i) => {
                                        const hour = Math.floor(i / 2).toString().padStart(2, '0')
                                        const minute = i % 2 === 0 ? '00' : '30'
                                        const time = `${hour}:${minute}`
                                        return (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        )
                                    })}
                                </select>
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
