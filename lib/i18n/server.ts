import {headers} from 'next/headers'
import {translate} from './utils'
import {DEFAULT_LANGUAGE, SupportedLanguage} from './constants'
import type {TranslationKey} from './types'

export function getTranslation() {
    const headersList = headers()
    const preferredLanguage = headersList.get('x-preferred-language')

    return {
        t: (key: TranslationKey) => translate(key, (preferredLanguage || DEFAULT_LANGUAGE) as SupportedLanguage)
    }
}
