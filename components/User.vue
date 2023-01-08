<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable>
      <template #title> Name: </template>
      <template #input>
        <input v-model="general.name" type="text" />
      </template>
      <span>{{ general.name }}</span>
    </ListItem>
    <ListItem>
      <template #title> Coordinate </template>
      <span>{{ general.coordinate }}</span>
    </ListItem>
    <ListItem>
      <template #title> Level: </template>
      <span>{{ general.level }}</span>
    </ListItem>
    <ListItem>
      <template #title> Exp: </template>
      <span>{{ general.exp }}</span>
    </ListItem>
    <ListItem copiable :copy-value="general.address">
      <template #title> Referrer: </template>
      <span>{{ referrer }}</span>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem>
      <template #title> Health: </template>
      <span>{{ stats.health }}</span>
    </ListItem>
    <ListItem>
      <template #title> Mana: </template>
      <span>{{ stats.mana }}</span>
    </ListItem>
    <ListItem>
      <template #title> Energy: </template>
      <span>{{ stats.energy }}</span>
    </ListItem>
    <ListItem>
      <template #title> Armor: </template>
      <span>{{ stats.armor }}</span>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem>
      <template #title> Attack: </template>
      <span>{{ characterPoints.attack }}</span>
    </ListItem>
    <ListItem>
      <template #title> Defend: </template>
      <span>{{ characterPoints.defind }}</span>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem convertable @convert="convert()">
      <template #title> Health: </template>
      <span>{{ timer.health }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Mana: </template>
      <span>{{ timer.mana }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Energy: </template>
      <span>{{ timer.energy }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Revive: </template>
      <span>{{ timer.revive }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Teleport: </template>
      <span>{{ timer.teleport }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Town TP: </template>
      <span>{{ timer.townTP }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Prepare: </template>
      <span>{{ timer.prepare }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'

const convertTime = ref(24)

const general = reactive({
  name: 'Hadalobo',
  coordinate: '(0,1)',
  level: 4,
  exp: 5,
  address: '0xB55F8FC6de35c643a2Ed462d3316706A4159D41D',
})
const stats = reactive({
  health: 24,
  mana: 54,
  energy: 17,
  armor: 18,
})
const timer = reactive({
  health: 23237438573957,
  mana: 23237438573957,
  energy: 23237438573957,
  revive: 23237438573957,
  teleport: 23237438573957,
  townTP: 23237438573957,
  prepare: 23237438573957,
})
const characterPoints = reactive({
  attack: 3,
  defind: 1,
})

const referrer = computed(
  () =>
    general.address.substring(0, 5) +
    '...' +
    general.address.substring(general.address.length - 5)
)

const convert = () => {
  timer.health = convertTime.value
}
</script>
