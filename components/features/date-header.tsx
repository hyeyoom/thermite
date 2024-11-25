'use client'

import {format, addDays} from "date-fns"
import {ko} from 'date-fns/locale'
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {useRouter} from "next/navigation"

interface DateHeaderProps {
    date: Date
}

const DateHeader = ({date}: DateHeaderProps) => {
    const router = useRouter()

    const handleDateChange = (days: number) => {
        const newDate = addDays(date, days)
        const formattedDate = format(newDate, 'yyyy-MM-dd')
        router.push(`/dashboard/${formattedDate}`)
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                    {format(date, 'EEEE', {locale: ko})}
                </span>
                <span className="text-lg text-muted-foreground">
                    {format(date, 'yyyy.MM.dd')}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDateChange(-1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDateChange(1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default DateHeader 