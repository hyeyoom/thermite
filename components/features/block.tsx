'use client'

import React from 'react'
import {Card} from '@/components/ui/card'
import {Textarea} from '@/components/ui/textarea'
import {BlockProps} from "@/lib/types"
import TodoList from './todo-list'
import TimeRangeDialog from './time-range-dialog'

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
    const [isEditingTitle, setIsEditingTitle] = React.useState(false)
    const [localTitle, setLocalTitle] = React.useState(title)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTitle(e.target.value)
    }

    const handleTitleBlur = () => {
        if (localTitle.trim()) {
            onTitleChange(localTitle)
        }
    }

    const handleReflectionSave = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const value = e.currentTarget.value
        if (value.trim() !== reflection) {
            onReflectionChange(value)
        }
    }

    const handleReflectionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            e.currentTarget.blur()
        }
    }

    return (
        <>
            <Card className="p-4 border-2 relative group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* 블록 번호와 시간 */}
                    <button
                        onClick={() => setIsTimeDialogOpen(true)}
                        className="flex-none w-14 h-14 flex flex-col items-center justify-center rounded-lg bg-muted hover:text-primary transition-colors"
                    >
                        <span className="text-lg font-semibold">{number}</span>
                        {startTime && endTime ? (
                            <div className="text-[11px] text-muted-foreground leading-tight">
                                <span>{startTime}</span>
                                <span className="mx-0.5">~</span>
                                <span>{endTime}</span>
                            </div>
                        ) : (
                            <span className="text-[11px] hover:text-primary text-muted-foreground">시간 설정</span>
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
                                    className="w-full text-left font-bold hover:text-primary truncate"
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

                    {/* 회고 메모 - Enter로 개행 가능하도록 수정 */}
                    <div className="flex-none lg:w-64">
                        <Textarea
                            defaultValue={reflection}
                            onBlur={handleReflectionSave}
                            onKeyDown={handleReflectionKeyDown}
                            className="w-full h-24 resize-none border-none focus:ring-0 hover:bg-muted/50 transition-colors"
                            placeholder="회고를 입력해주세요!"
                        />
                    </div>
                </div>
            </Card>

            <TimeRangeDialog
                isOpen={isTimeDialogOpen}
                onClose={() => setIsTimeDialogOpen(false)}
                startTime={startTime}
                endTime={endTime}
                onSubmit={onTimeChange}
            />
        </>
    )
}

export default Block
