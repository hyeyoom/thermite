import {DailyViewServer} from '@/components/features/daily-view/daily-view-server'
import {notFound} from 'next/navigation'
import {isValid, parse} from 'date-fns'

interface DashboardPageProps {
    params: {
        date: string
    }
}

export default function DashboardPage({params}: DashboardPageProps) {
    // YYYY-MM-DD 형식의 날짜 유효성 검사
    const parsedDate = parse(params.date, 'yyyy-MM-dd', new Date())

    if (!isValid(parsedDate)) {
        notFound()
    }

    return <DailyViewServer date={params.date}/>
}
