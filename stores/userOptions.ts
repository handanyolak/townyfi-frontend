export const useUserOptionsStore = defineStore('userOptionsStore', () => {
  // --------[ States ]-------- //
  const language = ref(detectLanguage())

  // --------[ Actions ]-------- //
  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage
    localStorage.setItem('lang', newLanguage)

    return true
  }

  function detectLanguage(): string {
    const currentLanguage = localStorage.getItem('lang')

    if (!currentLanguage) {
      const defaultLanguage = 'en'
      localStorage.setItem('lang', defaultLanguage)

      return defaultLanguage
    }

    return currentLanguage
  }

  return { language, setLanguage }
})
