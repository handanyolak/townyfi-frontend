<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Address: </template>
      <span>0Xfslkflsf</span>
    </ListItem>
    <ListItem>
      <template #title> Balance: </template>
      <span>1111</span>
    </ListItem>
    <ListTitle>Miscellaneous</ListTitle>
    <ListItem>
      <template #title> Game Token Balance: </template>
      <span>11109491</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
</script>
