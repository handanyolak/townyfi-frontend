<template>
  <div>
    <div class="fixed bottom-0 right-1">
      <div
        class="flex flex-col w-56 transition-all duration-700 ease"
        :class="isChat ? 'max-h-96' : 'max-h-10'"
      >
        <div
          class="flex items-center justify-end h-10 p-2 bg-white border border-b shadow-md rounded-t-2xl"
        >
          <button
            class="inline-flex p-2 border-none rounded-full outline-none hover:bg-indigo-50"
            type="button"
            @click="showChat()"
          >
            <img
              class="w-3 h-3 transition-all duration-700 ease"
              :class="isChat ? 'rotate-180' : ''"
              src="@/assets/img/up-arrow.svg"
            />
          </button>
        </div>

        <div class="bg-white">
          <div ref="chatArea" class="p-4 overflow-auto h-52">
            <div
              v-for="message in messages"
              :key="message"
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
    const messageDisplay = chatArea.value
    messageDisplay.scrollTop = messageDisplay.scrollHeight
  })
}

/* const clearAllMessages = () => {
  messages = []
} */
const showChat = () => {
  isChat.value = !isChat.value
}
</script>
