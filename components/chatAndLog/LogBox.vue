<template>
  <div>
    <div v-if="logMessages.length > 0">
      <div
        v-for="(item, index) in logMessages"
        :key="`log-${index}`"
        class="my-2 flex rounded-xl p-2 transition-colors duration-300 ease-out hover:bg-[#dcd0b7]"
      >
        <div class="mr-2 flex flex-col justify-center">
          <span
            class="inline-block h-1 w-1 rounded-full bg-orange-500 p-1"
          ></span>
        </div>
        <div class="flex flex-col">
          <div
            v-for="(line, lineIndex) in splitLogMessage(item)"
            :key="`line-${lineIndex}`"
            class="break-all text-xs"
          >
            {{ line }}
          </div>
        </div>
      </div>
    </div>
    <p
      v-else
      class="my-5 text-center text-lg font-medium text-towny-brown-dark-500"
    >
      No activities yet
    </p>
  </div>
</template>

<script setup lang="ts">
// --------[ Store ]-------- //
const gameChatStore = useGameChatStore()
const { logMessages } = storeToRefs(gameChatStore)

// --------[ Prop & Emit ]-------- //
const emit = defineEmits(['new-log-notification'])

// --------[ Computed ]-------- //

const logCount = computed(() => logMessages.value.length)

// --------[ Method ]-------- //
const splitLogMessage = (message: string) => {
  return message.split('\n')
}

// --------[ Hook ]-------- //
watch(logCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    emit('new-log-notification', true)
  }
})
</script>
