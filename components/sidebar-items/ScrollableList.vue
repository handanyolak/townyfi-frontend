<template>
  <div class="max-h-32 overflow-y-auto overflow-x-hidden">
    <ListItem
      v-for="(item, index) in items"
      :key="index"
      :copiable="copiable"
      :copy-value="copyValue[index]"
      tooltip
    >
      <span>{{ item }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/sidebar-items/ListItem.vue'

interface ScrollableListProps {
  items?: string[]
  copyValue?: string | string[]
  copiable?: boolean
}

withDefaults(defineProps<ScrollableListProps>(), {
  copyValue: '',
})
</script>
