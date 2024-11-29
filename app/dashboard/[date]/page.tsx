import {DailyViewServer} from '@/components/features/daily-view/daily-view-server'
import {notFound} from 'next/navigation'
import {isValid, parse} from 'date-fns'
import { Metadata } from 'next'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DashboardPageProps {
    params: {
        date: string
    }
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
    const date = format(new Date(params.date), 'yyyy년 MM월 dd일', { locale: ko })
    
    return {
        title: `${date} 플래닝`,
        description: `${date}의 일정을 6개의 블록으로 관리하세요.`,
        openGraph: {
            title: `${date} 플래닝 | Block 6`,
            description: `${date}의 일정을 6개의 블록으로 관리하세요.`
        }
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
