'use client'

import React, { useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import {WeekStartSelect} from "@/components/features/planning/week-start-select";
import {PlanningTable} from "@/components/features/planning/planning-table";

export function PlanningView() {
  const [weekStart, setWeekStart] = useState<'monday' | 'sunday'>('monday')
  const today = new Date()

  const getWeekDays = () => {
    const start = startOfWeek(today, {
      weekStartsOn: weekStart === 'monday' ? 1 : 0,
      locale: ko
    })

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i)
      return {
        date,
        dayName: format(date, 'E', { locale: ko }),
        fullDate: format(date, 'yyyy-MM-dd')
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto pt-12 space-y-8">
      <div className="flex justify-end">
        <WeekStartSelect value={weekStart} onChange={setWeekStart} />
      </div>
      <PlanningTable weekDays={getWeekDays()} />
    </div>
  )
}
