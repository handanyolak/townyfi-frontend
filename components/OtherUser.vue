<template>
  <div class="mt-6">
    <ListTitle>General</ListTitle>
    <ListItem tooltip>
      <template #title> Name: </template>
      <span>{{ userName }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Coordinate: </template>
      <span>({{ user.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ user.coordinate._y.toString() }})</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Level: </template>
      <span>{{ user.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Exp: </template>
      <span>{{ user.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem copiable tooltip :copy-value="reffererAddress">
      <template #title> Referrer: </template>
      <span>{{ referrer }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem tooltip>
      <template #title> Health: </template>
      <span>{{ user.health }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Mana: </template>
      <span>{{ user.mana }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Energy: </template>
      <span>{{ user.energy }}</span>
    </ListItem>
    <ListItem tooltip>
      <template #title> Armor: </template>
      <span>{{ user.armor }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem tooltip>
      <template #title> Attack: </template>
      <span>{{ user.charPoint.attack }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Defend: </template>
      <span>{{ user.charPoint.defend }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Timers</ListTitle>
    <ListItem
      v-for="(item, index) in timers"
      :key="index"
      convertable
      tooltip
      @convert="(isConvert) => convert(isConvert, item as any)"
    >
      <template #title> {{ toCapitalizedWords(item) }}: </template>
      <span>{{
        timer[item].toString() === '0' ? 'Available!' : timer[item].toString()
      }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <OtherTown v-if="user.townInfo.townId" :id="user.townInfo.townId" />
  </div>
</template>

<script setup lang="ts">
import { duration } from 'moment'
import { decodeBytes32String } from 'ethers'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { IKillThemAll } from '~/types/typechain/KillThemAll'
import { toCapitalizedWords, middleCropping } from '~/utils'

const connectionStore = useConnectionStore()
const { getKta } = storeToRefs(connectionStore)

const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()
// TODO: Buraya bos deger koyunca template'de hata ciktigi icin burayi onmounted'ta eziyoruz.
const user = ref(userGameStore.user)
const timer = reactive<any>({ ...user.value.timer })
const timers = Object.keys(user.value.timer).filter((item: any) => isNaN(item))

interface UserProps {
  address: string
}
const props = defineProps<UserProps>()

onMounted(async () => {
  user.value = { ...(await getKta.value.userByAddr(props.address)) }
})

const userName = computed(() => decodeBytes32String(user.value.name as any))

const reffererAddress = user.value.referrer as string
const referrer = computed(() => middleCropping(reffererAddress))

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
