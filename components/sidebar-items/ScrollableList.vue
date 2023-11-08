<template>
  <div class="max-h-32 overflow-y-auto overflow-x-hidden">
    <ListItem v-for="(item, index) in items" :key="index" :copiable="copiable" :copy-value="copyValue[index]">
      <span v-if="linkable">
        <a :href="item" target="_blank" class="flex justify-center items-center">{{ item }}
          <img src="@/assets/img/link-external.svg" class="h-3 w-3 ml-1">
        </a>
      </span>
      <span v-else>{{ item }}</span>
      <AppButton v-if="actionable" @click="actionValue?.action(copyValue[index], item)">{{ actionValue?.name }}
      </AppButton>
      <template #tooltip>
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span>
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
  linkable?: boolean
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
