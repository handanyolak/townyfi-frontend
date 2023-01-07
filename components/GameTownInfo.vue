<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable>
      <template #list-title> Name </template>
      <template #list-input>
        <input v-model="general.name" type="text" />
      </template>
      <span>{{ general.name }}</span>
    </ListItem>
    <ListItem>
      <template #list-title> Coordinate </template>
      <span>{{ general.coordinate }}</span>
    </ListItem>
    <ListItem>
      <template #list-title> Level </template>
      <span>{{ general.level }}</span>
    </ListItem>
    <ListItem>
      <template #list-title> Exp </template>
      <span>{{ general.exp }}</span>
    </ListItem>
    <ListItem copiable :copy-value="general.leaderAddress">
      <template #list-title> Leader </template>
      <span>{{ leader }}</span>
    </ListItem>
    <ListItem>
      <template #list-title> Status </template>
      <span>{{ general.status }}</span>
    </ListItem>
    <ListTitle>Citizens</ListTitle>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'

const general = reactive({
  name: 'Hadalobo',
  coordinate: '(0,1)',
  level: 4,
  exp: 5,
  leaderAddress: '0xB55F8FC6de35c643a2Ed462d3316706A4159D41D',
  status: 'Settle',
})

const leader = computed(
  () =>
    general.leaderAddress.substring(0, 5) +
    '...' +
    general.leaderAddress.substring(general.leaderAddress.length - 5)
)
</script>
