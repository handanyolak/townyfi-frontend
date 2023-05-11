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
      <TownyButton
        v-if="actionable"
        @click="actionValue?.action(copyValue[index], item)"
        >{{ actionValue?.name }}</TownyButton
      >
      <template #tooltip>
        <!-- TODO: change here -->
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

//--------[ Props & Emits ]--------//
interface ScrollableListProps {
  items?: string[]
  copyValue?: string | string[]
  copiable?: boolean
  actionable?: boolean
  actionValue?: {
    name: string
    action: (copyValue: string, item: string) => any
  }
}

withDefaults(defineProps<ScrollableListProps>(), {
  copyValue: '',
})
</script>
