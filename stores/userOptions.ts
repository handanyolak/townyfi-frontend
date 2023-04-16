export const useUserOptionsStore = defineStore('userOptionsStore', () => {
  //--------[ States ]--------//
  const language = ref(detectLanguage())

  //--------[ Actions ]--------//
  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage
    localStorage.setItem('lang', newLanguage)

    return true
  }

  function detectLanguage(): string {
    const currentLanguage = localStorage.getItem('lang')

    if (!currentLanguage) {
      localStorage.setItem('lang', 'en')
    }

    return localStorage.getItem('lang')
  }

  return { language, setLanguage }
})
