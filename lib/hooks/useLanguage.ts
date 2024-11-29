'use client'

import {useEffect, useState} from 'react'
import {DEFAULT_LANGUAGE, type SupportedLanguage} from '@/lib/i18n/constants'

export function useLanguage() {
    const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE)

    useEffect(() => {
        // 1. 서버에서 감지한 선호 언어 확인
        const preferredLanguage = document.querySelector('meta[name="x-preferred-language"]')?.getAttribute('content') as SupportedLanguage

        // 2. 브라우저 언어 설정 확인
        const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage

        setLanguage(preferredLanguage || browserLanguage || DEFAULT_LANGUAGE)
    }, [])

    return language
}
