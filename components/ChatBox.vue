<template>
  <div>
    <div class="fixed bottom-0 right-1">
      <div
        class="flex flex-col w-56 transition-all duration-700 ease"
        :class="isChat ? 'max-h-96' : 'max-h-10'"
      >
        <div
          class="grid w-full h-10 grid-cols-2 p-2 bg-white border border-b shadow-md gap-x-1 rounded-t-2xl"
        >
          <button
            class="px-2 py-1 text-white bg-yellow-800 outline-none rounded-t-xl"
            @click="toggleChatTabs(1)"
          >
            Chat Box
          </button>
          <button
            class="px-2 py-1 text-white bg-yellow-800 outline-none rounded-t-xl"
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
            <div ref="chatArea" class="p-4 overflow-auto h-52">
              <div
                v-for="(message, index) in messages"
                :key="index"
                class="relative flex items-center"
              >
                <img
                  class="w-5 h-5 mr-4 rounded-full"
                  src="@/assets/img/soldier.svg"
                />
                <p
                  style="font-size: 12px"
                  class="relative inline-block after:origin-top-right p-2 z-10 after:rounded-l-xl after:rounded-r-sm my-2 rounded-[10px] after:-left-4 after:absolute after:-z-10 after:border-r-[32px] after:border-b-[14px] after:skew-x-65 message-box"
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
              <div class="flex items-center p-2 border-t">
                <div class="w-full mx-2">
                  <input
                    v-model="bobMessage"
                    style="font-size: 12px"
                    class="w-full px-2 py-1 border border-gray-200 rounded-full outline-none"
                    type="text"
                    placeholder="Aa"
                    autofocus
                  />
                </div>
                <div>
                  <button
                    class="inline-flex p-1 rounded-full hover:bg-indigo-50"
                    type="button"
                    @click="sendMessage('in')"
                  >
                    <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
                  </button>
                </div>
              </div>
              <div class="flex items-center p-2 border-t">
                <div class="w-full mx-2">
                  <input
                    v-model="youMessage"
                    style="font-size: 12px"
                    class="w-full px-2 py-1 border border-gray-200 rounded-full outline-none"
                    type="text"
                    placeholder="Aa"
                    autofocus
                  />
                </div>

                <div>
                  <button
                    class="inline-flex p-1 rounded-full hover:bg-indigo-50"
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
            class="h-full p-3 overflow-auto bg-white"
          >
            <div v-for="item in 9" :key="item" class="flex my-2">
              <span
                class="inline-block w-4 h-4 p-3 mr-1 bg-red-600 rounded-full"
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
