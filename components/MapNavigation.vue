<template>
  <div>
    <Transition name="map-navigation">
      <div
        :style="`height: ${height}px`"
        :class="[
          'absolute top-0 -right-52  transition-all duration-300 ease-in-out',
          isMapNavigation ? '' : '-translate-x-52',
        ]"
      >
        <img
          :class="[
            'absolute top-0 -right-4 h-3 w-3 transform cursor-pointer transition-transform duration-200 ease-in-out',
            isMapNavigation ? 'rotate-180' : '',
          ]"
          src="@/assets/img/multiple-arrow.svg"
          @click="isMapNavigation = !isMapNavigation"
        />
        <div class="flex h-full w-52 flex-col justify-between bg-[#391f05] p-2">
          <div class="move">
            <ListTitle class="shadow-md shadow-towni-brown-dark-400"
              ><span class="text-sm">Move</span></ListTitle
            >
            <div class="relative mt-6 flex items-center justify-center p-10">
              <MoveArrow
                @click="navigateByArrow(Direction.Down)"
                class="rotate-90"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.Up)"
                class="-rotate-90"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.Right)"
                class="rotate-0"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.Left)"
                class="rotate-180"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.RightDown)"
                class="rotate-45"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.UpRight)"
                class="-rotate-45"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.DownLeft)"
                class="rotate-[135deg]"
              />
              <MoveArrow
                @click="navigateByArrow(Direction.LeftUp)"
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
          <div class="teleport">
            <ListTitle class="text-sm shadow-md shadow-towni-brown-dark-400"
              >Teleport</ListTitle
            >
            <div class="flex items-center rounded-md p-1">
              <div class="flex flex-col">
                <ListItem class="shadow-none" input>
                  <template #title> X: </template>
                  <template #item>
                    <input v-model="coordinateX" type="text" />
                  </template>
                  <span>{{ coordinateX }}</span>
                </ListItem>
                <ListItem class="shadow-none" input>
                  <template #title> Y: </template>
                  <template #item>
                    <input v-model="coordinateY" type="text" />
                  </template>
                  <span>{{ coordinateY }}</span>
                </ListItem>
                <AppButton
                  @click="teleport()"
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
import { Direction } from '~/enums'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import MoveArrow from '~/components/MoveArrow.vue'

//--------[ Props & Emits ]--------//
defineProps({
  height: {
    default: '200px',
  },
})

//--------[ Stores ]--------//
const appOptionsStore = useAppOptionsStore()
const userGameStore = useUserGameStore()

const { setUserCoordinate, setNearLevelByCalculatingCoordinates } =
  userGameStore

const { originCoordinate } = storeToRefs(appOptionsStore)
const { nearLevel } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const coordinateX = ref('')
const coordinateY = ref('')
const isMove = ref(-1)
const isMapNavigation = ref(false)

//--------[ Methods ]--------//
const teleport = () => {
  setUserCoordinate({
    _x: BigInt(coordinateX.value),
    _y: BigInt(coordinateY.value),
  })
}

const navigateByArrow = (direction: Direction) => {
  // TODO:Ethers try this
  let { _x, _y } = originCoordinate.value

  const navigateValue = 1n
  if (direction === Direction.Up) {
    _y += navigateValue
  } else if (direction === Direction.UpRight) {
    _x += navigateValue
    _y += navigateValue
  } else if (direction === Direction.Right) {
    _x += navigateValue
  } else if (direction === Direction.RightDown) {
    _x += navigateValue
    _y -= navigateValue
  } else if (direction === Direction.Down) {
    _y -= navigateValue
  } else if (direction === Direction.DownLeft) {
    _x -= navigateValue
    _y -= navigateValue
  } else if (direction === Direction.Left) {
    _x -= navigateValue
  } else if (direction === Direction.LeftUp) {
    _x -= navigateValue
    _y += navigateValue
  } else {
    console.log('selam')
    // TODO: Throw exception etc.
  }

  setUserCoordinate({
    _x,
    _y,
  })
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
