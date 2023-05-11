<template>
  <Parchment>
    <template #parchment-header> Addresses </template>
    <div class="flex flex-col">
      <SearchBar v-model="search" :rules="searchRules" />
      <Accordion v-for="(_address, index) in filteredList" :key="index">
        <template #title>
          <div class="flex items-center">
            <div
              class="mr-1 rounded-md bg-towni-brown-dark-300 p-1 text-xs text-white"
              @click.stop="attack(_address)"
            >
              TODO:Attack
            </div>

            <div class="text-xs" @click="clickedAddress = _address">
              {{ _address }}
            </div>
          </div>
        </template>
        <OtherUser v-if="clickedAddress === _address" :address="_address" />
      </Accordion>
    </div>
    <template #parchment-footer>
      <div>
        <TownyButton
          class="px-4 text-xl"
          v-if="
            !(
              user.coordinate._x === coordinate._x &&
              user.coordinate._y === coordinate._y
            )
          "
          @click="isMoveable() ? move() : teleport()"
          >{{ isMoveable() ? 'Move' : 'Teleport' }}</TownyButton
        >
      </div>
    </template>
  </Parchment>
</template>

<script setup lang="ts">
import OtherUser from '~/components/OtherUser.vue'
import Accordion from '~/components/Accordion.vue'
import SearchBar from '~/components/SearchBar.vue'
import { getAddressRule } from '~/composables/useYupRules'
import { useDebounce } from '@vueuse/core'
import { CoordinateItem } from '~/types'
import { Direction } from '~/enums'
import { abs } from 'extra-bigint.web'

//--------[ Props & Emits ]--------//
interface MapboxModalProps {
  coordinate: CoordinateItem
}

const props = defineProps<MapboxModalProps>()

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const { getKta } = storeToRefs(connectionStore)

const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)

const search = ref('')
const clickedAddress = ref('')
const addresses = ref<string[]>([])
const searchRules = getAddressRule()
const searchDebounced = useDebounce(search, 1000)

//--------[ Hooks ]--------//
onMounted(async () => {
  addresses.value = await getKta.value.getAddressesByCoordinate(
    props.coordinate
  )
})

const filteredList = computed(() => {
  return addresses.value.filter((address: string) =>
    address.toLowerCase().includes(searchDebounced.value.toLowerCase())
  )
})

//--------[ Methods ]--------//
const teleport = async () => {
  await getKta.value.teleport({
    _x: props.coordinate._x,
    _y: props.coordinate._y,
  })
}

const attack = async (address: string) => {
  try {
    await getKta.value.attack(address)
  } catch (error: any) {
    console.log(
      getKta.value.interface.getError(error.info.error.data.data.result)
    )
  }
}

const move = async () => {
  const deltaX = props.coordinate._x - user.value.coordinate._x
  const deltaY = props.coordinate._y - user.value.coordinate._y

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

  await getKta.value.move(BigInt(direction))
}

const isMoveable = () => {
  const deltaX = abs(props.coordinate._x - user.value.coordinate._x)
  const deltaY = abs(props.coordinate._y - user.value.coordinate._y)

  return abs(deltaX + deltaY) <= 1
}
</script>
