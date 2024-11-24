'use client'

import React from 'react'
import { useBlocks } from '@/lib/hooks/useBlocks'
import DateHeader from "@/components/features/date-header";
import Block from "@/components/features/block";
import MemoSection from "@/components/features/memo-section";
import { AlertCircle } from "lucide-react"

interface DailyViewClientProps {
    userId: string
    date: string
}

export function DailyViewClient({ userId, date }: DailyViewClientProps) {
    const {
        blocks,
        memos,
        assessments,
        isLoading,
        error,
        updateBlock,
        addTodo,
        toggleTodo,
        deleteTodo,
        addMemo,
        updateMemo,
        deleteMemo,
        addAssessment,
        updateAssessment,
        deleteAssessment
    } = useBlocks(userId, date)

    const handleTitleChange = (blockId: string, title: string) => {
        updateBlock(blockId, {title})
    }

    const handleTimeChange = (blockId: string, start: string, end: string) => {
        updateBlock(blockId, {startTime: start, endTime: end})
    }

    const handleReflectionChange = (blockId: string, reflection: string) => {
        updateBlock(blockId, {reflection})
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-6 h-6" />
                    <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
                </div>
                <p className="text-muted-foreground">{error.message}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto pt-12 space-y-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto pt-12 space-y-8">
            <DateHeader date={new Date(date)}/>
            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <React.Fragment key={block.id}>
                        {(index === 2 || index === 4) && (
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-primary/20"/>
                                </div>
                                <div className="relative flex justify-center">
                                    <div
                                        className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {index === 2 ? '점심 시간' : '저녁 시간'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Block
                            number={block.number}
                            title={block.title}
                            startTime={block.startTime}
                            endTime={block.endTime}
                            todos={block.todos}
                            reflection={block.reflection}
                            onTitleChange={(title) => handleTitleChange(block.id, title)}
                            onTimeChange={(start, end) => handleTimeChange(block.id, start, end)}
                            onAddTodo={(content) => addTodo(block.id, content)}
                            onToggleTodo={(todoId) => toggleTodo(block.id, todoId)}
                            onDeleteTodo={(todoId) => deleteTodo(block.id, todoId)}
                            onReflectionChange={(reflection) => handleReflectionChange(block.id, reflection)}
                        />
                    </React.Fragment>
                ))}
            </div>
            <MemoSection
                memos={memos}
                assessments={assessments}
                onAddMemo={addMemo}
                onUpdateMemo={updateMemo}
                onDeleteMemo={deleteMemo}
                onAddAssessment={addAssessment}
                onUpdateAssessment={updateAssessment}
                onDeleteAssessment={deleteAssessment}
            />
        </div>
    )
}
