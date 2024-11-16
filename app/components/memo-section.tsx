'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface Memo {
  id: string
  content: string
}

interface MemoSectionProps {
  memos: Memo[]
  onAddMemo: (content: string) => void
}

const MemoSection = ({ memos, onAddMemo }: MemoSectionProps) => {
  const [newMemo, setNewMemo] = useState("")

  return (
    <Card className="p-4 grid grid-cols-[2fr,1fr] gap-4">
      {/* 메모 리스트 영역 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">메모</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (newMemo.trim()) {
                onAddMemo(newMemo)
                setNewMemo("")
              }
            }}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 메모 입력 */}
        <input
          type="text"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          className="w-full px-3 py-1 rounded-md border"
          placeholder="새 메모 추가..."
        />
        
        {/* 메모 목록 */}
        <ul className="space-y-1 list-disc list-inside">
          {memos.map((memo) => (
            <li key={memo.id} className="text-sm">
              {memo.content}
            </li>
          ))}
        </ul>
      </div>

      {/* 평가 블록 */}
      <div className="space-y-2">
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium">GOOD</span>
            <input 
              type="text" 
              className="w-full px-2 py-1 text-sm rounded-md border"
              placeholder="잘한 점..."
            />
          </div>
          <div>
            <span className="text-xs font-medium">BAD</span>
            <input 
              type="text" 
              className="w-full px-2 py-1 text-sm rounded-md border"
              placeholder="개선할 점..."
            />
          </div>
          <div>
            <span className="text-xs font-medium">NEXT</span>
            <input 
              type="text" 
              className="w-full px-2 py-1 text-sm rounded-md border"
              placeholder="다음에는..."
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MemoSection 