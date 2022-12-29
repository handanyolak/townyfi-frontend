export default (word: string) => {
  const userOptionsStore = useUserOptionsStore()
  const { language } = userOptionsStore

  const words = {
    tr: {
      welcome: 'Hosgeldin',
      my_love: '$ikim',
    },
    en: {
      welcome: 'Welcome',
      my_love: 'My love',
    },
    fr: {
      welcome: 'Bienvenue',
      my_love: 'Mon amour',
    },
  }

  return words[language][word]
}
