<template>
  <div v-if="user.townInfo.townId">
    <ListTitle class="my-8">General</ListTitle>
    <ListItem title="Name:" editable>
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField
            v-model="townName"
            name="name"
            :rules="nameRules"
            validate-on-input
          />
          <VeeErrorMessage class="font-semibold text-error-red" name="name" />
        </VeeForm>
      </template>
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
      <template #action>
        <AppButton
          v-if="isLeader"
          class="w-32"
          basic-hover
          @click="settleTown()"
        >
          {{ buttonLabel }}
        </AppButton>
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
    <ListItem title="Recruitment:">
      <span>{{ town.recruitment }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
      <template #action>
        <AppButton
          v-if="isLeader"
          class="w-32"
          basic-hover
          @click="toggleRecruitment()"
        >
          Recruitment
        </AppButton>
      </template>
    </ListItem>
    <ListItem
      title="ID:"
      searchable
      :search-options="{
        searchType: SearchType.Town,
        findBy: FindOptions.ID,
        findInputText: user.townInfo.townId,
      }"
    >
      <span>{{ user.townInfo.townId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>

    <AppButton
      basic-hover
      class="mx-auto mt-5 block w-full"
      @click="leaveTown()"
    >
      Leave Town
    </AppButton>
    <ListTitle class="my-8">Citizens</ListTitle>
    <ScrollableList
      copiable
      :items="citizenAddresses"
      :copy-value="addresses"
      :actionable="isLeader"
      :action-value="{
        name: 'Kick Citizen',
        action: kickCitizen,
      }"
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
    <AppButton
      basic-hover
      class="mx-auto my-5 block w-full"
      @click="startWar()"
    >
      Watch Last Town War
    </AppButton>
  </div>
  <HasNotTown v-else></HasNotTown>
</template>

<script setup lang="ts">
import moment from 'moment'
import { hexToString, type Address } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import ScrollableList from '~/components/common/ScrollableList.vue'
import HasNotTown from '~/components/tabs/game/HasNotTown.vue'
import AppButton from '~/components/common/AppButton.vue'
import { TownStatus, SearchType, FindOptions } from '~/enums'
import { getBytes32Rule } from '~/composables/useYupRules'

const {
  public: { chainBlockTime },
} = useRuntimeConfig()

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const { user, town, war } = storeToRefs(userGameStore)

const contractStore = useContractStore()
const { getKtaPublic, getKtaCaller } = storeToRefs(contractStore)

const userWalletStore = useUserWalletStore()
const { address, currentBlockNumber } = storeToRefs(userWalletStore)

const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore

// --------[ Data ]-------- //
const nameRules = getBytes32Rule()
const addresses = (await getKtaPublic.value.read.getCitizensByTownId([
  user.value.townInfo.townId,
])) as string[]
const timer = reactive<any>({
  protectionAt: town.value.protectionAt,
  attackableAt: war.value.attackableAt,
  expiredAt: war.value.expiredAt,
})

// --------[ Computed ]-------- //
const leader = computed(() => middleCropping(town.value.leader))

const citizenAddresses = computed(() =>
  addresses.map((address) => middleCropping(address)),
)
const townName = computed(() => hexToString(town.value.name, { size: 32 }))

const isLeader = computed(() => address.value === town.value.leader)

const buttonLabel = computed(() =>
  town.value.status === TownStatus[0] ? 'Settle' : 'Voyage',
)

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

const settleTown = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'settleTown',
  })
}

const toggleRecruitment = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'changeTownRecruitment',
  })
}

const leaveTown = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'leaveTown',
  })
}

const kickCitizen = async (item: string) => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'exileCitizen',
    args: [[item as Address]], // FIXME: type casting
  })
}

const startWar = () => {
  setModalInfo('WarModal', { sizeMultiplier: 1.3, watchUserWar: true })
}
</script>
