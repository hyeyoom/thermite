import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {HomeIcon} from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-xl text-muted-foreground">페이지를 찾을 수 없습니다</p>
            <Button asChild>
                <Link href="/" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4"/>
                    <span>홈으로 돌아가기</span>
                </Link>
            </Button>
        </div>
    )
}
