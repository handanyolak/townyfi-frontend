<template>
  <div>
    <div ref="chatArea" class="h-56 overflow-auto p-4">
      <div
        v-for="(message, index) in chatMessages"
        ref="date"
        :key="index"
        :class="[
          'relative my-1 flex items-end',
          { 'justify-end': message.author === address },
        ]"
      >
        <img
          v-if="message.author !== address"
          class="mr-1 h-8 w-8 rounded-full"
          :src="makeBlockie(message.author)"
        />
        <div
          :class="[
            'message-box relative z-10  min-w-14 p-1 text-xs',
            {
              'rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-towni-brown-dark-300 text-white':
                message.author === address,
              'rounded-br-lg rounded-tl-lg rounded-tr-lg bg-towni-brown-light-200':
                message.author !== address,
            },
          ]"
        >
          <p class="rounded-sm p-0.5 text-xs italic text-yellow-400">
            {{ message.name }}
          </p>
          <p class="mb-1 text-sm font-semibold">{{ message.body }}</p>
          <span class="float-right ml-10 text-[10px] italic">{{
            formattedDate(message.date)
          }}</span>
        </div>
        <img
          v-if="message.author === address"
          class="ml-1 h-8 w-8 rounded-full"
          :src="makeBlockie(message.author)"
        />
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
          @keyup.enter="sendMessagee()"
        />
      </div>

      <div>
        <button
          class="inline-flex rounded-full p-1 outline-none hover:bg-towni-brown-light-400"
          type="button"
          @click="sendMessagee()"
        >
          <img class="h-5 w-7" src="@/assets/img/send-alt.svg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stringToHex } from 'viem'
import { ref, nextTick } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import { formattedDate } from '~/utils/helper'

const contractStore = useContractStore()
const { getKtaGameChatCaller } = storeToRefs(contractStore)

const gameChatStore = useGameChatStore()
const { chatMessages } = storeToRefs(gameChatStore)

const userWalletStore = useUserWalletStore()
const { address } = storeToRefs(userWalletStore)

const youMessage = ref('')
const chatArea = ref<HTMLInputElement | null>(null)
// --------[ Method ]-------- //
const sendMessagee = async () => {
  if (youMessage.value.trim() !== '') {
    await getKtaGameChatCaller.value.callFunction({
      type: 'write',
      name: 'sendMessage',
      args: [[stringToHex(youMessage.value, { size: 32 })]],
    })

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
