<template>
  <div>
    <Transition name="map-navigation">
      <div
        v-show="isMapNavigationVisible"
        :style="`height: ${height}px`"
        :class="[
          'absolute -right-52 top-0 transition-all duration-300 ease-in-out',
          isMapNavigationVisible ? '' : '-translate-x-52',
        ]"
      >
        <div class="flex h-full w-52 flex-col justify-between bg-[#5a3006] p-2">
          <div class="move">
            <ListTitle class="shadow-md shadow-towni-brown-dark-400"
              ><span class="text-sm">Move</span></ListTitle
            >
            <div class="relative mt-6 flex items-center justify-center p-10">
              <MoveArrow
                class="rotate-90"
                @click="navigateByArrow(NavigateDirection.Down)"
              />
              <MoveArrow
                class="-rotate-90"
                @click="navigateByArrow(NavigateDirection.Up)"
              />
              <MoveArrow
                class="rotate-0"
                @click="navigateByArrow(NavigateDirection.Right)"
              />
              <MoveArrow
                class="rotate-180"
                @click="navigateByArrow(NavigateDirection.Left)"
              />
              <MoveArrow
                class="rotate-45"
                @click="navigateByArrow(NavigateDirection.RightDown)"
              />
              <MoveArrow
                class="-rotate-45"
                @click="navigateByArrow(NavigateDirection.UpRight)"
              />
              <MoveArrow
                class="rotate-[135deg]"
                @click="navigateByArrow(NavigateDirection.DownLeft)"
              />
              <MoveArrow
                class="-rotate-[135deg]"
                @click="navigateByArrow(NavigateDirection.LeftUp)"
              />
            </div>
          </div>
          <div class="zoom">
            <ListTitle class="text-sm shadow-md shadow-towni-brown-dark-400"
              >Zoom in / out</ListTitle
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
            <AppButton
              class="my-2 w-full rounded-md bg-towni-brown-dark-400 text-towni-brown-light-400"
              @click="goBackToInitialPosition()"
            >
              Recenter!
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
                  class="w-full rounded-md bg-towni-brown-dark-400 text-towni-brown-light-400"
                  @click="navigate()"
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
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import MoveArrow from '~/components/MoveArrow.vue'
import AppButton from '~/components/AppButton.vue'

// --------[ Props & Emits ]-------- //
defineProps({
  height: {
    type: String,
    default: '200px',
  },
  isMapNavigationVisible: Boolean,
})

// --------[ Stores ]-------- //
const appOptionsStore = useAppOptionsStore()
const userGameStore = useUserGameStore()

const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { originCoordinate } = storeToRefs(appOptionsStore)
const { nearLevel, user } = storeToRefs(userGameStore)

// --------[ Data ]-------- //
const coordinateX = ref('')
const coordinateY = ref('')

// --------[ Methods ]-------- //
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
