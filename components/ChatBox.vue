<template>
  <div>
    <div class="fixed bottom-0 right-1">
      <div
        class="ease flex w-56 flex-col transition-all duration-700"
        :class="isChat ? 'max-h-96' : 'max-h-10'"
      >
        <div
          class="grid h-10 w-full grid-cols-2 gap-x-1 rounded-t-2xl border border-b bg-white p-2 shadow-md"
        >
          <button
            class="rounded-t-xl bg-yellow-800 px-2 py-1 text-white outline-none"
            @click="toggleChatTabs(1)"
          >
            Chat Box
          </button>
          <button
            class="rounded-t-xl bg-yellow-800 px-2 py-1 text-white outline-none"
            @click="toggleChatTabs(2)"
          >
            Logs
          </button>
        </div>

        <div class="h-72">
          <div
            :class="{ hidden: openChatTab !== 1, block: openChatTab === 1 }"
            class="bg-white"
          >
            <div ref="chatArea" class="h-52 overflow-auto p-4">
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
                    'bg-cyan-800 text-white after:border-y-transparent after:border-r-cyan-800 after:border-l-transparent':
                      message.author === 'you',
                    'bg-gray-100 after:border-y-transparent after:border-r-gray-100 after:border-l-transparent':
                      message.author !== 'you',
                  }"
                >
                  {{ message.body }}
                </p>
              </div>
            </div>

            <div class="">
              <div class="flex items-center border-t p-2">
                <div class="mx-2 w-full">
                  <input
                    v-model="bobMessage"
                    style="font-size: 12px"
                    class="w-full rounded-full border border-gray-200 px-2 py-1 outline-none"
                    type="text"
                    placeholder="Aa"
                    autofocus
                  />
                </div>
                <div>
                  <button
                    class="inline-flex rounded-full p-1 hover:bg-indigo-50"
                    type="button"
                    @click="sendMessage('in')"
                  >
                    <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
                  </button>
                </div>
              </div>
              <div class="flex items-center border-t p-2">
                <div class="mx-2 w-full">
                  <input
                    v-model="youMessage"
                    style="font-size: 12px"
                    class="w-full rounded-full border border-gray-200 px-2 py-1 outline-none"
                    type="text"
                    placeholder="Aa"
                    autofocus
                  />
                </div>

                <div>
                  <button
                    class="inline-flex rounded-full p-1 hover:bg-indigo-50"
                    type="button"
                    @click="sendMessage('out')"
                  >
                    <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            :class="{ hidden: openChatTab !== 2, block: openChatTab === 2 }"
            class="h-full overflow-auto bg-white p-3"
          >
            <div v-for="item in 9" :key="item" class="my-2 flex">
              <span
                class="mr-1 inline-block h-4 w-4 rounded-full bg-red-600 p-3"
              ></span>
              <p class="!text-xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore, blanditiis?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div></div>
  </div>
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
