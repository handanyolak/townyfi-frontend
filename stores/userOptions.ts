export const useUserOptionsStore = defineStore('userOptionsStore', {
  state: () => ({
    language: 'tr',
  }),
  getters: {},
  actions: {
    setLanguage(language: string) {
      this.language = language
    },
  },
})
