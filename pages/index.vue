<template>
  <div class="flex h-screen items-center justify-center">
    <div
      ref="containerElement"
      v-drag="dragHandler"
      style="width: 40% !important"
      class="deneme container"
      @wheel="onWheel($event)"
    >
      <div v-if="hasMetamask && onValidNetwork" class="relative">
        <img
          class="absolute top-0 w-full cursor-pointer"
          src="@/assets/img/border.png"
          alt="save"
        />
        <img
          class="absolute bottom-0 cursor-pointer"
          src="@/assets/img/border.png"
          alt="save"
        />
        <img
          class="absolute left-[-49%] top-[49%] rotate-90 transform cursor-pointer"
          src="@/assets/img/border.png"
          alt="save"
        />
        <img
          class="absolute right-[-49%] top-[49%] rotate-90 transform cursor-pointer"
          src="@/assets/img/border.png"
          alt="save"
        />
        <div
          class="relative grid overflow-hidden"
          :style="`grid-template-columns: repeat(${getGridColsByNearLevel}, minmax(0, 1fr));`"
        >
          <div
            class="absolute top-0 h-full w-full bg-map bg-cover"
            :style="`transform: scale(${
              100 + (maxNearLevel - nearLevel) * 10
            }%); background-position: ${
              -BigInt(originCoordinate._x) *
              BigInt(Math.round(width / (nearLevel * 2 + 1)))
            }px ${
              BigInt(originCoordinate._y) *
              BigInt(Math.round(width / (nearLevel * 2 + 1)))
            }px`"
          />
          <CastleBox
            v-for="(item, index) in addressesByCoordinate"
            :key="index"
            :item="item"
            :emit-ready-event="index === 0"
            class="select-none"
            @modalOpened="openModal(item)"
          />
          <!-- TODO: CastleBoxModal -->
          <!-- <InformationModal
            v-if="showModal"
            :content-classes="'min-h-[50%] w-1/3 bg-transparent'"
            @modalClosed="closeModal()"
          >
            <Parchment>
              <template #parchment-header> Addresses </template>
              <div class="mt-8 flex flex-col">
                <div>
                  <Accordion
                    v-for="(_address, index) in addresses"
                    :key="index"
                  >
                    <template #title>
                      <div @click="clickedAddress = _address">
                        {{ _address }}
                      </div>
                    </template>
                    <OtherUser
                      v-if="clickedAddress === _address"
                      :address="_address"
                    />
                  </Accordion>
                </div>
              </div>
              <template #parchment-footer>
                <div class="flex justify-center">
                  <TownyButton>Move</TownyButton>
                </div>
              </template>
            </Parchment>
          </InformationModal> -->
        </div>
        <div
          class="relative flex justify-around bg-towni-brown-light-500 p-[2px]"
        >
          <div class="relative flex items-center justify-center p-16">
            <div
              :class="[
                'arrow left-[50%] -rotate-90',
                isMove === 0 ? 'w-16' : 'w-4',
              ]"
              @click="navigateByArrow(Direction.Up)"
            ></div>
            <span class="absolute top-1 font-bold text-towni-brown-dark-600"
              >Up</span
            >
            <div
              :class="[
                'arrow left-[50%] rotate-0',
                isMove === 1 ? 'w-16' : 'w-4',
              ]"
              @click="navigateByArrow(Direction.Right)"
            ></div>
            <span class="absolute -right-3 font-bold text-towni-brown-dark-600"
              >Right</span
            >
            <div
              :class="[
                'arrow left-[50%] rotate-90',
                isMove === 2 ? 'w-16' : 'w-4',
              ]"
              @click="navigateByArrow(Direction.Down)"
            ></div>
            <span class="absolute bottom-3 font-bold text-towni-brown-dark-600"
              >Down</span
            >
            <div
              :class="[
                'arrow left-[50%] rotate-180',
                isMove === 3 ? 'w-16' : 'w-4',
              ]"
              @click="navigateByArrow(Direction.Left)"
            ></div>
            <span class="absolute -left-1 font-bold text-towni-brown-dark-600"
              >Left</span
            >
          </div>
          <div class="flex justify-between">
            <button
              class="mr-5 text-3xl text-towni-brown-dark-600"
              @click="setNearLevelByCalculatingCoordinates(nearLevel + 1)"
            >
              +
            </button>
            <button
              class="text-3xl text-towni-brown-dark-600"
              @click="setNearLevelByCalculatingCoordinates(nearLevel - 1)"
            >
              -
            </button>
          </div>
          <div class="flex items-center rounded-md p-1">
            <div class="flex flex-col">
              <ListItem input>
                <template #title> X: </template>
                <template #item>
                  <input v-model="coordinateX" type="text" />
                </template>
                <span>{{ coordinateX }}</span>
              </ListItem>
              <ListItem input>
                <template #title> Y: </template>
                <template #item>
                  <input v-model="coordinateY" type="text" />
                </template>
                <span>{{ coordinateY }}</span>
              </ListItem>
            </div>
            <img
              class="ml-4 h-8 w-8 cursor-pointer"
              src="@/assets/img/check.svg"
              alt="save"
              @click="teleport()"
            />
          </div>
        </div>
      </div>
      <GameInfo v-else />
      <SidebarMenu v-if="onValidNetwork" />
      <ChatBox />

      <Transition name="loading-slide">
        <TheLoading v-show="isLoading" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDrag } from '@vueuse/gesture'
import { Direction } from '~/constants'
import { CoordinateItem } from '~/types'
import OtherUser from '~/components/OtherUser.vue'
import Accordion from '~/components/Accordion.vue'
import TheLoading from '~/components/TheLoading.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'

const appOptionsStore = useAppOptionsStore()
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()
const { initializeApp } = appOptionsStore
const { originCoordinate } = storeToRefs(appOptionsStore)
const { hasMetamask } = connectionStore
const { onValidNetwork } = storeToRefs(connectionStore)
const { addressesByCoordinate, isLoading, nearLevel } =
  storeToRefs(userGameStore)
const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore
const showModal = ref(false)
const currentItem = ref<CoordinateItem>({
  _x: BigInt(0),
  _y: BigInt(0),
})
const { maxNearLevel } = useRuntimeConfig().public

const { getAddressesByCoordinate } = useKta()
const addresses = ref<string[]>([])
const clickedAddress = ref('')
const containerElement = ref(null)
// TODO: change name to english
const uzaklastir = ref(0)
const yakinlastir = ref(0)

const { width } = useElementSize(containerElement)

const dragHandler = ({ movement: [x, y], dragging }) => {
  const _originCoordinate = { ...originCoordinate.value }

  // precision for dragging
  _originCoordinate._y = _originCoordinate._y + BigInt(Math.trunc(y / 100))
  _originCoordinate._x = _originCoordinate._x + BigInt(Math.trunc(-x / 100))

  setUserCoordinate(_originCoordinate)
}

useDrag(dragHandler, {
  domTarget: containerElement,
})

onMounted(async () => {
  await initializeApp()
})

const getGridColsByNearLevel = computed(() => nearLevel.value * 2 + 1)

const onWheel = (event: WheelEvent) => {
  let newNearLevel: number

  if (event.deltaY < 0) {
    if (yakinlastir.value < 5) {
      yakinlastir.value++

      return
    }

    yakinlastir.value = 0
    newNearLevel = nearLevel.value - 1
  } else {
    if (uzaklastir.value < 5) {
      uzaklastir.value++

      return
    }

    uzaklastir.value = 0
    newNearLevel = nearLevel.value + 1
  }

  setNearLevelByCalculatingCoordinates(newNearLevel)
}

const openModal = async (item: CoordinateItem) => {
  currentItem.value = item
  showModal.value = true
  addresses.value = await getAddressesByCoordinate(currentItem.value)
}

const closeModal = () => (showModal.value = false)

const coordinateX = ref('')
const coordinateY = ref('')

const teleport = () => {
  setUserCoordinate({
    _x: BigInt(coordinateX.value),
    _y: BigInt(coordinateY.value),
  })
}

// TODO: This part will be UserMove component

const isMove = ref(-1)

// const userMove = async (direction: Direction) => {
//   isMove.value = direction
//   try {
//     await kta.connect(connectionStore.signer).move(direction)
//     isMove.value = -1
//   } catch (error) {
//     isMove.value = -1
//     console.log(error)
//   }
// }

const navigateByArrow = (direction: Direction) => {
  // TODO:Ethers try this
  const _originCoordinate = { ...originCoordinate.value }

  const navigateValue = BigInt(1)
  if (direction === Direction.Up) {
    _originCoordinate._y = _originCoordinate._y + navigateValue
  } else if (direction === Direction.Right) {
    _originCoordinate._x = _originCoordinate._x + navigateValue
  } else if (direction === Direction.Down) {
    _originCoordinate._y = _originCoordinate._y - navigateValue
  } else {
    _originCoordinate._x = _originCoordinate._x - navigateValue
  }

  setUserCoordinate(_originCoordinate)
}
</script>

<style>
.loading-slide-enter {
  opacity: 0;
}

.loading-slide-enter-active {
  animation: slide-in 1s ease-in forwards;
  transition: opacity 0.5s;
}

.loading-slide-leave-active {
  animation: slide-out 1s ease-out forwards;
  opacity: 0;
  transition: opacity 1s;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20px);
  }
}

.toast-theme {
  @apply bg-towni-brown-dark-300 bg-opacity-30 text-towni-brown-dark-300  backdrop-blur-sm;
}

.arrow {
  @apply absolute h-2  origin-left transform cursor-pointer bg-towni-brown-dark-200 transition-all duration-300 ease-in-out before:absolute before:-right-3 before:-top-2 before:bottom-0 before:h-0 before:w-0 before:border-t-12 before:border-b-12 before:border-l-18 before:border-towni-brown-dark-200 before:border-b-transparent before:border-t-transparent;
}

/* .deneme4::before {
  content: '';
  transform: scale(1.01447);
} */

/* .rounded-shadow {
  background: radial-gradient(
    circle,
    hsla(0, 0%, 83.9%, 0.3) 0,
    hsla(0, 0%, 90.6%, 0) 30%
  );
} */

/* .deneme1 {
  overflow: auto;
}

.deneme1::before {
  content: '';
  position: fixed;

  background-image: url(~/assets/img/map.png);
  width: 500px;
  height: 500px;
  background-size: contain;
  background-position: 100% 100%;
  background-attachment: fixed;

  filter: blur(2px);
} */

/* .deneme1 {
  background-position: 100% 100%;
  background-attachment: fixed;
  overflow: hidden;
}
.deneme1::before {
  content: '';
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;
  background-image: url(~/assets/img/map.png);
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
} */
/* .deneme {
  background: url(~/assets/img/border.png), url(~/assets/img/border.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 100% 100%, 100% 0%;
  padding: 20px;
}
.deneme::before {
  content: '';
  background: url(~/assets/img/border.png), url(~/assets/img/border.png);
  background-repeat: no-repeat;
  background-size: 100%;
  transform: rotate(30deg);
} */
</style>
