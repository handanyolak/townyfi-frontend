<template>
  <div class="flex h-full flex-col justify-end">
    <div ref="chatArea" class="h-[350px] overflow-y-auto overflow-x-hidden p-4">
      <div
        v-for="(message, index) in chatMessages"
        ref="date"
        :key="index"
        :class="[
          'my-3 flex items-end',
          { 'justify-end': message.author === address },
          { group: isTooltip },
        ]"
      >
        <img
          v-if="message.author !== address"
          class="mr-3 h-8 w-8 rounded-full border border-towny-brown-dark-200"
          :src="makeBlockie(message.author)"
        />

        <div
          :class="[
            'message-box relative z-10 w-60 break-words px-5 py-2 text-xs shadow-lg',
            {
              'rounded-bl-full rounded-tl-full rounded-tr-full bg-towny-brown-dark-300 text-white':
                message.author === address,
              'rounded-br-full rounded-tl-full rounded-tr-full bg-[#a1866b] text-white':
                message.author !== address,
            },
          ]"
        >
          <div class="flex items-center space-x-1">
            <p class="rounded-sm p-0.5 text-xs font-bold italic text-[#6d4c41]">
              {{ message.name }}
            </p>
            <p class="group text-xs italic text-[#6d4c41]">
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
          <span class="float-right text-xs italic text-white">{{
            formattedDate(message.date)
          }}</span>
        </div>
        <img
          v-if="message.author === address"
          class="ml-3 h-8 w-8 rounded-full border border-towny-brown-dark-200"
          :src="makeBlockie(message.author)"
        />
      </div>
    </div>

    <div class="flex items-center border-t border-towny-brown-light-200 p-2">
      <div class="mx-2 w-full">
        <VeeForm class="flex flex-col items-center pt-1">
          <VeeField
            v-model="youMessage"
            name="name"
            autocomplete="off"
            autofocus
            :rules="messageRules"
            placeholder="Hey, @You can send a message here!"
            class="h-8 w-full rounded-lg bg-towny-brown-light-100 px-2 py-1 text-xs shadow-lg shadow-towny-brown-light-500 outline-none transition-all duration-300 ease-out focus:shadow-xl"
            validate-on-input
            @keyup.enter="sendMessage()"
          />
          <VeeErrorMessage
            :class="isChat ? 'apacity-100 delay-200' : 'opacity-0'"
            class="bg-error-red absolute bottom-14 left-1/2 z-10 w-[95%] -translate-x-1/2 rounded-lg p-4 px-2 text-center text-sm font-semibold text-white shadow-lg transition-opacity duration-300 ease-in-out"
            name="name"
          />
        </VeeForm>
      </div>

      <button
        class="inline-flex rounded-full p-1 outline-none transition-all duration-200 ease-in-out hover:scale-110 hover:bg-towny-brown-light-400"
        type="button"
        @click="sendMessage()"
      >
        <Icon
          :name="
            isLoading ? 'svg-spinners:tadpole' : 'mingcute:send-plane-fill'
          "
          class="h-5 w-5 text-towny-brown-dark-300 transition-all duration-200 ease-in-out hover:scale-110"
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

defineProps<{
  isChat?: boolean
}>()

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
