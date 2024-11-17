'use client'

import React from 'react'
import {format} from "date-fns"
import {ko} from "date-fns/locale"
import {Button} from "@/components/ui/button"
import {PlusCircle} from "lucide-react"
import Block from "@/app/components/block";
import MemoSection from "@/app/components/memo-section";
import {BlockType, Memo} from "@/lib/types";

const DailyView = () => {
    const today = new Date()
    const [blocks, setBlocks] = React.useState<BlockType[]>([
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
    const [memos, setMemos] = React.useState<Memo[]>([])

    const handleTitleChange = (blockId: string, title: string) => {
        setBlocks(blocks.map(block =>
            block.id === blockId ? {...block, title} : block
        ))
    }

    const handleAddTodo = (blockId: string, content: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    todos: [
                        ...block.todos,
                        {id: Date.now().toString(), content, isCompleted: false}
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
                        todo.id === todoId ? {...todo, isCompleted: !todo.isCompleted} : todo
                    )
                }
            }
            return block
        }))
    }

    const handleAddMemo = (content: string) => {
        setMemos([...memos, {id: Date.now().toString(), content}])
    }

    const handleUpdateMemo = (id: string, content: string) => {
        setMemos(memos.map(memo =>
            memo.id === id ? {...memo, content} : memo
        ))
    }

    const handleDeleteMemo = (id: string) => {
        setMemos(memos.filter(memo => memo.id !== id))
    }

    const handleReflectionChange = (blockId: string, reflection: string) => {
        setBlocks(blocks.map(block =>
            block.id === blockId ? {...block, reflection} : block
        ))
    }

    const handleTimeChange = (blockId: string, start: string, end: string) => {
        setBlocks(blocks.map(block =>
            block.id === blockId
                ? {...block, startTime: start, endTime: end}
                : block
        ))
    }

    const handleAddBlock = () => {
        if (blocks.length >= 6) return

        const newBlock = {
            id: Date.now().toString(),
            number: blocks.length + 1,
            title: '',
            startTime: '',
            endTime: '',
            todos: [],
            reflection: ''
        }
        setBlocks([...blocks, newBlock])
    }

    const handleDeleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(block => block.id !== blockId))
        // 블록 번호 재정렬
        setBlocks(prevBlocks =>
            prevBlocks.map((block, index) => ({
                ...block,
                number: index + 1
            }))
        )
    }

    const handleDeleteTodo = (blockId: string, todoId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    todos: block.todos.filter(todo => todo.id !== todoId)
                }
            }
            return block
        }))
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                        {format(today, 'EEEE', {locale: ko})}
                    </span>
                    <span className="text-muted-foreground">
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
                            isLastBlock={blocks.length === 1}
                            onTitleChange={(value) => handleTitleChange(block.id, value)}
                            onTimeChange={(start, end) => handleTimeChange(block.id, start, end)}
                            onAddTodo={(content) => handleAddTodo(block.id, content)}
                            onToggleTodo={(todoId) => handleToggleTodo(block.id, todoId)}
                            onReflectionChange={(value) => handleReflectionChange(block.id, value)}
                            onDeleteTodo={(todoId) => handleDeleteTodo(block.id, todoId)}
                            onDeleteBlock={() => handleDeleteBlock(block.id)}
                        />
                    </React.Fragment>
                ))}

                {blocks.length < 6 && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleAddBlock}
                    >
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        블록 추가 ({blocks.length}/6)
                    </Button>
                )}
            </div>

            <div className="mt-8">
                <MemoSection
                    memos={memos}
                    onAddMemo={handleAddMemo}
                    onUpdateMemo={handleUpdateMemo}
                    onDeleteMemo={handleDeleteMemo}
                />
            </div>
        </div>
    )
}

export default DailyView
