<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem tooltip>
      <template #title> Name: </template>
      <span>{{ decodeBytes32String(townInfo.name as any) }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Coordinate </template>
      <span>({{ townInfo.coordinate._x.toString() }}</span>
      <span>,</span>
      <span>{{ townInfo.coordinate._y.toString() }})</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Level: </template>
      <span>{{ townInfo.levelId }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem tooltip>
      <template #title> Exp: </template>
      <span>{{ townInfo.exp }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListItem copiable tooltip :copy-value="townInfo.leader">
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
      <span>{{ TownStatus[Number(townInfo.status)] }}</span>
      <template #tooltip>
        <span
          >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
          amet.</span
        >
      </template>
    </ListItem>
    <ListTitle>Citizens</ListTitle>
    <ScrollableList
      :items="citizenAddresses"
      :copy-value="addresses"
      copiable
    />
    <ListTitle>Timers</ListTitle>
    <ListItem tooltip>
      <template #title> Protection: </template>
      <span>{{ townInfo.protectionAt.toString() }}</span>
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
</template>

<script setup lang="ts">
import { decodeBytes32String } from 'ethers'
import * as yup from 'yup'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ScrollableList from '~/components/sidebar-items/ScrollableList.vue'
import { TownStatus } from '~/enums'

//--------[ Props & Emits ]--------//
interface OtherTownProps {
  id: bigint
}
const props = defineProps<OtherTownProps>()

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()

const { getKta } = storeToRefs(connectionStore)

//--------[ Data ]--------//
const townInfo = {
  ...(await getKta.value.townById(props.id)),
}
const townName = ref(decodeBytes32String(townInfo.name))
const nameRules = yup.string().bytes32()
const addresses = await getKta.value.getCitizensByTownId(props.id)
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

//--------[ Computed ]--------//
const leader = computed(() => middleCropping(townInfo.leader))

const citizenAddresses = computed(() =>
  addresses.map((address) => middleCropping(address))
)
</script>
