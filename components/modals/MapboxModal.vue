<template>
  <Parchment>
    <template #parchment-header>
      ({{ coordinate._x }}, {{ coordinate._y }})</template
    >
    <div class="flex flex-col">
      <SearchBar
        v-if="addresses.length"
        v-model="search"
        :rules="searchRules"
      />
      <Accordion v-if="townId">
        <template #title>
          <p class="w-full text-center font-bold not-italic">Town</p>
        </template>
        <template #content>
          <OtherTown :id="townId" class="px-3" />
        </template>
      </Accordion>
      <ListTitle v-if="filteredList.length" class="my-8 text-lg font-bold"
        >Users</ListTitle
      >
      <p
        v-if="!addresses.length"
        class="my-20 text-center text-3xl text-towny-brown-dark-500"
      >
        For now, there are no users here...
      </p>
      <Accordion
        v-for="(_address, index) in filteredList"
        :key="index"
        @click="clickedAddress = _address"
      >
        <template #title>
          <div class="flex items-center">
            <button
              class="mr-4 flex flex-col items-center rounded-md bg-towny-brown-dark-300 p-1 text-xs text-white"
              @click.stop="!isOwnAddress(_address) && attack(_address)"
            >
              <span>{{ isOwnAddress(_address) ? 'You' : 'Attack' }}</span>
              <img
                v-if="!isOwnAddress(_address)"
                src="@/assets/img/attack.svg"
                class="h-5 w-5"
              />
            </button>

            <div class="text-sm text-shadow-none">
              {{ _address }}
            </div>
          </div>
        </template>
        <template #content>
          <OtherUser v-if="clickedAddress === _address" :address="_address" />
        </template>
      </Accordion>
    </div>
    <template #parchment-footer>
      <div>
        <AppButton
          v-if="!isAtSameCoordinate"
          class="px-4 text-xl"
          @click="handleMovement"
          >{{ isMoveable() ? 'Move' : 'Teleport' }}</AppButton
        >
      </div>
    </template>
  </Parchment>
</template>

<script setup lang="ts">
import type { Address } from 'viem'
import { useDebounce } from '@vueuse/core'
import OtherUser from '~/components/OtherUser.vue'
import Parchment from '~/components/Parchment.vue'
import Accordion from '~/components/common/Accordion.vue'
import SearchBar from '~/components/common/SearchBar.vue'
import AppButton from '~/components/common/AppButton.vue'
import ListTitle from '~/components/common/ListTitle.vue'
import OtherTown from '~/components/OtherTown.vue'
import { getAddressRule } from '~/composables/useYupRules'
import type { CoordinateItem } from '~/types'
import { getDifference } from '~/utils'
import { Direction } from '~/enums'

// --------[ Prop & Emit ]-------- //
interface MapboxModalProps {
  coordinate: CoordinateItem
}
const props = defineProps<MapboxModalProps>()

// --------[ Store ]-------- //
const appOptionsStore = useAppOptionsStore()

const { clearModalInfo, setModalInfo } = appOptionsStore

const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)

const userWalletStore = useUserWalletStore()
const { address } = storeToRefs(userWalletStore)

const search = ref('')
const clickedAddress = ref('')
const addresses = ref<readonly Address[]>([])
const townId = ref(BigInt(0))
const searchRules = getAddressRule()
const searchDebounced = useDebounce(search, 1000)

// --------[ Computed ]-------- //
const filteredList = computed(() => {
  return addresses.value.filter((address: string) =>
    address.toLowerCase().includes(searchDebounced.value.toLowerCase()),
  )
})

const isOwnAddress = computed(
  () => (_address: string) => address.value === _address,
)

const isAtSameCoordinate = computed(
  () =>
    user.value.coordinate._x === props.coordinate._x &&
    user.value.coordinate._y === props.coordinate._y,
)

// --------[ Method ]-------- //
const teleport = async () => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'teleportToTown',
    message: `Are you sure you want to teleport ${props.coordinate._x}, ${props.coordinate._y}?`,
  })

  if (!confirmed) {
    return
  }

  try {
  } catch (error) {
    console.error('Teleport transaction failed:', error)
  } finally {
    clearModalInfo()
  }
}

// TODO: notification will be made after the transaction is confirmed
const attack = async (address: string) => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'attack',
    message: `Are you sure you want to attack ${address}?`,
  })

  if (!confirmed) {
    return
  }

  try {
  } catch (error) {
    console.error('Attack transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}

const move = async () => {
  const deltaX = props.coordinate._x - BigInt(user.value.coordinate._x)
  const deltaY = props.coordinate._y - BigInt(user.value.coordinate._y)

  let direction: Direction
  if (deltaX < 0) {
    direction = Direction.Left
  } else if (deltaX > 0) {
    direction = Direction.Right
  } else if (deltaY < 0) {
    direction = Direction.Down
  } else {
    direction = Direction.Up
  }

  try {
  } catch (error) {
    console.error('Move transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}

const isMoveable = () => {
  return (
    getDifference(
      props.coordinate._x,
      props.coordinate._y,
      user.value.coordinate._x,
      user.value.coordinate._y,
    ) <= 1
  )
}

const handleMovement = () => {
  isMoveable() ? move() : teleport()
}
</script>
