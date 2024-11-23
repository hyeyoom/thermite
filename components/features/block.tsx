'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {Card} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {BlockProps} from "@/lib/types";
import TodoList from './todo-list'

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
    const [isTimeDialogOpen, setIsTimeDialogOpen] = React.useState(false)
    const [tempStartTime, setTempStartTime] = React.useState(startTime)
    const [tempEndTime, setTempEndTime] = React.useState(endTime)
    const [isEditingTitle, setIsEditingTitle] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)
    const [localReflection, setLocalReflection] = useState(reflection || '')

    const handleTimeSubmit = () => {
        onTimeChange(tempStartTime, tempEndTime)
        setIsTimeDialogOpen(false)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.target.value)
    }

    const handleTitleBlur = () => {
        if (localTitle.trim()) {
            onTitleChange(localTitle)
        }
    }

    useEffect(() => {
        setLocalTitle(title)
    }, [title])

    useEffect(() => {
        setLocalReflection(reflection || '')
    }, [reflection])

    const debouncedReflectionChange = useCallback(
        (value: string) => {
            onReflectionChange(value)
        },
        [onReflectionChange]
    )

    const handleReflectionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setLocalReflection(newValue)
        if (newValue.trim()) {
            debouncedReflectionChange(newValue)
        }
    }, [debouncedReflectionChange])

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
                    <div className="flex items-center gap-4">
                        {/* 제목 - 너비 제한 추가 */}
                        <div className="flex-none w-48">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={localTitle}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                            e.preventDefault()
                                            e.currentTarget.blur()
                                        }
                                    }}
                                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-medium px-0"
                                    autoFocus
                                    placeholder="제목 없음"
                                />
                            ) : (
                                <button
                                    onClick={() => setIsEditingTitle(true)}
                                    className="w-full text-left font-medium hover:text-primary truncate"
                                >
                                    {title || '제목 없음'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Todo 리스트 */}
                    <TodoList
                        todos={todos}
                        onAddTodo={onAddTodo}
                        onToggleTodo={onToggleTodo}
                        onDeleteTodo={onDeleteTodo}
                    />

                    {/* 회고 메모 */}
                    <div className="flex-none lg:w-64">
                        <Textarea
                            value={localReflection}
                            onChange={handleReflectionChange}
                            className="w-full h-24 resize-none border-none focus:ring-0 hover:bg-muted/50 transition-colors"
                            placeholder="회고 메모..."
                        />
                    </div>
                </div>
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
