'use client'

import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {upsertProfileServerAction} from "@/app/actions/profile.actions";

interface ProfileEditClientProps {
    userId: string,
    name: string,
    email: string,
}

export function ProfileEditClient({userId, name, email}: ProfileEditClientProps) {
    const [isNameEditing, setIsNameEditing] = useState(false)
    const [editedName, setEditedName] = useState(name)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClickPencil = () => {
        setIsNameEditing(true)
    }

    const handleBlur = async () => {
        setIsNameEditing(false)
        const trimmedName = editedName.trim() || name
        setEditedName(trimmedName)
        
        try {
            console.log('프로필 업데이트 시도:', {userId, name: trimmedName})
            await upsertProfileServerAction(userId, {
                id: userId,
                name: trimmedName
            })
            console.log('프로필 업데이트 성공')
        } catch (error) {
            console.error('프로필 업데이트 중 오류:', error)
            setEditedName(name)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            handleBlur();
        }
    }

    useEffect(() => {
        if (isNameEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isNameEditing]);

    return (
        <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
                {isNameEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="text-2xl font-semibold border-b border-b-primary bg-transparent focus:outline-none"
                    />
                ) : (
                    <h3 className="text-2xl font-semibold">
                        {editedName}
                    </h3>
                )}
                <Button variant="ghost" size="icon" onClick={handleClickPencil}>
                    <Pencil className="w-4 h-4"/>
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">{email}</p>
        </div>
    )
}
