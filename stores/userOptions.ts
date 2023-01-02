export const useUserOptionsStore = defineStore('userOptionsStore', () => {
  const language = ref(detectLanguage())

  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage
    localStorage.setItem('lang', newLanguage)

    return true
  }

  function detectLanguage() {
    const currentLanguage = localStorage.getItem('lang')

    if (!currentLanguage) {
      localStorage.setItem('lang', 'en')
    }

    return localStorage.getItem('lang')
  }

  return { language, setLanguage }
})
