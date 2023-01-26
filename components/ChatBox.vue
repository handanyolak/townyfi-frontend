<template>
  <ClientOnly>
    <div>
      <div class="fixed bottom-0 right-0">
        <div
          class="ease flex w-56 flex-col transition-all duration-700"
          :class="isChat ? 'max-h-80' : 'max-h-9'"
        >
          <div
            class="grid h-10 w-full grid-cols-2 gap-x-1 rounded-t-2xl border border-b border-towni-brown-light-300 bg-towni-brown-light-300 p-2 shadow-md"
          >
            <button
              class="rounded-t-xl bg-towni-brown-dark-100 px-2 py-1 text-sm font-medium text-white outline-none transition-all duration-300 ease-out hover:bg-[#c99f75]"
              @click="toggleChatTabs(1)"
            >
              Chat Box
            </button>
            <button
              class="rounded-t-xl bg-towni-brown-dark-100 px-2 py-1 text-sm font-medium text-white outline-none transition-all duration-300 ease-out hover:bg-[#c99f75]"
              @click="toggleChatTabs(2)"
            >
              Logs
            </button>
          </div>

          <div class="h-72">
            <div
              :class="{ hidden: openChatTab !== 1, block: openChatTab === 1 }"
              class="bg-towni-brown-light-300"
            >
              <div ref="chatArea" class="h-56 overflow-auto p-4">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class="relative flex items-center"
                >
                  <img
                    class="mr-4 h-5 w-5 rounded-full"
                    src="@/assets/img/soldier.svg"
                  />
                  <p
                    style="font-size: 12px"
                    class="message-box relative z-10 my-2 inline-block rounded-[10px] p-2 after:absolute after:-left-4 after:-z-10 after:origin-top-right after:skew-x-65 after:rounded-l-xl after:rounded-r-sm after:border-r-[32px] after:border-b-[14px]"
                    :class="{
                      'bg-towni-brown-dark-300 text-white after:border-y-transparent after:border-r-towni-brown-dark-300 after:border-l-transparent':
                        message.author === 'you',
                      'bg-towni-brown-light-200 after:border-y-transparent after:border-r-towni-brown-light-200 after:border-l-transparent':
                        message.author !== 'you',
                    }"
                  >
                    {{ message.body }}
                  </p>
                </div>
              </div>

              <div
                class="border-towni-brown-light-4000 flex h-16 items-center border-t p-2"
              >
                <div class="mx-2 w-full">
                  <input
                    v-model="youMessage"
                    style="font-size: 12px"
                    class="bg-towni-brown-light-4000 w-full rounded-full border border-towni-brown-light-500 px-2 py-1 outline-none transition-all duration-300 ease-out focus:border-towni-brown-dark-300"
                    type="text"
                    placeholder="Aa"
                    autofocus
                    @keyup.enter="sendMessage('out')"
                  />
                </div>

                <div>
                  <button
                    class="inline-flex rounded-full p-1 outline-none hover:bg-towni-brown-light-400"
                    type="button"
                    @click="sendMessage('out')"
                  >
                    <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
                  </button>
                </div>
              </div>
            </div>

            <div
              :class="{ hidden: openChatTab !== 2, block: openChatTab === 2 }"
              class="h-full overflow-auto bg-towni-brown-light-300 p-3"
            >
              <div v-for="item in 9" :key="item" class="my-2 flex">
                <span
                  class="mr-1 inline-block h-1 w-1 rounded-full bg-red-600 p-1"
                ></span>
                <p class="text-xs">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Inventore, blanditiis?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const bobMessage = ref('')
const youMessage = ref('')
const isChat = ref(false)

const messages: any = [
  {
    body: "Welcome to the chat, I'm Bob!",
    author: 'bob',
  },
  {
    body: 'Thank you Bob',
    author: 'you',
  },
  {
    body: "You're most welcome",
    author: 'bob',
  },
]
const chatArea = ref(null)

const openChatTab = ref(1)

const toggleChatTabs = (tabNumber: number) => {
  if (!isChat.value) {
    toggleChat()
  } else if (openChatTab.value === tabNumber) {
    toggleChat()
  }
  openChatTab.value = tabNumber
  // TODO: loglara gore nextTick eklenecek
}

const sendMessage = (direction) => {
  if (!youMessage.value && !bobMessage.value) {
    return
  }

  if (direction === 'out') {
    messages.push({ body: youMessage.value, author: 'you' })
    youMessage.value = ''
  } else if (direction === 'in') {
    messages.push({ body: bobMessage.value, author: 'bob' })
    bobMessage.value = ''
  } else {
    alert('something went wrong')
  }
  nextTick(() => {
    chatArea.value.scrollTo({
      top: chatArea.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

/* const clearAllMessages = () => {
  messages = []
} */
const toggleChat = () => {
  isChat.value = !isChat.value
}
</script>

<style scoped>
div::-webkit-scrollbar-thumb {
  background-color: #c57b34;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

div::-webkit-scrollbar {
  width: 12px;
  background: transparent;
  border-radius: 5px;
}
</style>
