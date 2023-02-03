import en from '~/locales/en.json'
import tr from '~/locales/tr.json'
import de from '~/locales/de.json'

export const useLang = (word: string) => {
  const userOptionsStore = useUserOptionsStore()
  const { language } = userOptionsStore

  const words = {
    en,
    tr,
    de,
  }

  return words[language][word]
}
