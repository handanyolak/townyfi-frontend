<template>
  <div v-if="user.townInfo.townId">
    <ListTitle class="my-8">General</ListTitle>
    <ListItem title="Name:" editable tooltip>
      <template #item>
        <VeeForm class="flex flex-col items-center">
          <VeeField v-model="townName" name="name" :rules="nameRules" />
          <VeeErrorMessage class="text-red-800" name="name" />
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
    <ListItem title="Coordinate:" tooltip>
      <span>({{ town.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ town.coordinate._y.toString() }})</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Level:" tooltip>
      <span>{{ town.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Exp:" tooltip>
      <span>{{ town.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Leader:" copiable tooltip :copy-value="town.leader">
      <span>{{ leader }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Status:" tooltip>
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
          class="w-[120px]"
          basic-hover
          @click="settleTown()"
        >
          {{ buttonLabel }}
        </AppButton>
      </template>
    </ListItem>
    <ListItem title="Mode:" tooltip>
      <span>{{ town.mode }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Recruitment:" tooltip>
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
          class="w-[120px]"
          basic-hover
          @click="toggleRecruitment()"
        >
          Recruitment
        </AppButton>
      </template>
    </ListItem>
    <ListItem title="ID:" tooltip>
      <span>{{ user.townInfo.townId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>

    <AppButton @click="leaveTown()"> Leave Town </AppButton>
    <ListTitle class="my-8">Citizens</ListTitle>
    <ScrollableList
      :items="citizenAddresses"
      :copy-value="addresses"
      copiable
      :actionable="isLeader"
      :action-value="{
        name: 'Kick Citizen',
        action: kickCitizen,
      }"
    />
    <ListTitle class="my-8">Timers</ListTitle>
    <ListItem title="Protection:" tooltip>
      <span>{{ town.protectionAt.toString() }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle class="my-8">War</ListTitle>
    <AppButton basic-hover class="mx-auto block" @click="startWar()">
      Watch Last Town War
    </AppButton>
    <ListItem title="Attacker:" tooltip>
      <span>{{ attacker }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Defender:" tooltip>
      <span>{{ defender }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Attackable:" tooltip>
      <span>{{ attackable }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem title="Expired:" tooltip>
      <span>{{ expired }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
  </div>
  <HasNotTown v-else></HasNotTown>
</template>

<script setup lang="ts">
import { hexToString, type Address } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import ScrollableList from '~/components/common/ScrollableList.vue'
import HasNotTown from '~/components/tabs/game/HasNotTown.vue'
import AppButton from '~/components/common/AppButton.vue'
import { TownStatus } from '~/enums'
import { getBytes32Rule } from '~/composables/useYupRules'

// --------[ Store ]-------- //
const userGameStore = useUserGameStore()
const { user, town } = storeToRefs(userGameStore)

const contractStore = useContractStore()
const { getKtaPublic, getKtaCaller } = storeToRefs(contractStore)

const userWalletStore = useUserWalletStore()
const { address } = storeToRefs(userWalletStore)

const appOptionStore = useAppOptionsStore()
const { setModalInfo } = appOptionStore

// --------[ Data ]-------- //
const nameRules = getBytes32Rule()
// TODO: avoid any
const addresses = await getKtaPublic.value.read.getCitizensByTownId([
  user.value.townInfo.townId as any,
])
// TODO: avoid hardcoded values
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

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
  setModalInfo('WarModal', { sizeMultiplier: 1.4, watchUserWar: true })
}
</script>
