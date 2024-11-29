'use client'

import {useLanguage} from './useLanguage'
import {translate} from '@/lib/i18n/utils'
import {TranslationKey} from '@/lib/i18n/types'

export function useTranslation() {
    const language = useLanguage()

    return {
        t: (key: TranslationKey) => translate(key, language)
    }
}
