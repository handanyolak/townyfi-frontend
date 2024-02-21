<template>
  <div>
    <Transition name="map-navigation">
      <div
        v-show="isMapNavigationVisible"
        :style="`height: ${height}px`"
        :class="[
          'absolute top-0 -right-52 transition-all duration-300 ease-in-out',
          isMapNavigationVisible ? '' : '-translate-x-52',
        ]"
      >
        <div class="flex h-full w-52 flex-col justify-between bg-[#391f05] p-2">
          <div class="move">
            <ListTitle class="shadow-md shadow-towni-brown-dark-400"
              ><span class="text-sm">Move</span></ListTitle
            >
            <div class="relative mt-6 flex items-center justify-center p-10">
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.Down)"
                class="rotate-90"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.Up)"
                class="-rotate-90"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.Right)"
                class="rotate-0"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.Left)"
                class="rotate-180"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.RightDown)"
                class="rotate-45"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.UpRight)"
                class="-rotate-45"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.DownLeft)"
                class="rotate-[135deg]"
              />
              <MoveArrow
                @click="navigateByArrow(NavigateDirection.LeftUp)"
                class="-rotate-[135deg]"
              />
            </div>
          </div>
          <div class="zoom">
            <ListTitle class="text-sm shadow-md shadow-towni-brown-dark-400"
              >Zoom in / Zoom out</ListTitle
            >
            <div class="flex justify-around">
              <button
                @click="setNearLevelByCalculatingCoordinates(nearLevel - 1)"
              >
                <img
                  class="h-12 w-12"
                  src="@/assets/img/zoom-in.svg"
                  alt="zoom-in"
                />
              </button>
              <button
                @click="setNearLevelByCalculatingCoordinates(nearLevel + 1)"
              >
                <img
                  class="h-12 w-12"
                  src="@/assets/img/zoom-out.svg"
                  alt="zoom-out"
                />
              </button>
            </div>
          </div>
          <div class="return-back">
            <ListTitle class="shadow-md shadow-towni-brown-dark-400"
              ><span class="text-sm">Return To Start Location</span></ListTitle
            >
            <AppButton
              @click="goBackToInitialPosition()"
              class="my-2 w-full rounded-md bg-towni-brown-dark-400 text-towni-brown-light-400"
            >
              Return!
            </AppButton>
          </div>
          <div class="navigate">
            <ListTitle class="text-sm shadow-md shadow-towni-brown-dark-400"
              >Navigate</ListTitle
            >
            <div class="flex items-center rounded-md p-1">
              <div class="flex flex-col">
                <ListItem class="shadow-none" title="X:" input>
                  <template #item>
                    <input v-model="coordinateX" type="text" />
                  </template>
                  <span>{{ coordinateX }}</span>
                </ListItem>
                <ListItem class="shadow-none" title="Y:" input>
                  <template #item>
                    <input v-model="coordinateY" type="text" />
                  </template>
                  <span>{{ coordinateY }}</span>
                </ListItem>
                <AppButton
                  @click="navigate()"
                  class="w-full rounded-md bg-towni-brown-dark-400 text-towni-brown-light-400"
                >
                  Go!
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { NavigateDirection } from '~/enums'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import MoveArrow from '~/components/MoveArrow.vue'
import AppButton from '~/components/AppButton.vue'

//--------[ Props & Emits ]--------//
defineProps({
  height: {
    type: String,
    default: '200px',
  },
  isMapNavigationVisible: Boolean,
})

//--------[ Stores ]--------//
const appOptionsStore = useAppOptionsStore()
const userGameStore = useUserGameStore()

const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { originCoordinate } = storeToRefs(appOptionsStore)
const { nearLevel, user } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const coordinateX = ref('')
const coordinateY = ref('')

//--------[ Methods ]--------//
const navigate = () => {
  setUserCoordinate({
    _x: BigInt(coordinateX.value),
    _y: BigInt(coordinateY.value),
  })
}

const goBackToInitialPosition = () => {
  setUserCoordinate({
    _x: BigInt(user.value.coordinate._x.toString()),
    _y: BigInt(user.value.coordinate._y.toString()),
  })
}

const navigateByArrow = (direction: NavigateDirection) => {
  // TODO: Ethers try this
  let { _x, _y } = originCoordinate.value
  const navigateValue = 1n

  switch (direction) {
    case NavigateDirection.Up:
      _y += navigateValue
      break
    case NavigateDirection.UpRight:
      _x += navigateValue
      _y += navigateValue
      break
    case NavigateDirection.Right:
      _x += navigateValue
      break
    case NavigateDirection.RightDown:
      _x += navigateValue
      _y -= navigateValue
      break
    case NavigateDirection.Down:
      _y -= navigateValue
      break
    case NavigateDirection.DownLeft:
      _x -= navigateValue
      _y -= navigateValue
      break
    case NavigateDirection.Left:
      _x -= navigateValue
      break
    case NavigateDirection.LeftUp:
      _x -= navigateValue
      _y += navigateValue
      break
    default:
      console.error('Invalid navigation direction')
  }

  setUserCoordinate({ _x, _y })
}
</script>

<style>
.map-navigation-enter-active,
.map-navigation-leave-active {
  transition: transform 0.8s ease;
}

.map-navigation-enter-from,
.map-navigation-leave-to {
  transform: translateX(-100%);
  transition: all 0.3s ease-out;
}
</style>
