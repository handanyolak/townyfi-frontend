<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable>
      <template #title> Name: </template>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
      </template>
      <span>{{ name }}</span>
    </ListItem>
    <ListItem>
      <template #title> Coordinate </template>
      <span>({{ townInfo.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ townInfo.coordinate._y.toString() }})</span>
    </ListItem>
    <ListItem>
      <template #title> Level: </template>
      <span>{{ townInfo.levelId }}</span>
    </ListItem>
    <ListItem>
      <template #title> Exp: </template>
      <span>{{ townInfo.exp }}</span>
    </ListItem>
    <ListItem copiable :copy-value="townInfo.leader">
      <template #title> Leader: </template>
      <span>{{ leader }}</span>
    </ListItem>
    <ListItem>
      <template #title> Status: </template>
      <span>{{ townInfo.status }}</span>
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
      <span>{{ townInfo.protectionAt.toString() }}</span>
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
import { ethers } from 'ethers'
import * as yup from 'yup'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'

const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)
const name = ref(ethers.utils.parseBytes32String(user.value.name as any))
const nameRules = yup.string().bytes32()
const kta = useKta()
const townInfo = {
  ...(await kta.townById(user.value.townInfo.townId.toString())),
}

const addresses = ref([
  '0xB55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xC55F8FC6de37c643a2Ed462d3316706A4159D41D',
  '0xD55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xE55F8FC6de35c643a2Ed462d3316706A4159D41D',
  '0xF55F8FC6de35c643a2Ed462d3316706A4159D41D',
])

const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

const leader = computed(() => middleCropping(townInfo.leader))

const citizenAddresses = computed(() =>
  addresses.value.map((address) => middleCropping(address))
)
</script>
