'use client'

import React, {useCallback, useState} from 'react'
import {Button} from "@/components/ui/button"
import {PlusCircle, X} from "lucide-react"
import {MemoSectionProps} from "@/lib/types";
import {Input} from "@/components/ui/input"

const MemoSection = ({
                         memos,
                         assessments = [],
                         onAddMemo,
                         onUpdateMemo,
                         onDeleteMemo,
                         onAddAssessment,
                         onUpdateAssessment,
                         onDeleteAssessment,
                     }: MemoSectionProps) => {
    const [editState, setEditState] = useState<{
        type: 'memo' | 'assessment' | null;
        content: string;
        assessmentType?: 'good' | 'bad' | 'next';
    }>({
        type: null,
        content: ''
    });

    const resetEditState = () => {
        setEditState({ type: null, content: '' });
    };

    const handleAddItem = () => {
        const { type, content, assessmentType } = editState;
        if (!content.trim()) return;

        if (type === 'memo') {
            onAddMemo(content.trim());
        } else if (type === 'assessment' && assessmentType) {
            onAddAssessment(assessmentType, content.trim());
        }
        resetEditState();
    };

    const debouncedUpdateMemo = useCallback(
        (memoId: string, content: string) => {
            onUpdateMemo(memoId, content);
        },
        [onUpdateMemo]
    );

    const debouncedUpdateAssessment = useCallback(
        (assessmentId: string, content: string) => {
            onUpdateAssessment(assessmentId, content);
        },
        [onUpdateAssessment]
    );

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 메모 섹션 */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold">메모</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditState({ type: 'memo', content: '' })}
                        >
                            <PlusCircle className="h-4 w-4"/>
                        </Button>
                    </div>

                    {editState.type === 'memo' && (
                        <Input
                            value={editState.content}
                            onChange={(e) => setEditState(prev => ({ ...prev, content: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddItem();
                                }
                            }}
                            placeholder="새 메모..."
                            autoFocus
                        />
                    )}

                    <ul className="space-y-2">
                        {memos.map((memo) => (
                            <li key={memo.id} className="group flex items-center gap-2 border-b-2 border-muted">
                                <input
                                    type="text"
                                    defaultValue={memo.content}
                                    onChange={(e) => debouncedUpdateMemo(memo.id, e.target.value)}
                                    className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
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
                                        onClick={() => setEditState({ type: 'assessment', content: '', assessmentType: type as 'good' | 'bad' | 'next' })}
                                    >
                                        <PlusCircle className="h-4 w-4"/>
                                    </Button>
                                </div>

                                {editState.type === 'assessment' && editState.assessmentType === type && (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editState.content}
                                            onChange={(e) => setEditState(prev => ({ ...prev, content: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddItem();
                                                }
                                            }}
                                            placeholder="새로운 항목 추가..."
                                            autoFocus
                                        />
                                        <Button size="sm" onClick={handleAddItem}>추가</Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={resetEditState}
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
                                                    defaultValue={assessment.content}
                                                    onChange={(e) => debouncedUpdateAssessment(assessment.id, e.target.value)}
                                                    className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
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
        </div>
    )
}

export default MemoSection
