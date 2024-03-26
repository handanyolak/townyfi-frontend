<template>
  <Parchment>
    <template #parchment-header> Addresses </template>
    <div class="flex flex-col">
      <SearchBar v-model="search" :rules="searchRules" />
      <Accordion
        v-for="(_address, index) in filteredList"
        :key="index"
        @click="clickedAddress = _address"
      >
        <template #title>
          <div class="flex items-center">
            <div
              class="mr-1 rounded-md bg-towni-brown-dark-300 p-1 text-xs text-white"
              @click.stop="!isOwnAddress(_address) && attack(_address)"
            >
              {{ isOwnAddress(_address) ? 'Self' : 'Attack' }}
            </div>

            <div class="text-xs">
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
          v-if="
            !(
              user.coordinate._x === coordinate._x &&
              user.coordinate._y === coordinate._y
            )
          "
          class="px-4 text-xl"
          @click="isMoveable() ? move() : teleport()"
          >{{ isMoveable() ? 'Move' : 'Teleport' }}</AppButton
        >
      </div>
    </template>
  </Parchment>
</template>

<script setup lang="ts">
import type { Address } from 'viem'
import { useDebounce } from '@vueuse/core'
import { abs } from 'extra-bigint.web'
import OtherUser from '~/components/OtherUser.vue'
import Parchment from '~/components/Parchment.vue'
import Accordion from '~/components/common/Accordion.vue'
import SearchBar from '~/components/common/SearchBar.vue'
import AppButton from '~/components/common/AppButton.vue'
import { getAddressRule } from '~/composables/useYupRules'
import type { CoordinateItem } from '~/types'
import { Direction } from '~/enums'

// --------[ Props & Emits ]-------- //
interface MapboxModalProps {
  coordinate: CoordinateItem
}

const props = defineProps<MapboxModalProps>()

// --------[ Stores ]-------- //
const contractStore = useContractStore()
const appOptionsStore = useAppOptionsStore()

const { getKta, getKtaCaller } = storeToRefs(contractStore)
const { clearModalInfo, setModalInfo } = appOptionsStore

const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)

const userWalletStore = useUserWalletStore()
const { address } = storeToRefs(userWalletStore)

const search = ref('')
const clickedAddress = ref('')
const addresses = ref<readonly Address[]>([])
const searchRules = getAddressRule()
const searchDebounced = useDebounce(search, 1000)

// --------[ Hooks ]-------- //
onMounted(async () => {
  addresses.value = await getKta.value.read.getAddressesByCoordinate([
    props.coordinate,
  ])
})

const filteredList = computed(() => {
  return addresses.value.filter((address: string) =>
    address.toLowerCase().includes(searchDebounced.value.toLowerCase()),
  )
})

const isOwnAddress = computed(
  () => (_address: string) => address.value === _address,
)

// --------[ Methods ]-------- //
const teleport = async () => {
  const result = await getKtaCaller.value.callFunction('write', 'teleport', [
    {
      _x: props.coordinate._x,
      _y: props.coordinate._y,
    },
  ])

  if (result) {
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
    await getKtaCaller.value.callFunction('write', 'attack', [address])
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

  await getKtaCaller.value.callFunction('write', 'move', [BigInt(direction)])
}

const isMoveable = () => {
  const deltaX = abs(props.coordinate._x - BigInt(user.value.coordinate._x))
  const deltaY = abs(props.coordinate._y - BigInt(user.value.coordinate._y))

  return deltaX + deltaY <= 1
}
</script>
