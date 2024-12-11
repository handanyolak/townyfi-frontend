export const useEventStore = defineStore('eventStore', () => {
  const gameFinishedEvent = ref<boolean | null>(null)

  function triggerGameFinishedEvent() {
    gameFinishedEvent.value = true
  }

  function clearGameFinishedEvent() {
    gameFinishedEvent.value = null
  }

  return {
    gameFinishedEvent,
    triggerGameFinishedEvent,
    clearGameFinishedEvent,
  }
})
