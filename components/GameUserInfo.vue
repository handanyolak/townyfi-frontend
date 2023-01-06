<template>
  <div>
    <ContentTitle>General</ContentTitle>
    <div class="px-3">
      <ContentListItem editable>
        <template #list-title> Name </template>
        <template #list-input>
          <input v-model="name" type="text" />
        </template>
        <span>{{ name }}</span>
      </ContentListItem>
      <ContentListItem>
        <template #list-title> Coordinate </template>
        <span>{{ coordinate }}</span>
      </ContentListItem>
      <ContentListItem>
        <template #list-title> Referrer </template>
        <span>{{ referrer }}</span>
      </ContentListItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContentTitle from '~/components/sidebar-items/ContentTitle.vue'
import ContentListItem from '~/components/sidebar-items/ContentListItem.vue'
const address = ref('0xB55F8FC6de35c643a2Ed462d3316706A4159D41D')

const name = ref('Hadalobo')
const coordinate = ref('(0,1)')

const referrer = computed(
  () =>
    address.value.substring(0, 7) +
    '...' +
    address.value.substring(address.value.length - 5)
)
</script>
