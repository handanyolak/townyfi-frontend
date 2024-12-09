<template>
  <ClientOnly>
    <div
      ref="chatBox"
      :class="[
        isChat ? 'max-h-[700px]' : 'max-h-12',
        'ease fixed bottom-0 right-0 z-90 flex w-full flex-col transition-all duration-700 md:w-[400px]',
      ]"
    >
      <div
        class="grid h-10 w-full grid-cols-2 gap-x-1 rounded-t-2xl border border-b border-towny-brown-light-300 bg-towny-brown-light-300 p-2 shadow-2xl"
      >
        <button
          :class="['chat-tab-button relative', tabClasses(1)]"
          @click="toggleChatTabs(1)"
        >
          Chat Box
          <span
            v-if="notifications.message && hasNewMessageVisible"
            class="absolute left-32 top-1.5 h-2.5 w-2.5 rounded-full bg-red-600"
          ></span>
        </button>
        <button
          :class="['chat-tab-button relative', tabClasses(2)]"
          @click="toggleChatTabs(2)"
        >
          Logs
          <span
            v-if="notifications.log && hasNewLogVisible"
            class="absolute left-32 top-1.5 h-2.5 w-2.5 rounded-full bg-red-600"
          ></span>
        </button>
      </div>

      <div class="h-[350px]">
        <div
          :class="[
            'h-full overflow-auto bg-towny-brown-light-300',
            tabVisibilityClass(1),
          ]"
        >
          <ChatBox
            :is-chat="isChat"
            @new-message-notification="
              (status) => handleNewNotification('message', status)
            "
          />
        </div>

        <div
          :class="[
            'h-full overflow-auto bg-towny-brown-light-300',
            tabVisibilityClass(2),
          ]"
        >
          <LogBox
            @new-log-notification="
              (status) => handleNewNotification('log', status)
            "
          />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import LogBox from '~/components/chatAndLog/LogBox.vue'
import ChatBox from '~/components/chatAndLog/ChatBox.vue'

// --------[ Data ]-------- //
const isChat = ref(false)
const chatBox = ref(null)
const openChatTab = ref(1)
const notifications = ref({
  message: false,
  log: false,
})

// --------[ Computed ]-------- //
const tabClasses = computed(() => {
  return (tabNumber: number) => {
    if (!isChat.value || (isChat.value && openChatTab.value !== tabNumber)) {
      return 'bg-towny-brown-dark-100'
    }
    if (isChat.value && openChatTab.value === tabNumber) {
      return 'bg-towny-brown-dark-400'
    }
    return ''
  }
})

const tabVisibilityClass = computed(() => {
  return (tabNumber: number) => ({
    hidden: openChatTab.value !== tabNumber,
    block: openChatTab.value === tabNumber,
  })
})

const hasNewMessageVisible = computed(() => {
  return !isChat.value || openChatTab.value !== 1
})

const hasNewLogVisible = computed(() => {
  return !isChat.value || openChatTab.value !== 2
})

// --------[ Method ]-------- //
const toggleChatTabs = (tabNumber: number) => {
  if (!isChat.value) {
    toggleChat()
  } else if (openChatTab.value === tabNumber) {
    toggleChat()
  }
  openChatTab.value = tabNumber
  // TODO: NextTick will be added based on the logs

  if (isChat.value) {
    updateNotification(tabNumber)
  }
}

const updateNotification = (tabNumber: number) => {
  const types: { [key: number]: 'message' | 'log' } = { 1: 'message', 2: 'log' }
  const type = types[tabNumber]

  if (type) {
    notifications.value[type] = false
  }
}

const handleNewNotification = (type: 'message' | 'log', status: boolean) => {
  const tabNumber = type === 'message' ? 1 : 2
  if (isChat.value && openChatTab.value === tabNumber) {
    notifications.value[type] = false
  } else {
    notifications.value[type] = status
  }
}

const toggleChat = () => {
  isChat.value = !isChat.value
}

onClickOutside(chatBox, () => (isChat.value = false))
</script>

<style lang="postcss" scoped>
.chat-tab-button {
  @apply rounded-t-2xl p-2 text-base font-medium text-white outline-none transition-all duration-300 ease-out hover:bg-towny-brown-dark-400 md:text-lg;
}
</style>
