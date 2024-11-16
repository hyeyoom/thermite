'use client'

import React from 'react'
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import MemoSection from './memo-section'

const DailyView = () => {
  const today = new Date()
  
  const handleAddMemo = (content: string) => {
    console.log('새 메모:', content)
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">
            {format(today, 'EEEE', { locale: ko })}
          </span>
          <span className="text-muted-foreground">
            {format(today, 'yyyy.MM.dd')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* 블록 컴포넌트들이 들어갈 예정 */}
      </div>

      <MemoSection 
        memos={[]} 
        onAddMemo={handleAddMemo} 
      />
    </div>
  )
}

export default DailyView 