import enJson from '~/locales/en.json'

export const useLang = (word: string) => {
  const userOptionsStore = useUserOptionsStore()
  const { language } = userOptionsStore

  const words = {
    en: enJson,
    tr: {
      disconnect_wallet: 'Cüzdan Bağlantısını Kes',
    },
    gr: {
      disconnect_wallet: 'Ich lie',
    },
  }

  return words[language][word]
}
