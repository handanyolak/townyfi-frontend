<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem title="Name:" tooltip>
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
    <ListItem title="ID:" tooltip>
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
    <AppButton v-if="town.recruitment" class="my-3" @click="joinTown()"
      >Join {{ townName }}</AppButton
    >
  </div>
</template>

<script setup lang="ts">
import { type Address, hexToString, zeroAddress } from 'viem'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import ScrollableList from '~/components/common/ScrollableList.vue'
import AppButton from '~/components/common/AppButton.vue'
import { transformTown } from '~/transformers'

// --------[ Props & Emits ]-------- //
interface OtherTownProps {
  id: bigint
}
const props = defineProps<OtherTownProps>()

// --------[ Stores ]-------- //
const userGameStore = useUserGameStore()
const contractStore = useContractStore()

const { getKta, getKtaCaller } = storeToRefs(contractStore)

// --------[ Data ]-------- //
const town = ref(userGameStore.town)

const addresses = ref<readonly Address[]>([])
// TODO: hardcoded for now
const attacker = ref(1)
const defender = ref(2)
const attackable = ref(3743879)
const expired = ref(3743879)

// --------[ Computed ]-------- //
const leader = computed(() => middleCropping(town.value.leader))

const citizenAddresses = computed(() =>
  addresses.value.map((address) => middleCropping(address)),
)

const townName = computed(() => hexToString(town.value.name, { size: 32 }))

// --------[ Hooks ]-------- //
onMounted(async () => {
  town.value = transformTown(await getKta.value.read.townById([props.id]))

  if (!areAddressesEqual(town.value.leader, zeroAddress)) {
    addresses.value = await getKta.value.read.getCitizensByTownId([props.id])
  }
})

const joinTown = async () => {
  await getKtaCaller.value.callFunction('write', 'joinTown', [BigInt(props.id)])
}
</script>
