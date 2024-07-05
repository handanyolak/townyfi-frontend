<template>
  <ClientOnly>
    <div
      ref="chatBox"
      :class="[
        isChat ? 'max-h-96' : 'max-h-9',
        'ease fixed bottom-0 right-0 z-90 flex w-80 flex-col transition-all duration-700',
      ]"
    >
      <div
        class="grid h-10 w-full grid-cols-2 gap-x-1 rounded-t-2xl border border-b border-towny-brown-light-300 bg-towny-brown-light-300 p-2 shadow-md"
      >
        <button class="chat-tab-button" @click="toggleChatTabs(1)">
          Chat Box
        </button>
        <button class="chat-tab-button" @click="toggleChatTabs(2)">Logs</button>
      </div>

      <div class="h-72">
        <div
          :class="[
            'h-full overflow-auto bg-towny-brown-light-300',
            { hidden: openChatTab !== 1, block: openChatTab === 1 },
          ]"
        >
          <ChatBox />
        </div>

        <div
          :class="[
            'h-full overflow-auto bg-towny-brown-light-300',
            { hidden: openChatTab !== 2, block: openChatTab === 2 },
          ]"
        >
          <LogBox />
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

// --------[ Method ]-------- //
const toggleChatTabs = (tabNumber: number) => {
  if (!isChat.value) {
    toggleChat()
  } else if (openChatTab.value === tabNumber) {
    toggleChat()
  }
  openChatTab.value = tabNumber
  // TODO: NextTick will be added based on the logs
}

const toggleChat = () => {
  isChat.value = !isChat.value
}

onClickOutside(chatBox, () => (isChat.value = false))
</script>

<style scoped>
.chat-tab-button {
  @apply rounded-t-xl bg-towny-brown-dark-100 px-2 py-1 text-sm font-medium text-white outline-none transition-all duration-300 ease-out hover:bg-[#c99f75];
}
</style>
