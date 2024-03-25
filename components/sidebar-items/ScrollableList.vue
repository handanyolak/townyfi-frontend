<template>
  <div class="max-h-32 overflow-y-auto overflow-x-hidden">
    <ListItem
      v-for="(item, index) in items"
      :key="index"
      :copiable="copiable"
      :copy-value="copyValue[index]"
    >
      <span v-if="linkable">
        <a :href="item" target="_blank" class="flex items-center justify-center"
          >{{ item }}
          <img src="@/assets/img/link-external.svg" class="ml-1 h-3 w-3" />
        </a>
      </span>
      <span v-else>{{ item }}</span>
      <template #action>
        <AppButton
          v-if="actionable"
          basic-hover
          class="w-[120px]"
          @click="actionValue?.action(copyValue[index], item)"
          >{{ actionValue?.name }}
        </AppButton>
      </template>
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
import ListItem from '~/components/common/ListItem.vue'

// --------[ Props & Emits ]-------- //
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
  // @ts-expect-error
  items: [], // eslint-disable-line vue/require-valid-default-prop
  copyValue: '',
})
</script>
