<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Name: </template>
      <span>Townyfi</span>
    </ListItem>
    <ListItem>
      <template #title> Referrer: </template>
      <span>0Xdjkfnkdjfn</span>
    </ListItem>
    <ListItem>
      <template #title> Symbol: </template>
      <span>ETH</span>
    </ListItem>
    <ListTitle>View on X Explorer</ListTitle>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
</script>
