<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Name: </template>
      <span>xxx network</span>
    </ListItem>
    <ListItem>
      <template #title> Chain Id: </template>
      <span>1111</span>
    </ListItem>
    <ListItem>
      <template #title> Symbol: </template>
      <span>ETH</span>
    </ListItem>
    <ListTitle>Explorer URLs</ListTitle>
    <ScrollableList
      :items="[
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
      ]"
      :copy-value="[
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
        'https://example1.com',
      ]"
      copiable
    />
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem>
      <template #title> Current Block Number: </template>
      <span>{{ currentBlockNumber }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'

const userWalletStore = useUserWalletStore()
const { currentBlockNumber } = storeToRefs(userWalletStore)
</script>
