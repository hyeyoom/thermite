import {format} from "date-fns"
import {ko} from 'date-fns/locale'

interface DateHeaderProps {
    date: Date
}

const DateHeader = ({date}: DateHeaderProps) => {
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
        </div>
    )
}

export default DateHeader 