<template>
  <div class="h-24 overflow-y-auto overflow-x-hidden">
    <ListItem
      v-for="(citizenAddress, index) in props.citizenAddresses"
      :key="index"
      class="h-5"
      :copiable="copiable"
      :copy-value="copyValue[index]"
    >
      <span>{{ citizenAddress }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
interface ScrollableListProps {
  citizenAddresses?: string[]
  copyValue?: string | string[]
  copiable?: boolean
}

const props = defineProps<ScrollableListProps>()
</script>

<style scoped>
div::-webkit-scrollbar-thumb {
  background-color: #c57b34;
  border: 4px solid transparent;
  border-radius: 8px;
  background-clip: padding-box;
}

div::-webkit-scrollbar {
  width: 12px;
  background: #e6c3a2;
  border-radius: 5px;
}
</style>
