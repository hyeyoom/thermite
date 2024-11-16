'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, X } from "lucide-react"

interface Memo {
  id: string
  content: string
}

interface MemoSectionProps {
  memos: Memo[]
  onAddMemo: (content: string) => void
  onUpdateMemo?: (id: string, content: string) => void
  onDeleteMemo?: (id: string) => void
}

const MemoSection = ({ 
  memos, 
  onAddMemo,
  onUpdateMemo = () => {},
  onDeleteMemo = () => {} 
}: MemoSectionProps) => {
  const [newMemo, setNewMemo] = useState("")
  const [isComposing, setIsComposing] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing && newMemo.trim()) {
      e.preventDefault()
      onAddMemo(newMemo.trim())
      setNewMemo("")
    }
  }

  const handleMemoEdit = (memo: Memo, newContent: string) => {
    onUpdateMemo(memo.id, newContent)
  }

  return (
    <Card className="p-4 grid grid-cols-[2fr,1fr] gap-4">
      {/* 메모 리스트 영역 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">메모</h3>
        </div>
        
        {/* 메모 입력 */}
        <input
          type="text"
          value={newMemo}
          onChange={(e) => setNewMemo(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className="w-full px-3 py-1 rounded-md border"
          placeholder="새 메모 추가... (Enter)"
        />
        
        {/* 메모 목록 */}
        <ul className="space-y-2">
          {memos.map((memo) => (
            <li key={memo.id} className="group flex items-center gap-2 border-b border-muted">
              <input
                type="text"
                value={memo.content}
                onChange={(e) => handleMemoEdit(memo, e.target.value)}
                className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteMemo(memo.id)}
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
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