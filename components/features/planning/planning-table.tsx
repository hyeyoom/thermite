import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface WeekDay {
  date: Date
  dayName: string
  fullDate: string
}

interface PlanningTableProps {
  weekDays: WeekDay[]
}

export function PlanningTable({ weekDays }: PlanningTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2">
          {/* 헤더 행 */}
          <div className="p-4" /> {/* 빈 셀 */}
          {weekDays.map((day) => (
            <Link 
              key={day.fullDate}
              href={`/dashboard?date=${day.fullDate}`}
              className="p-4 text-center hover:text-primary transition-colors"
            >
              <div className="font-medium">{day.dayName}</div>
              <div className="text-sm text-muted-foreground">
                {day.date.getDate()}일
              </div>
            </Link>
          ))}
          
          {/* 블록 행들 */}
          {Array.from({ length: 6 }, (_, blockIndex) => (
            <>
              <div className="p-4 flex items-center justify-center font-medium">
                {blockIndex + 1}
              </div>
              {weekDays.map((day) => (
                <Card 
                  key={`${day.fullDate}-${blockIndex}`}
                  className="p-4 min-h-[100px] hover:border-primary transition-colors cursor-pointer"
                >
                  {/* 블록 내용은 나중에 추가 */}
                </Card>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  )
} 