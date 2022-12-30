export const useUserOptionsStore = defineStore('userOptionsStore', {
  state: () => ({
    language: localStorage.getItem('lang'),
  }),
  getters: {},
  actions: {
    setLanguage(language: string) {
      this.language = language
    },
  },
})
