import {LoginButton} from "@/components/features/auth/login-button"
import {createSupabaseClientForServer} from "@/lib/utils/supabase/server"
import {redirect} from "next/navigation"
import {getTranslation} from "@/lib/i18n/server"

export default async function LandingPage() {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()
    const {t} = getTranslation()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                    <span className="text-primary">{t('landing.title')}</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    {t('landing.description')}
                </p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <LoginButton/>
                <p className="text-sm text-muted-foreground">
                    로그인하고 바로 시작하세요
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                {features.map((feature, i) => (
                    <div key={i} className="p-6 rounded-lg border bg-card">
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const features = [
    {
        title: '시간 블록 관리',
        description: '하루를 6개의 블록으로 나누어 시간을 효율적으로 관리하세요.'
    },
    {
        title: '할 일 관리',
        description: '각 블록별로 할 일을 관리하고 진행 상황을 추적하세요.'
    },
    {
        title: '회고와 평가',
        description: '하루를 마무리하며 회고하고 다음을 계획하세요.'
    }
]
