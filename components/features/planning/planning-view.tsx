'use client'

import {useEffect, useMemo, useState} from 'react'
import {WeekStartSelect} from './week-start-select'
import {PlanningTable} from './planning-table'
import {addDays, format, startOfWeek} from 'date-fns'
import {ko} from 'date-fns/locale'
import {addBlockServerAction, fetchWeeklyBlocksServerAction, updateBlockServerAction} from '@/app/actions/block.actions'
import {BlockType} from '@/lib/types'

interface PlanningViewProps {
    userId: string
}

export function PlanningView({userId}: PlanningViewProps) {
    const [weekStart, setWeekStart] = useState<'monday' | 'sunday'>('monday')
    const [blocks, setBlocks] = useState<BlockType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const weekDays = useMemo(() => {
        const today = new Date()
        const start = startOfWeek(today, {
            weekStartsOn: weekStart === 'monday' ? 1 : 0,
            locale: ko
        })

        return Array.from({length: 7}, (_, i) => {
            const date = addDays(start, i)
            return {
                date,
                dayName: format(date, 'E', {locale: ko}),
                fullDate: format(date, 'yyyy-MM-dd')
            }
        })
    }, [weekStart])

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setIsLoading(true)
                const weekDates = weekDays.map(day => day.fullDate)
                const data = await fetchWeeklyBlocksServerAction(userId, weekDates)
                setBlocks(data)
            } catch (error) {
                console.error('Error fetching blocks:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (userId) {
            fetchBlocks()
        }
    }, [userId, weekStart])

    const handleUpdateBlock = async (blockId: string, updates: Partial<BlockType>) => {
        try {
            await updateBlockServerAction(blockId, updates)
            setBlocks(prevBlocks =>
                prevBlocks.map(block =>
                    block.id === blockId ? {...block, ...updates} : block
                )
            )
        } catch (error) {
            console.error('Error updating block:', error)
        }
    }

    const handleAddBlock = async (date: string, blockNumber: number) => {
        try {
            const newBlock = await addBlockServerAction(userId, date, blockNumber)
            setBlocks(prevBlocks => [...prevBlocks, newBlock])
            return newBlock
        } catch (error) {
            console.error('Error adding block:', error)
            throw error
        }
    }

    if (!userId) {
        return <div>로그인이 필요합니다.</div>
    }

    return (
        <div className="max-w-7xl mx-auto pt-12 space-y-8">
            <div className="flex justify-end">
                <WeekStartSelect value={weekStart} onChange={setWeekStart}/>
            </div>
            <PlanningTable
                weekDays={weekDays}
                blocks={blocks}
                userId={userId}
                isLoading={isLoading}
                onUpdateBlock={handleUpdateBlock}
                onAddBlock={handleAddBlock}
            />
        </div>
    )
}
