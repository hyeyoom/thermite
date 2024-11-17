'use client'

import React from 'react'
import {format} from "date-fns"
import {Button} from "@/components/ui/button"
import {PlusCircle} from "lucide-react"
import Block from "@/components/features/block";
import MemoSection from "@/components/features/memo-section";
import {useBlocks} from "@/lib/hooks/useBlocks";
import {Memo} from "@/lib/types";

const DailyView = () => {
    const today = new Date()
    const formattedDate = format(today, 'yyyy-MM-dd')
    const userId = 'test-user'
    
    const {
        blocks,
        isLoading,
        error,
        addBlock,
        updateBlock,
        deleteBlock,
        addTodo,
        toggleTodo,
        deleteTodo
    } = useBlocks(userId, formattedDate)

    const [memos, setMemos] = React.useState<Memo[]>([])

    const handleTitleChange = (blockId: string, title: string) => {
        updateBlock(blockId, { title })
    }

    const handleTimeChange = (blockId: string, start: string, end: string) => {
        updateBlock(blockId, { startTime: start, endTime: end })
    }

    const handleReflectionChange = (blockId: string, reflection: string) => {
        updateBlock(blockId, { reflection })
    }

    const handleAddMemo = (content: string) => {
        const newMemo: Memo = {
            id: Date.now().toString(),
            user_id: userId,
            date: formattedDate,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        setMemos([...memos, newMemo])
    }

    const handleUpdateMemo = (id: string, content: string) => {
        setMemos(memos.map(memo =>
            memo.id === id ? { ...memo, content } : memo
        ))
    }

    const handleDeleteMemo = (id: string) => {
        setMemos(memos.filter(memo => memo.id !== id))
    }

    if (isLoading) return <div>로딩 중...</div>
    if (error) return <div>에러가 발생했습니다: {error.message}</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">
                        {format(today, 'yyyy.MM.dd')}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <React.Fragment key={block.id}>
                        {(index === 2 || index === 4) && (
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-primary/20"/>
                                </div>
                                <div className="relative flex justify-center">
                                    <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full border border-border">
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
                            isLastBlock={blocks.length === 1}
                            onTitleChange={(value) => handleTitleChange(block.id, value)}
                            onTimeChange={(start, end) => handleTimeChange(block.id, start, end)}
                            onAddTodo={(content) => addTodo(block.id, content)}
                            onToggleTodo={(todoId) => toggleTodo(block.id, todoId)}
                            onReflectionChange={(value) => handleReflectionChange(block.id, value)}
                            onDeleteTodo={(todoId) => deleteTodo(block.id, todoId)}
                            onDeleteBlock={() => deleteBlock(block.id)}
                        />
                    </React.Fragment>
                ))}

                {blocks.length < 6 && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={addBlock}
                    >
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        블록 추가 ({blocks.length}/6)
                    </Button>
                )}
            </div>

            <MemoSection
                memos={memos}
                onAddMemo={handleAddMemo}
                onUpdateMemo={handleUpdateMemo}
                onDeleteMemo={handleDeleteMemo}
            />
        </div>
    )
}

export default DailyView
