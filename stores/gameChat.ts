import type { ChatMessageInfo } from '~/types'
export const useGameChatStore = defineStore('gameChatStore', () => {
  const logMessages = ref<string[]>([])
  const chatMessages = ref<ChatMessageInfo[]>([])

  const addLogMessage = (message: string) => {
    if (logMessages.value.length >= 1000) {
      logMessages.value.shift()
    }

    logMessages.value.push(message)
  }

  const addChatMessages = (chatMessageInfo: ChatMessageInfo) => {
    if (chatMessages.value.length >= 1000) {
      chatMessages.value.shift()
    }

    chatMessages.value.push(chatMessageInfo)
  }

  return {
    logMessages,
    addLogMessage,
    addChatMessages,
    chatMessages,
  }
})
