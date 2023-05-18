<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem tooltip>
      <template #title> Name: </template>
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
      <template #title> ID: </template>
      <span>{{ props.id }}</span>
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
    <AppButton v-if="town.recruitment" class="my-3" @click="joinTown()"
      >Join {{ townName }}</AppButton
    >
  </div>
</template>

<script setup lang="ts">
import { decodeBytes32String, ZeroAddress } from 'ethers'
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
const userGameStore = useUserGameStore()

const { getKta } = storeToRefs(connectionStore)

//--------[ Data ]--------//
const town = ref(userGameStore.town)

const addresses = ref<string[]>([])
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

//--------[ Computed ]--------//
const leader = computed(() => middleCropping(town.value.leader))

const citizenAddresses = computed(() =>
  addresses.value.map((address) => middleCropping(address))
)

const townName = computed(() => decodeBytes32String(town.value.name))

//--------[ Hooks ]--------//
onMounted(async () => {
  town.value = await getKta.value.townById(props.id)
  if (town.value.leader !== ZeroAddress) {
    addresses.value = await getKta.value.getCitizensByTownId(props.id)
  }
})

const joinTown = async () => {
  try {
    await getKta.value.joinTown(BigInt(props.id))
  } catch (error: any) {
    // console.log(error)
    console.log(error.info.error.data.data)
    console.log(
      getKta.value.interface.decodeErrorResult(
        'TownMustSettled',
        error.info.error.data.data.result
      )
    )
    console.log(
      getKta.value.interface.getError(error.info.error.data.data.result)
    )
  }
}
</script>
