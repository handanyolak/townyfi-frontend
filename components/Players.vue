<template>
  <ul v-if="players.length > 0" class="flex flex-col space-y-1">
    <li
      v-for="_player in players"
      :key="_player"
      class="my-0.5 cursor-pointer text-sm text-blue-600 md:text-xl"
      @click="goToPageWithQuery(_player)"
    >
      {{ _player }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
const bingoStore = useBingoStore()
const { players } = storeToRefs(bingoStore)
const goToPageWithQuery = useGameNavigation()
</script>
