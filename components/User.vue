<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable>
      <template #title> Name: </template>
      <template #input>
        <input v-model="userName" type="text" />
      </template>
      <span>{{ userName }}</span>
    </ListItem>
    <ListItem>
      <template #title> Coordinate </template>
      <span>({{ userGameStore.user.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ userGameStore.user.coordinate._y.toString() }})</span>
    </ListItem>
    <ListItem>
      <template #title> Level: </template>
      <span>{{ userGameStore.user.levelId }}</span>
    </ListItem>
    <ListItem>
      <template #title> Exp: </template>
      <span>{{ userGameStore.user.exp }}</span>
    </ListItem>
    <ListItem copiable :copy-value="reffererAddress">
      <template #title> Referrer: </template>
      <span>{{ referrer }}</span>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem>
      <template #title> Health: </template>
      <span>{{ userGameStore.user.health }}</span>
    </ListItem>
    <ListItem>
      <template #title> Mana: </template>
      <span>{{ userGameStore.user.mana }}</span>
    </ListItem>
    <ListItem>
      <template #title> Energy: </template>
      <span>{{ userGameStore.user.energy }}</span>
    </ListItem>
    <ListItem>
      <template #title> Armor: </template>
      <span>{{ userGameStore.user.armor }}</span>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem>
      <template #title> Attack: </template>
      <span>{{ userGameStore.user.charPoint.attack }}</span>
    </ListItem>
    <ListItem>
      <template #title> Defend: </template>
      <span>{{ userGameStore.user.charPoint.defend }}</span>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem convertable @convert="convert()">
      <template #title> Health: </template>
      <span>{{ userGameStore.user.timer.getHealth.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Mana: </template>
      <span>{{ userGameStore.user.timer.getMana.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Energy: </template>
      <span>{{ userGameStore.user.timer.getEnergy.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Revive: </template>
      <span>{{ userGameStore.user.timer.revive.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Teleport: </template>
      <span>{{ userGameStore.user.timer.teleport.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Town TP: </template>
      <span>{{ userGameStore.user.timer.teleportToTown.toString() }}</span>
    </ListItem>
    <ListItem convertable @convert="convert()">
      <template #title> Prepare: </template>
      <span>{{ userGameStore.user.timer.prepareToAttack.toString() }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'

const convertTime = ref(24)

const userGameStore = useUserGameStore()

const userName = computed(() =>
  userGameStore.user.name ===
  '0x0000000000000000000000000000000000000000000000000000000000000000'
    ? 'user'
    : userGameStore.user.name
)

console.log(userGameStore.user)

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

const reffererAddress = userGameStore.user.referrer as string
const referrer = computed(
  () =>
    reffererAddress.substring(0, 5) +
    '...' +
    reffererAddress.substring(reffererAddress.length - 5)
)

const convert = () => {
  timer.health = convertTime.value
}
</script>
