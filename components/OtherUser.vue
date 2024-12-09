<template>
  <TheLoading v-if="isDataLoading" />
  <div v-else class="p-1 md:p-5">
    <div class="mx-3 md:mx-5">
      <ListTitle class="my-8">General</ListTitle>
      <ListItem title="Name:">
        <span>{{ userName }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem
        title="Coordinate:"
        searchable
        :search-options="{
          searchType: SearchType.Town,
          findBy: FindOptions.Coordinate,
          findInputText: `${user.coordinate._x.toString()},${user.coordinate._y.toString()}`,
        }"
      >
        <span
          >({{ user.coordinate._x.toString() }},{{
            user.coordinate._y.toString()
          }})</span
        >
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem title="Level:">
        <span>{{ user.levelId }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem title="Exp:">
        <span>{{ user.exp }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem
        title="Referrer:"
        copiable
        :copy-value="referrerAddress"
        searchable
        :search-options="{
          searchType: SearchType.User,
          findBy: FindOptions.Address,
          findInputText: referrerAddress,
        }"
      >
        <span>{{ referrer }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListTitle class="my-8">Stats</ListTitle>
      <ListItem title="Health:">
        <span>{{ user.health }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem title="Mana:">
        <span>{{ user.mana }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem title="Energy:">
        <span>{{ user.energy }}</span>
      </ListItem>
      <ListItem title="Armor:">
        <span>{{ user.armor }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListTitle class="my-8">Character Points</ListTitle>
      <ListItem title="Attack:">
        <span>{{ user.charPoint.attack }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListItem title="Defend:">
        <span>{{ user.charPoint.defend }}</span>
        <template #tooltip>
          <span
            >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
            amet.</span
          >
        </template>
      </ListItem>
      <ListTitle class="my-8">Timers</ListTitle>
      <ListItem
        v-for="(item, index) in timers"
        :key="index"
        :title="`${toCapitalizedWords(item)}:`"
        :item="item"
        convertable
        @convert="(isConvert) => convert(isConvert, item)"
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
    </div>
    <div v-if="townId">
      <ListTitle
        class="mx-1 mb-10 mt-20 p-4 shadow-lg shadow-towny-brown-dark-400"
        >Town Info</ListTitle
      >
      <OtherTown :id="townId" class="mx-3 md:mx-5" />
    </div>
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
import { SearchType, FindOptions } from '~/enums'

const {
  public: { chainBlockTime },
} = useRuntimeConfig()

// --------[ Prop & Emit ]-------- //
interface UserProps {
  address: Address
}
const props = defineProps<UserProps>()

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const contractStore = useContractStore()
const userWalletStore = useUserWalletStore()

const { getKtaPublic } = storeToRefs(contractStore)
const { currentBlockNumber } = storeToRefs(userWalletStore)

// --------[ Data ]-------- //
const user = ref(userGameStore.user)
const townId = ref(0n)
const isDataLoading = ref(false)
const timer = reactive<any>({ ...user.value.timer })
const timers = ref(Object.keys(timer) as (keyof UserTimer)[])

const referrerAddress = user.value.referrer as string

// --------[ Computed ]-------- //
const userName = computed(() => hexToString(user.value.name, { size: 32 }))
const referrer = computed(() => middleCropping(referrerAddress))

// --------[ Hook ]-------- //
onMounted(async () => {
  isDataLoading.value = true
  user.value = transformUser(
    await getKtaPublic.value.read.userByAddr([props.address]),
  )
  townId.value = user.value.townInfo.townId
  timer.value = { ...user.value.timer }
  timers.value = Object.keys(timer.value) as (keyof UserTimer)[]
  isDataLoading.value = false
})

// --------[ Method ]-------- //
const convert = (isConvert: boolean, propertyName: keyof UserTimer) => {
  if (isConvert) {
    timer[propertyName] =
      user.value.timer[propertyName] - currentBlockNumber.value > 0
        ? moment // eslint-disable-line import/no-named-as-default-member
            .duration(
              (
                (user.value.timer[propertyName] - currentBlockNumber.value) *
                BigInt(chainBlockTime) *
                BigInt(1000)
              ).toString(),
            )
            .humanize()
        : '0'
  } else {
    timer[propertyName] = user.value.timer[propertyName].toString()
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
