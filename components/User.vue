<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable>
      <template #title> Name: </template>
      <template #input>
        <div class="relative">
          <input v-model="stringName" type="text" @keyup="maxString()" />
          <div
            :class="[
              'absolute w-full bg-towni-brown-dark-500 text-[11px] transition-all duration-1000 ease-in-out',
              nameError ? 'max-h-10' : 'max-h-0',
            ]"
          >
            {{ nameError }}
          </div>
        </div>
      </template>
      <span>{{ ethers.utils.parseBytes32String(user.name as any) }}</span>
    </ListItem>
    <ListItem>
      <template #title> Coordinate </template>
      <span>({{ user.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ user.coordinate._y.toString() }})</span>
    </ListItem>
    <ListItem>
      <template #title> Level: </template>
      <span>{{ user.levelId }}</span>
    </ListItem>
    <ListItem>
      <template #title> Exp: </template>
      <span>{{ user.exp }}</span>
    </ListItem>
    <ListItem copiable :copy-value="reffererAddress">
      <template #title> Referrer: </template>
      <span>{{ referrer }}</span>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem>
      <template #title> Health: </template>
      <span>{{ user.health }}</span>
    </ListItem>
    <ListItem>
      <template #title> Mana: </template>
      <span>{{ user.mana }}</span>
    </ListItem>
    <ListItem>
      <template #title> Energy: </template>
      <span>{{ user.energy }}</span>
    </ListItem>
    <ListItem>
      <template #title> Armor: </template>
      <span>{{ user.armor }}</span>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem>
      <template #title> Attack: </template>
      <span>{{ user.charPoint.attack }}</span>
    </ListItem>
    <ListItem>
      <template #title> Defend: </template>
      <span>{{ user.charPoint.defend }}</span>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem
      v-for="(item, index) in timers"
      :key="index"
      convertable
      @convert="(isConvert) => convert(isConvert, item as any)"
    >
      <template #title> {{ toCapitalizedWords(item) }}: </template>
      <span>{{
        timer[item].toString() === '0' ? 'Available!' : timer[item].toString()
      }}</span>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { duration } from 'moment'
import { ethers } from 'ethers'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { IKillThemAll } from '~/types/typechain/contracts/game/KillThemAll'

const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()
const { user } = storeToRefs(userGameStore)
const timer = reactive<any>({ ...user.value.timer })
const timers = Object.keys(user.value.timer).filter((item: any) => isNaN(item))
const stringName = ref(ethers.utils.parseBytes32String(user.value.name as any))
const nameError = ref('')
const reffererAddress = user.value.referrer as string

const referrer = computed(
  () =>
    reffererAddress.substring(0, 5) +
    '...' +
    reffererAddress.substring(reffererAddress.length - 5)
)

const maxString = () => {
  try {
    ethers.utils.formatBytes32String(stringName.value)
    nameError.value = ''
  } catch (error) {
    nameError.value = 'Name must be less than 32 bytes'
  }
}

const toCapitalizedWords = (name: string) => {
  const words = name.match(/[A-Za-z][a-z]*/g) || []

  return words.map(capitalize).join(' ')
}

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.substring(1)

const convert = (
  isConvert: boolean,
  propertyName: keyof IKillThemAll.UserTimerStruct
) => {
  if (isConvert) {
    timer[propertyName] =
      timer[propertyName] - userWalletStore.currentBlockNumber > 0
        ? duration(
            (timer[propertyName] - userWalletStore.currentBlockNumber) *
              12 *
              1000
          ).humanize()
        : 0
  } else {
    timer[propertyName] = user.value.timer[propertyName].toString()
  }
}
</script>
