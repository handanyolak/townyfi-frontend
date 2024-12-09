<template>
  <div>
    <ListTitle class="my-8">General</ListTitle>
    <ListItem title="Name:">
      <span>{{ townName }}</span>
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
        searchType: SearchType.User,
        findBy: FindOptions.Coordinate,
        findInputText: `${town.coordinate._x.toString()},${town.coordinate._y.toString()}`,
      }"
    >
      <span
        >({{ town.coordinate._x.toString() }},{{
          town.coordinate._y.toString()
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
      <span>{{ town.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Exp:">
      <span>{{ town.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem
      title="Leader:"
      copiable
      :copy-value="town.leader"
      searchable
      :search-options="{
        searchType: SearchType.User,
        findBy: FindOptions.Address,
        findInputText: town.leader,
      }"
    >
      <span>{{ leader }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Status:">
      <span>{{ town.status }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Mode:">
      <span>{{ town.mode }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem
      title="ID:"
      searchable
      :search-options="{
        searchType: SearchType.Town,
        findBy: FindOptions.ID,
        findInputText: props.id,
      }"
    >
      <span>{{ props.id }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle class="my-8">Citizens</ListTitle>
    <ScrollableList
      copiable
      :items="citizenAddresses"
      :copy-value="addresses"
      searchable
      :search-options="{
        searchType: SearchType.User,
        findBy: FindOptions.Address,
        findInputText: '',
      }"
    />
    <ListTitle class="my-8">Timers</ListTitle>
    <ListItem
      title="Protection Expires At:"
      convertable
      @convert="(isConvert) => convert(isConvert, 'protectionAt')"
    >
      <span>{{
        timer.protectionAt.toString() === '0'
          ? 'Available!'
          : timer.protectionAt
      }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle class="my-8">War</ListTitle>
    <ListItem
      title="Attacker Town Id:"
      searchable
      :search-options="{
        searchType: SearchType.Town,
        findBy: FindOptions.ID,
        findInputText: war.attackerTownId,
      }"
    >
      <span>{{ war.attackerTownId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem
      title="Defender Town Id:"
      searchable
      :search-options="{
        searchType: SearchType.Town,
        findBy: FindOptions.ID,
        findInputText: war.defenderTownId,
      }"
    >
      <span>{{ war.defenderTownId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem
      title="Attackable At:"
      convertable
      @convert="(isConvert) => convert(isConvert, 'attackableAt')"
    >
      <span>{{
        timer.attackableAt.toString() === '0'
          ? 'Available!'
          : timer.attackableAt
      }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem
      title="Expires At:"
      convertable
      @convert="(isConvert) => convert(isConvert, 'expiredAt')"
    >
      <span>{{
        timer.expiredAt.toString() === '0' ? 'Available!' : timer.expiredAt
      }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <div class="flex justify-between gap-4">
      <AppButton
        v-if="town.recruitment"
        basic-hover
        class="my-3 w-full"
        @click="joinTown()"
        >Join</AppButton
      >
      <AppButton
        v-if="isCurrentUserLeader"
        basic-hover
        class="my-3 w-full"
        @click="declareWar()"
        >Declare War</AppButton
      >
      <AppButton
        v-if="isCurrentUserLeader"
        basic-hover
        class="my-3 w-full"
        @click="startWar()"
        >Start War</AppButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { hexToString, zeroAddress } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import ScrollableList from '~/components/common/ScrollableList.vue'
import AppButton from '~/components/common/AppButton.vue'
import { transformTown, transformWar } from '~/transformers'
import { SearchType, FindOptions } from '~/enums'

const {
  public: { chainBlockTime },
} = useRuntimeConfig()

// --------[ Prop & Emit ]-------- //
interface OtherTownProps {
  id: bigint
}
const props = defineProps<OtherTownProps>()

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const { town: currentUserTown } = storeToRefs(userGameStore)

const contractStore = useContractStore()
const { getKtaPublic, getKtaCaller } = storeToRefs(contractStore)

const userWalletStore = useUserWalletStore()
const { address: currentUserAddress, currentBlockNumber } =
  storeToRefs(userWalletStore)

// --------[ Data ]-------- //
const town = ref(userGameStore.town)
const war = ref(userGameStore.war)

const addresses = ref<string[]>([])
const timer = reactive<any>({
  protectionAt: town.value.protectionAt,
  attackableAt: war.value.attackableAt,
  expiredAt: war.value.expiredAt,
})

// --------[ Computed ]-------- //
const leader = computed(() => middleCropping(town.value.leader))

const isCurrentUserLeader = computed(
  () => currentUserAddress.value === currentUserTown.value.leader,
)

const citizenAddresses = computed(() =>
  addresses.value.map((address) => middleCropping(address)),
)

const townName = computed(() => hexToString(town.value.name, { size: 32 }))

// --------[ Hook ]-------- //
onMounted(async () => {
  town.value = transformTown(await getKtaPublic.value.read.townById([props.id]))
  war.value = transformWar(
    await getKtaPublic.value.read.warByTownId([props.id]),
  )

  if (!areAddressesEqual(town.value.leader, zeroAddress)) {
    addresses.value = (await getKtaPublic.value.read.getCitizensByTownId([
      props.id,
    ])) as string[]
  }
})

// --------[ Method ]-------- //
const convert = (
  isConvert: boolean,
  propertyName: 'protectionAt' | 'attackableAt' | 'expiredAt',
) => {
  const currentPropertyBlockNumber =
    town.value[propertyName as 'protectionAt'] ??
    war.value[propertyName as 'attackableAt' | 'expiredAt']
  if (isConvert) {
    const diffInBlockNumber =
      currentBlockNumber.value - currentPropertyBlockNumber
    timer[propertyName] =
      diffInBlockNumber > 0
        ? moment // eslint-disable-line import/no-named-as-default-member
            .duration(
              (
                diffInBlockNumber *
                BigInt(chainBlockTime) *
                BigInt(1000)
              ).toString(),
            )
            .humanize()
        : '0'
  } else {
    timer[propertyName] = currentPropertyBlockNumber.toString()
  }
}

const joinTown = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'joinTown',
    args: [[BigInt(props.id)]],
  })
}

const declareWar = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'declareWar',
    args: [[BigInt(props.id)]],
  })
}

const startWar = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'townWar',
  })
}
</script>
