'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WeekStartSelectProps {
  value: string
  onChange: (value: 'monday' | 'sunday') => void
}

export function WeekStartSelect({ value, onChange }: WeekStartSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="주 시작일" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monday">월요일부터</SelectItem>
        <SelectItem value="sunday">일요일부터</SelectItem>
      </SelectContent>
    </Select>
  )
} 