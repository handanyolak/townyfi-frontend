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
    <div v-else class="text-center text-sm text-towni-brown-dark-300">
      No activities yet
    </div>
  </div>
</template>

<script setup lang="ts">
const gameChatStore = useGameChatStore()
const { logMessages } = storeToRefs(gameChatStore)

const splitLogMessage = (message: string) => {
  return message.split('\n')
}
</script>
