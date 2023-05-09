<template>
  <div v-if="user.townInfo.townId">
    <ListTitle>General</ListTitle>
    <ListItem editable tooltip>
      <template #title> Name: </template>
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
    <ListItem tooltip>
      <template #title> Coordinate </template>
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
    <ListItem tooltip>
      <template #title> Level: </template>
      <span>{{ town.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Exp: </template>
      <span>{{ town.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem copiable tooltip :copy-value="town.leader">
      <template #title> Leader: </template>
      <span>{{ leader }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Status: </template>
      <span>{{ TownStatus[Number(town.status)] }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Recruitment: </template>
      <span>{{ town.recruitment }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> ID: </template>
      <span>{{ user.townInfo.townId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <TownyButton v-if="isLeader" @click="settleTown()">
      Settle Town
    </TownyButton>
    <TownyButton v-if="isLeader" @click="toggleRecruitment()">
      Recruitment Town
    </TownyButton>
    <ListTitle>Citizens</ListTitle>
    <ScrollableList
      :items="citizenAddresses"
      :copy-value="addresses"
      copiable
    />
    <ListTitle>Timers</ListTitle>
    <ListItem tooltip>
      <template #title> Protection: </template>
      <span>{{ town.protectionAt.toString() }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>War</ListTitle>
    <ListItem tooltip>
      <template #title> Attacker: </template>
      <span>{{ attacker }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Defender: </template>
      <span>{{ defender }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Attackable: </template>
      <span>{{ attackable }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Expired: </template>
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
import * as yup from 'yup'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'
import HasNotTown from '~/components/HasNotTown.vue'
import TownyButton from '~/components/TownyButton.vue'
import { TownStatus } from '~/enums'

//--------[ Stores ]--------//
const userGameStore = useUserGameStore()
const connectionStore = useConnectionStore()
const userWalletStore = useUserWalletStore()

const { user, town } = storeToRefs(userGameStore)
const { getKta } = storeToRefs(connectionStore)
const { address } = storeToRefs(userWalletStore)

//--------[ Data ]--------//
const nameRules = yup.string().bytes32()

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

const settleTown = async () => {
  try {
    await getKta.value.settleTown()
  } catch (error: any) {
    console.log(
      getKta.value.interface.getError(error.info.error.data.data.result)
    )
  }
}

const toggleRecruitment = async () => {
  try {
    await getKta.value.changeTownRecruitment()
  } catch (error: any) {
    console.log(
      getKta.value.interface.getError(error.info.error.data.data.result)
    )
  }
}
</script>
