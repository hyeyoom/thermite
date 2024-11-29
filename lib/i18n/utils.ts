import {SupportedLanguage} from './constants'
import {TranslationKey} from './types'
import {ko} from './translations/ko'
import {en} from './translations/en'

const translations = {
    ko,
    en
}

export function translate(key: TranslationKey, language: SupportedLanguage): string {
    return translations[language][key] || key
}
