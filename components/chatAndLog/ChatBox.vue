<template>
  <div>
    <div ref="chatArea" class="h-56 overflow-auto p-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['relative flex', { 'justify-end': message.author === 'you' }]"
      >
        <img
          v-if="message.author !== 'you'"
          class="mr-4 h-5 w-5 rounded-full"
          src="@/assets/img/soldier.svg"
        />
        <p
          :class="[
            'message-box relative z-10 my-2 inline-block rounded-[10px] p-2 text-xs',
            {
              'bg-towni-brown-dark-300 text-white after:absolute after:-right-4 after:-z-10 after:origin-top-left after:skew-x-[-65deg] after:rounded-l-sm after:rounded-r-xl after:border-b-[14px] after:border-l-[32px] after:border-y-transparent after:border-l-towni-brown-dark-300 after:border-r-transparent':
                message.author === 'you',
              'bg-towni-brown-light-200 after:absolute after:-left-4 after:-z-10 after:origin-top-right after:skew-x-65 after:rounded-l-xl after:rounded-r-sm after:border-b-[14px] after:border-r-[32px] after:border-y-transparent after:border-l-transparent after:border-r-towni-brown-light-200':
                message.author !== 'you',
            },
          ]"
        >
          {{ message.body }}
        </p>
      </div>
    </div>

    <div
      class="flex h-16 items-center border-t border-towni-brown-light-200 p-2"
    >
      <div class="mx-2 w-full">
        <input
          v-model="youMessage"
          class="bg-towni-brown-light-4000 w-full rounded-lg px-2 py-1 text-xs shadow-lg shadow-towni-brown-light-500 outline-none transition-all duration-300 ease-out focus:shadow-xl"
          type="text"
          placeholder="Your message here..."
          autofocus
          @keyup.enter="sendMessage()"
        />
      </div>

      <div>
        <button
          class="inline-flex rounded-full p-1 outline-none hover:bg-towni-brown-light-400"
          type="button"
          @click="sendMessage()"
        >
          <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const youMessage = ref('')
const chatArea = ref<HTMLInputElement | null>(null)
const messages = ref([
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
])

const sendMessage = () => {
  if (youMessage.value.trim() !== '') {
    messages.value.push({ body: youMessage.value, author: 'you' })
    youMessage.value = ''
    nextTick(() => {
      if (chatArea.value) {
        chatArea.value.scrollTo({
          top: chatArea.value.scrollHeight,
          behavior: 'smooth',
        })
      }
    })
  }
}
</script>
