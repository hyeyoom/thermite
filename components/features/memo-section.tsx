'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button"
import {PlusCircle, X} from "lucide-react"
import {Memo, MemoSectionProps} from "@/lib/types";
import {debounce} from 'lodash'
import {Input} from "@/components/ui/input"

const MemoSection = ({
                         memos,
                         assessments = [],
                         onAddMemo,
                         onUpdateMemo = () => {},
                         onDeleteMemo = () => {},
                         onAddAssessment = () => {},
                         onUpdateAssessment = () => {},
                         onDeleteAssessment = () => {},
                     }: MemoSectionProps) => {
    const [isAddingMemo, setIsAddingMemo] = useState(false)
    const [newMemoContent, setNewMemoContent] = useState('')
    const [isAddingEvaluation, setIsAddingEvaluation] = useState<'good' | 'bad' | 'next' | null>(null)
    const [newEvaluationContent, setNewEvaluationContent] = useState('')

    const handleAddMemo = () => {
        if (newMemoContent.trim()) {
            onAddMemo(newMemoContent.trim())
            setNewMemoContent('')
            setIsAddingMemo(false)
        }
    }

    const handleMemoEdit = debounce((memo: Memo, content: string) => {
        onUpdateMemo(memo.id, content)
    }, 500)

    const handleAddEvaluation = () => {
        if (isAddingEvaluation && newEvaluationContent.trim()) {
            onAddAssessment(isAddingEvaluation, newEvaluationContent.trim())
            setNewEvaluationContent('')
            setIsAddingEvaluation(null)
        }
    }

    return (
        <div className="space-y-8">
            {/* 메모 섹션 */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold">메모</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingMemo(true)}
                    >
                        <PlusCircle className="h-4 w-4"/>
                    </Button>
                </div>

                {isAddingMemo && (
                    <div className="flex items-center gap-2">
                        <Input
                            value={newMemoContent}
                            onChange={(e) => setNewMemoContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddMemo()
                                }
                            }}
                            placeholder="새 메모..."
                            className="flex-1"
                            autoFocus
                        />
                        <Button size="sm" onClick={handleAddMemo}>추가</Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsAddingMemo(false)
                                setNewMemoContent('')
                            }}
                        >
                            취소
                        </Button>
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
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onDeleteMemo(memo.id)}
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 평가 섹션 */}
            <div className="space-y-4">
                <h3 className="font-bold">평가</h3>
                <div className="space-y-6">
                    {['good', 'bad', 'next'].map((type) => (
                        <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">
                                    {type === 'good' ? '잘한 점' : type === 'bad' ? '아쉬운 점' : '다음에는'}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddingEvaluation(type as 'good' | 'bad' | 'next')}
                                >
                                    <PlusCircle className="h-4 w-4"/>
                                </Button>
                            </div>

                            {isAddingEvaluation === type && (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={newEvaluationContent}
                                        onChange={(e) => setNewEvaluationContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleAddEvaluation()
                                            }
                                        }}
                                        placeholder="새로운 항목 추가..."
                                        className="flex-1"
                                        autoFocus
                                    />
                                    <Button size="sm" onClick={handleAddEvaluation}>추가</Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsAddingEvaluation(null)
                                            setNewEvaluationContent('')
                                        }}
                                    >
                                        취소
                                    </Button>
                                </div>
                            )}

                            <ul className="space-y-2">
                                {assessments
                                    .filter(assessment => assessment.type === type)
                                    .map((assessment) => (
                                        <li key={assessment.id} className="group flex items-center gap-2 border-b-2 border-muted">
                                            <input
                                                type="text"
                                                value={assessment.content}
                                                onChange={(e) => onUpdateAssessment(assessment.id, e.target.value)}
                                                className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => onDeleteAssessment(assessment.id)}
                                            >
                                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                                            </Button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MemoSection
