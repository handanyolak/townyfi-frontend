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
    <ListItem copiable :copy-value="general.leaderAddress">
      <template #title> Leader: </template>
      <span>{{ leader }}</span>
    </ListItem>
    <ListItem>
      <template #title> Status: </template>
      <span>{{ general.status }}</span>
    </ListItem>
    <ListTitle>Citizens</ListTitle>
    <ScrollableList
      :items="citizenAddresses"
      :copy-value="addresses"
      copiable
    />
    <ListTitle>Timers</ListTitle>
    <ListItem>
      <template #title> Protection: </template>
      <span>{{ protection }}</span>
    </ListItem>
    <ListTitle>War</ListTitle>
    <ListItem>
      <template #title> Attacker: </template>
      <span>{{ attacker }}</span>
    </ListItem>
    <ListItem>
      <template #title> Defender: </template>
      <span>{{ defender }}</span>
    </ListItem>
    <ListItem>
      <template #title> Attackable: </template>
      <span>{{ attackable }}</span>
    </ListItem>
    <ListItem>
      <template #title> Expired: </template>
      <span>{{ expired }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'

const general = reactive({
  name: 'Hadalobo',
  coordinate: '(0,1)',
  level: 4,
  exp: 5,
  leaderAddress: '0xB55F8FC6de35c643a2Ed462d3316706A4159D41D',
  status: 'Settle',
})

const addresses = ref([
  '0xB55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xC55F8FC6de37c643a2Ed462d3316706A4159D41D',
  '0xD55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xE55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xF55F8FC6de35c643a2Ed462d3316706A4159D41D',
])

const protection = ref(3743879)
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

const leader = computed(
  () =>
    general.leaderAddress.substring(0, 5) +
    '...' +
    general.leaderAddress.substring(general.leaderAddress.length - 5)
)

const citizenAddresses = computed(() =>
  addresses.value.map(
    (address) =>
      address.substring(0, 5) + '...' + address.substring(address.length - 5)
  )
)
</script>
