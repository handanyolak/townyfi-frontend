<template>
  <TheLoading v-if="isDataLoading" />
  <div v-else class="p-5">
    <ListTitle>General</ListTitle>
    <ListItem title="Name:" tooltip>
      <span>{{ userName }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Coordinate:" tooltip>
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
    <ListItem title="Level:" tooltip>
      <span>{{ user.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Exp:" tooltip>
      <span>{{ user.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Referrer:" copiable tooltip :copy-value="referrerAddress">
      <span>{{ referrer }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Stats</ListTitle>
    <ListItem title="Health:" tooltip>
      <span>{{ user.health }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Mana:" tooltip>
      <span>{{ user.mana }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Energy:" tooltip>
      <span>{{ user.energy }}</span>
    </ListItem>
    <ListItem title="Armor:" tooltip>
      <span>{{ user.armor }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Character Points</ListTitle>
    <ListItem title="Attack:" tooltip>
      <span>{{ user.charPoint.attack }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Defend:" tooltip>
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
      :title="`${toCapitalizedWords(item)}:`"
      :item="item"
      convertable
      tooltip
      @convert="(isConvert) => convert(isConvert, item as any)"
    >
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
    <ListTitle class="py-5">Town Info</ListTitle>
    <OtherTown v-if="townId" :id="townId" />
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { type Address, hexToString } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import TheLoading from '~/components/common/TheLoading.vue'
import OtherTown from '~/components/OtherTown.vue'
import { toCapitalizedWords, middleCropping } from '~/utils'
import { transformUser } from '~/transformers'
import type { UserTimer } from '~/types'

const {
  public: { chainBlockTime },
} = useRuntimeConfig()

// --------[ Props & Emits ]-------- //
interface UserProps {
  address: Address
}
const props = defineProps<UserProps>()

// --------[ Stores ]-------- //
const userGameStore = useUserGameStore()
const contractStore = useContractStore()
const userWalletStore = useUserWalletStore()

const { getKta } = storeToRefs(contractStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

// --------[ Data ]-------- //
const user = ref(userGameStore.user)
const townId = ref(0n)
const timer = ref<any>(user.value.timer)
const isDataLoading = ref(false)
const timers = ref(
  Object.keys(user.value.timer).filter((item: any) => isNaN(item)),
)
const referrerAddress = user.value.referrer as string

// --------[ Computed ]-------- //
const userName = computed(() => hexToString(user.value.name, { size: 32 }))
const referrer = computed(() => middleCropping(referrerAddress))

// --------[ Hooks ]-------- //
onMounted(async () => {
  isDataLoading.value = true
  user.value = transformUser(
    await getKta.value.read.userByAddr([props.address]),
  )
  townId.value = user.value.townInfo.townId
  timer.value = { ...user.value.timer }
  timers.value = Object.keys(timer.value).filter((item: any) => isNaN(item))
  isDataLoading.value = false
})

// --------[ Methods ]-------- //
const convert = (isConvert: boolean, propertyName: keyof UserTimer) => {
  if (isConvert) {
    timer.value[propertyName] =
      BigInt(timer.value[propertyName]) - currentBlockNumber.value > 0
        ? moment // eslint-disable-line import/no-named-as-default-member
            .duration(
              (timer.value[propertyName] - Number(currentBlockNumber.value)) *
                chainBlockTime *
                1000,
            )
            .humanize()
        : 0
  } else {
    timer.value[propertyName] = user.value.timer[propertyName].toString()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
