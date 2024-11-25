'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { BlockType } from '@/lib/types'
import { Input } from '@/components/ui/input'

interface WeekDay {
  date: Date
  dayName: string
  fullDate: string
}

interface PlanningTableProps {
  weekDays: WeekDay[]
  blocks: BlockType[]
  userId: string
  isLoading: boolean
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
  userId,
  isLoading,
  onUpdateBlock,
  onAddBlock
}: PlanningTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const getBlock = (date: string, blockNumber: number) => {
    return blocks.find(block => block.date === date && block.number === blockNumber)
  }

  const handleCellClick = async (date: string, blockNumber: number) => {
    const block = getBlock(date, blockNumber)
    if (!block) {
      try {
        const newBlock = await onAddBlock(date, blockNumber)
        setEditingCell({ date, blockNumber })
        setEditingTitle('')
      } catch (error) {
        console.error('Error creating block:', error)
      }
    } else {
      // 기존 블록도 클릭 시 편집 가능하도록 수정
      setEditingCell({ date, blockNumber })
      setEditingTitle(block.title || '')
    }
  }

  const handleTitleSave = async (blockId: string | undefined) => {
    if (!editingCell || !blockId) return

    try {
      await onUpdateBlock(blockId, { title: editingTitle })
      setEditingCell(null)
      setEditingTitle('')
    } catch (error) {
      console.error('Error updating block title:', error)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">로딩 중...</div>
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2">
          {/* 헤더 행 */}
          <div className="p-4" />
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
          {Array.from({ length: 6 }, (_, blockIndex) => (
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
                      ${isEditing ? 'border-primary' : 'hover:border-primary/50'} 
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
