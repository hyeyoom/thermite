'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, X } from "lucide-react"

interface Memo {
  id: string
  content: string
}

interface Evaluation {
  id: string
  type: 'good' | 'bad' | 'next'
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
  const [isAddingMemo, setIsAddingMemo] = useState(false)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isAddingEvaluation, setIsAddingEvaluation] = useState<'good' | 'bad' | 'next' | null>(null)
  const [newEvaluation, setNewEvaluation] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing && newMemo.trim()) {
      e.preventDefault()
      onAddMemo(newMemo.trim())
      setNewMemo("")
      setIsAddingMemo(false)
    }
  }

  const handleMemoEdit = (memo: Memo, newContent: string) => {
    onUpdateMemo(memo.id, newContent)
  }

  const handleAddEvaluation = (type: 'good' | 'bad' | 'next') => {
    if (newEvaluation.trim()) {
      setEvaluations([
        ...evaluations,
        { id: Date.now().toString(), type, content: newEvaluation.trim() }
      ])
      setNewEvaluation("")
      setIsAddingEvaluation(null)
    }
  }

  const handleEvaluationEdit = (id: string, content: string) => {
    setEvaluations(evaluations.map(evaluation => 
      evaluation.id === id ? { ...evaluation, content } : evaluation
    ))
  }

  const handleDeleteEvaluation = (id: string) => {
    setEvaluations(evaluations.filter(evaluation => evaluation.id !== id))
  }

  return (
    <Card className="p-4 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 border-2">
      {/* 메모 리스트 영역 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">메모</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingMemo(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        {isAddingMemo && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              className="flex-1 text-sm px-2 py-1 border-b-2 border-input focus:outline-none focus:border-foreground transition-colors"
              placeholder="새 메모 입력... (Enter)"
              autoFocus
            />
          </div>
        )}
        
        <ul className="space-y-2">
          {memos.map((memo) => (
            <li key={memo.id} className="group flex items-center gap-2 border-b-2 border-muted">
              <input
                type="text"
                value={memo.content}
                onChange={(e) => handleMemoEdit(memo, e.target.value)}
                className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteMemo(memo.id)}
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* 평가 블록 */}
      <div className="space-y-4">
        <h3 className="font-bold">평가</h3>
        <div className="space-y-6">
          {['good', 'bad', 'next'].map((type) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingEvaluation(type as 'good' | 'bad' | 'next')}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <ul className="space-y-1">
                {evaluations
                  .filter(item => item.type === type)
                  .map(item => (
                    <li key={item.id} className="group flex items-center gap-2 text-sm border-b-2 border-muted py-1">
                      <input
                        type="text"
                        value={item.content}
                        onChange={(e) => handleEvaluationEdit(item.id, e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteEvaluation(item.id)}
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </li>
                  ))}
              </ul>

              {isAddingEvaluation === type && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newEvaluation}
                    onChange={(e) => setNewEvaluation(e.target.value)}
                    className="flex-1 text-sm px-2 py-1 border-b-2 border-input focus:outline-none focus:border-foreground transition-colors"
                    placeholder={`${type} 입력...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddEvaluation(type as 'good' | 'bad' | 'next')
                      }
                    }}
                    autoFocus
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default MemoSection 