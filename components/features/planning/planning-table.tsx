'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {Card} from '@/components/ui/card'
import {BlockType} from '@/lib/types'
import {Input} from '@/components/ui/input'
import {useMediaQuery} from "@/hooks/use-media-query";
import {format} from "date-fns";

interface WeekDay {
    date: Date
    dayName: string
    fullDate: string
}

interface PlanningTableProps {
    weekDays: WeekDay[]
    blocks: BlockType[]
    userId: string
    onUpdateBlock: (blockId: string, updates: Partial<BlockType>) => Promise<void>
    onAddBlock: (date: string, blockNumber: number) => Promise<BlockType>
}

interface EditingCell {
    date: string
    blockNumber: number
}

export function PlanningTable({
                                  weekDays,
                                  blocks,
                                  onUpdateBlock,
                                  onAddBlock,
                              }: PlanningTableProps) {
    const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
    const [editingTitle, setEditingTitle] = useState('')
    const isMobile = useMediaQuery('(max-width: 768px)')

    const getBlock = (date: string, blockNumber: number) => {
        return blocks.find(block => block.date === date && block.number === blockNumber)
    }

    const handleCellClick = async (date: string, blockNumber: number) => {
        setEditingCell({date, blockNumber})
        setEditingTitle('')
    }

    const handleTitleSave = async (blockId: string | undefined) => {
        if (!editingCell) return
        if (editingTitle === '') return

        try {
            if (blockId) {
                onUpdateBlock(blockId, {title: editingTitle})
                    .finally(() => {
                        setEditingCell(null)
                        setEditingTitle('')
                    })
            } else {
                onAddBlock(editingCell.date, editingCell.blockNumber)
                    .then(r =>
                        onUpdateBlock(r.id, {title: editingTitle})
                    )
                    .finally(() => {
                        setEditingCell(null)
                        setEditingTitle('')
                    })
            }
        } catch (error) {
            console.error('Error updating block title:', error)
        }
    }

    if (isMobile) {
        return (
            <div className="space-y-8">
                {weekDays.map((day) => (
                    <div key={day.fullDate} className="space-y-4">
                        <div
                            className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
                            <Link
                                href={`/dashboard/${day.fullDate}`}
                                className="flex flex-col items-center hover:text-primary transition-colors"
                            >
                                <div className="font-medium">{day.dayName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {format(day.date, 'M월 d일')}
                                </div>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Array.from({length: 6}, (_, blockIndex) => {
                                const block = getBlock(day.fullDate, blockIndex + 1)
                                const isEditing = editingCell?.date === day.fullDate &&
                                    editingCell?.blockNumber === blockIndex + 1

                                return (
                                    <Card
                                        key={`cell-${blockIndex}`}
                                        className={`p-3 min-h-[80px] flex flex-col items-center justify-center cursor-pointer
                      ${block?.title
                                            ? 'bg-primary/5 hover:bg-primary/10'
                                            : 'hover:border-primary/50'
                                        } 
                      ${isEditing ? 'border-primary' : ''} 
                      transition-colors relative`}
                                        onClick={() => handleCellClick(day.fullDate, blockIndex + 1)}
                                    >
                                        <div className="absolute top-1.5 left-2 text-xs text-muted-foreground">
                                            {blockIndex + 1}
                                        </div>
                                        {isEditing ? (
                                            <Input
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onBlur={() => handleTitleSave(block?.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                        e.preventDefault()
                                                        handleTitleSave(block?.id)
                                                    }
                                                }}
                                                autoFocus
                                                placeholder="제목 입력"
                                                className="text-center font-medium text-sm"
                                            />
                                        ) : (
                                            <span className="font-medium text-sm text-center">
                        {block?.title || ''}
                      </span>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2">
                    {/* 헤더 행 */}
                    <div className="p-4"/>
                    {weekDays.map((day) => (
                        <Link
                            key={day.fullDate}
                            href={`/dashboard/${day.fullDate}`}
                            className="p-4 text-center hover:text-primary transition-colors"
                        >
                            <div className="font-medium">{day.dayName}</div>
                            <div className="text-sm text-muted-foreground">
                                {day.date.getDate()}일
                            </div>
                        </Link>
                    ))}

                    {/* 블록 행들 */}
                    {Array.from({length: 6}, (_, blockIndex) => (
                        <React.Fragment key={`row-${blockIndex}`}>
                            <div className="p-4 flex items-center justify-center font-medium">
                                {blockIndex + 1}
                            </div>
                            {weekDays.map((day) => {
                                const block = getBlock(day.fullDate, blockIndex + 1)
                                const isEditing = editingCell?.date === day.fullDate &&
                                    editingCell?.blockNumber === blockIndex + 1

                                return (
                                    <Card
                                        key={`cell-${day.fullDate}-${blockIndex}`}
                                        className={`p-4 min-h-[100px] flex items-center justify-center cursor-pointer
                      ${block?.title
                                            ? 'bg-primary/5 hover:bg-primary/10'
                                            : 'hover:border-primary/50'
                                        } 
                      ${isEditing ? 'border-primary' : ''} 
                      transition-colors`}
                                        onClick={() => handleCellClick(day.fullDate, blockIndex + 1)}
                                    >
                                        {isEditing ? (
                                            <Input
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onBlur={() => handleTitleSave(block?.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                        e.preventDefault()
                                                        handleTitleSave(block?.id)
                                                    }
                                                }}
                                                autoFocus
                                                placeholder="제목을 입력하세요"
                                                className="text-center font-medium"
                                            />
                                        ) : (
                                            <span className="font-medium">
                        {block?.title || ''}
                      </span>
                                        )}
                                    </Card>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}
