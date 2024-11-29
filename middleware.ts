import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, SupportedLanguage} from '@/lib/i18n/constants'

function getPreferredLanguage(request: NextRequest) {
    // Accept-Language 헤더에서 선호 언어 추출
    const acceptLanguage = request.headers.get('accept-language')
    if (!acceptLanguage) return DEFAULT_LANGUAGE

    // 예: ko;q=0.9,en;q=0.8 -> ['ko;q=0.9', 'en;q=0.8']
    const languages = acceptLanguage.split(',')

    // 지원하는 언어 중에서 첫 번째로 매칭되는 언어 반환
    for (const lang of languages) {
        const [language] = lang.split(';')
        const normalizedLang = language.trim().split('-')[0] // ko-KR -> ko

        if (SUPPORTED_LANGUAGES.includes(normalizedLang as SupportedLanguage)) {
            return normalizedLang
        }
    }

    return DEFAULT_LANGUAGE
}

export function middleware(request: NextRequest) {
    const preferredLanguage = getPreferredLanguage(request)

    // 응답 헤더에 선호 언어 추가
    const response = NextResponse.next()
    response.headers.set('x-preferred-language', preferredLanguage)

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
