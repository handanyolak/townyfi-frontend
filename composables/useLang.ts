export default (word: string) => {
  const userOptionsStore = useUserOptionsStore()
  const { language } = userOptionsStore

  const words = {
    en: {
      disconnect_wallet: 'Disconnect Wallet',
    },
    tr: {
      disconnect_wallet: 'Cüzdan Bağlantısını Kes',
    },
  }

  return words[language][word]
}
