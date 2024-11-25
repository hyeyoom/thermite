import React from 'react'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"

interface TimeRangeDialogProps {
    isOpen: boolean
    onClose: () => void
    startTime: string
    endTime: string
    onSubmit: (startTime: string, endTime: string) => void
}

const TimeRangeDialog = ({
                             isOpen,
                             onClose,
                             startTime: initialStartTime,
                             endTime: initialEndTime,
                             onSubmit,
                         }: TimeRangeDialogProps) => {
    const [tempStartTime, setTempStartTime] = React.useState(initialStartTime)
    const [tempEndTime, setTempEndTime] = React.useState(initialEndTime)

    const handleSubmit = () => {
        onSubmit(tempStartTime, tempEndTime)
        onClose()
    }

    const timeOptions = Array.from({length: 48}).map((_, i) => {
        const hour = Math.floor(i / 2).toString().padStart(2, '0')
        const minute = i % 2 === 0 ? '00' : '30'
        return `${hour}:${minute}`
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>시간 범위 설정</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">시작 시간</label>
                            <select
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                value={tempStartTime}
                                onChange={(e) => setTempStartTime(e.target.value)}
                            >
                                <option value="">선택...</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">종료 시간</label>
                            <select
                                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                value={tempEndTime}
                                onChange={(e) => setTempEndTime(e.target.value)}
                            >
                                <option value="">선택...</option>
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            취소
                        </Button>
                        <Button onClick={handleSubmit}>
                            확인
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TimeRangeDialog
