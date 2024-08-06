<template>
  <div>
    <div ref="chatArea" class="h-56 overflow-y-auto overflow-x-hidden p-4">
      <div
        v-for="(message, index) in chatMessages"
        ref="date"
        :key="index"
        :class="[
          'my-2 flex items-end',
          { 'justify-end': message.author === address },
          { group: isTooltip },
        ]"
      >
        <img
          v-if="message.author !== address"
          class="mr-1 h-8 w-8 rounded-full border border-towny-brown-dark-200"
          :src="makeBlockie(message.author)"
        />

        <div
          :class="[
            'message-box relative z-10 min-w-14 break-words p-1 text-xs',
            {
              'rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-towny-brown-dark-300 text-white':
                message.author === address,
              'rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#a1866b] text-white':
                message.author !== address,
            },
          ]"
        >
          <div class="flex items-center space-x-1">
            <p class="rounded-sm p-0.5 text-xs italic text-[#ffe186]">
              {{ message.name }}
            </p>
            <p class="group text-xs italic text-[#ffe186]">
              <span> {{ `(${middleCropping(message.author)})` }}</span>
              <Tooltip
                :icon-name="copied ? 'uil:check-circle' : 'uil:copy'"
                icon-classes="text-yellow-400"
                auto-close
                @action="copied || copy(message.author)"
              >
                <span> Copied! </span>
              </Tooltip>
            </p>
          </div>
          <p class="mb-1 text-sm font-semibold">
            <span v-html="message.body" />
          </p>
          <span class="float-right text-[10px] italic">{{
            formattedDate(message.date)
          }}</span>
        </div>
        <img
          v-if="message.author === address"
          class="ml-1 h-8 w-8 rounded-full border border-towny-brown-dark-200"
          :src="makeBlockie(message.author)"
        />
      </div>
    </div>

    <div
      class="flex h-20 items-start border-t border-towny-brown-light-200 p-2"
    >
      <div class="mx-2 w-full">
        <VeeForm class="flex flex-col items-center pt-1">
          <VeeField
            v-model="youMessage"
            name="name"
            autocomplete="off"
            autofocus
            :rules="messageRules"
            placeholder="Your message here..."
            class="bg-towny-brown-light-4000 w-full rounded-lg px-2 py-1 text-xs shadow-lg shadow-towny-brown-light-500 outline-none transition-all duration-300 ease-out focus:shadow-xl"
            @keyup.enter="sendMessage()"
          />
          <VeeErrorMessage class="text-xs text-red-600" name="name" />
        </VeeForm>
      </div>

      <button
        class="inline-flex rounded-full p-1 outline-none hover:bg-towny-brown-light-400"
        type="button"
        @click="sendMessage()"
      >
        <Icon
          :name="
            isLoading ? 'svg-spinners:tadpole' : 'mingcute:send-plane-fill'
          "
          class="h-5 w-5 text-towny-brown-dark-300"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stringToHex } from 'viem'
import { ref, nextTick } from 'vue'
import makeBlockie from 'ethereum-blockies-base64'
import { useClipboard, useDateFormat, useNavigatorLanguage } from '@vueuse/core'
import { getBytes32Rule } from '~/composables/useYupRules'
import { middleCropping } from '~/utils'
import Tooltip from '~/components/common/Tooltip.vue'

const contractStore = useContractStore()
const { getKtaGameChatCaller } = storeToRefs(contractStore)

const gameChatStore = useGameChatStore()
const { chatMessages } = storeToRefs(gameChatStore)

const userWalletStore = useUserWalletStore()
const { address } = storeToRefs(userWalletStore)

// --------[ Data ]-------- //
const youMessage = ref('')
const chatArea = ref<HTMLInputElement | null>(null)
const isTooltip = ref(false)
const isLoading = ref(false)
const { language } = useNavigatorLanguage()
const messageRules = getBytes32Rule()
const { copy, copied } = useClipboard({
  legacy: true,
})

// --------[ Computed ]-------- //
const formattedDate = computed(() => (date: Date) => {
  const formatDate = useDateFormat(date, 'YYYY-MM-DD HH:mm', {
    locales: language.value,
  })
  return formatDate.value
})

// --------[ Method ]-------- //
const sendMessage = async () => {
  isLoading.value = true
  try {
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
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
