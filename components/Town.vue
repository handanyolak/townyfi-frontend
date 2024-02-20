<template>
  <div v-if="user.townInfo.townId">
    <ListTitle>General</ListTitle>
    <ListItem title="Name:" editable tooltip>
      <template #item>
        <VForm class="flex flex-col items-center">
          <VField v-model="townName" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </VForm>
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
      <span>{{ TownStatus[Number(town.status)] }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
      <template #action>
        <AppButton
          v-if="isLeader"
          @click="settleTown()"
          class="w-[120px]"
          basicHover
        >
          {{ buttonLabel }}
        </AppButton>
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
          @click="toggleRecruitment()"
          class="w-[120px]"
          basicHover
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
    <ListTitle>Citizens</ListTitle>
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
    <ListTitle>Timers</ListTitle>
    <ListItem title="Protection:" tooltip>
      <span>{{ town.protectionAt.toString() }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>War</ListTitle>
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
import { decodeBytes32String } from 'ethers'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'
import HasNotTown from '~/components/HasNotTown.vue'
import AppButton from '~/components/AppButton.vue'
import { TownStatus } from '~/enums'
import { getBytes32Rule } from '~/composables/useYupRules'

//--------[ Stores ]--------//
const userGameStore = useUserGameStore()
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()

const { user, town } = storeToRefs(userGameStore)
const { getKta, getKtaCaller } = storeToRefs(connectionStore)
const { address } = storeToRefs(userWalletStore)

//--------[ Data ]--------//
const nameRules = getBytes32Rule()
const addresses = await getKta.value.getCitizensByTownId(
  user.value.townInfo.townId
)
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

//--------[ Computed ]--------//
const leader = computed(() => middleCropping(town.value.leader))

const citizenAddresses = computed(() =>
  addresses.map((address) => middleCropping(address))
)
const townName = computed(() => decodeBytes32String(town.value.name))

const isLeader = computed(() => address.value === town.value.leader)

const buttonLabel = computed(() =>
  BigInt(town.value.status) === BigInt(TownStatus.VOYAGE) ? 'Settle' : 'Voyage'
)

//--------[ Methods ]--------//
const settleTown = async () => {
  await getKtaCaller.value.callFunction('settleTown')
}

const toggleRecruitment = async () => {
  await getKtaCaller.value.callFunction('changeTownRecruitment')
}

const leaveTown = async () => {
  await getKtaCaller.value.callFunction('leaveTown')
}

const kickCitizen = async (item: string) => {
  await getKtaCaller.value.callFunction('exileCitizen', [item])
}
</script>
