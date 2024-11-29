export const SUPPORTED_LANGUAGES = ['ko', 'en'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko'

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    ko: '한국어',
    en: 'English'
}
