<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem editable tooltip>
      <template #title> Name: </template>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
      </template>
      <span>{{ decodeBytes32String(user.name as any) }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Coordinate </template>
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
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
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
    <!-- TODO: don't use for here -->
    <ListItem
      v-for="(item, index) in timers"
      :key="index"
      :item="item"
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
      <template #action-icon>
        <img
          v-if="getPointIcon(item)"
          class="mr-1 h-5 w-5 animate-bounce cursor-pointer"
          :src="getPointIcon(item)"
        />
      </template>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { duration } from 'moment'
import { decodeBytes32String } from 'ethers'
import * as yup from 'yup'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { IKillThemAll } from '~/types/typechain/KillThemAll'
import { toCapitalizedWords, middleCropping } from '~/utils'

//--------[ Stores ]--------//
const userGameStore = useUserGameStore()
const userWalletStore = useUserWalletStore()

const { user } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const timer = reactive<any>({ ...user.value.timer })
const timers = Object.keys(user.value.timer).filter((item: any) => isNaN(item))
const name = ref(decodeBytes32String(user.value.name))
const reffererAddress = user.value.referrer
const nameRules = yup.string().bytes32()

//--------[ Computed ]--------//
// TODO: Backend'de get datalar ayrildiktan sonra duzenlenecek
const getPointIcon = computed(() => (_getPoint: string) => {
  const iconName = useSvg(_getPoint)

  return iconName.includes('undefined') ? undefined : useSvg(_getPoint)
})

const referrer = computed(() => middleCropping(reffererAddress))

//--------[ Methods ]--------//
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
