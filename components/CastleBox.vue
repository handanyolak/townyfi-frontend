<template>
  <div
    class="relative rounded-xl bg-[#fffcf8] p-5 shadow-lg shadow-towni-brown-light-200 duration-300 dark:bg-night-blue dark:shadow-sky-900"
  >
    <div class="absolute -top-5 flex w-full justify-between">
      <div
        class="flex items-center justify-center bg-gradient-to-b from-[#bf841a] via-[#bf841a] to-[#ffcd74] bg-clip-text text-sm text-transparent"
      >
        <div>
          <span>({{ item.x.toString() }}</span>
          <span>,</span>
          <span>{{ item.y.toString() }})</span>
        </div>
      </div>

      <div
        class="rounded-shadow flex h-20 w-20 items-center justify-center rounded-full"
      >
        <span
          :class="{
            'bg-green-500': item.addresses.length <= 10,
            'bg-yellow-500':
              item.addresses.length > 10 && item.addresses.length < 1000,
            'bg-red-500': item.addresses.length >= 1000,
          }"
          class="inline-block h-1 w-1 rounded-full p-1"
        >
        </span>
      </div>
    </div>
    <div
      v-if="
        item.x.toString() === userGameStore.user.coordinate._x.toString() &&
        item.y.toString() === userGameStore.user.coordinate._y.toString()
      "
      class="z-50"
    >
      <div
        :class="[
          'arrow top-[1%] left-[50%] z-10 mx-5 -rotate-90',
          isMove === 0 ? 'w-16' : 'w-4',
        ]"
        @click="userMove(Direction.Up)"
      ></div>
      <div
        :class="[
          'arrow top-[50%] left-[99%] z-10 my-5 rotate-0',
          isMove === 1 ? 'w-16' : 'w-4',
        ]"
        @click="userMove(Direction.Right)"
      ></div>
      <div
        :class="[
          'arrow bottom-[2%] left-[50%] z-10 mx-5 rotate-90',
          isMove === 2 ? 'w-16' : 'w-4',
        ]"
        @click="userMove(Direction.Down)"
      ></div>
      <div
        :class="[
          'arrow top-[50%] left-[2%] z-10 my-5 rotate-180',
          isMove === 3 ? 'w-16' : 'w-4',
        ]"
        @click="userMove(Direction.Left)"
      ></div>
    </div>
    <div
      class="relative flex h-20v flex-col items-center bg-castle-light bg-contain bg-center bg-no-repeat dark:bg-castle-dark"
    >
      <button @click="toggleModal()">
        <img
          class="visible absolute bottom-[2%] h-10 w-10 dark:invisible"
          src="@/assets/img/knight.svg"
          alt="soldier"
        />
        <img
          class="invisible absolute bottom-[2%] h-10 w-10 dark:visible"
          src="@/assets/img/soldier.svg"
          alt="soldier"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserGameStore } from '~/stores/userGame'
import { CoordinateItem } from '~/types'

enum Direction {
  Up,
  Right,
  Down,
  Left,
}
interface CastleBoxProps {
  item: CoordinateItem
}
const props = defineProps<CastleBoxProps>()

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}
const userGameStore = useUserGameStore()
const connectionStore = useConnectionStore()
const kta = useKta()
const isMove = ref(-1)

const userMove = async (direction: Direction) => {
  isMove.value = direction
  try {
    await kta.connect(connectionStore.signer).move(direction)
    isMove.value = -1
  } catch (error) {
    isMove.value = -1
    console.log(error)
  }
}
</script>

<style>
.arrow {
  @apply absolute h-2  origin-left transform cursor-pointer bg-gradient-to-tl from-towni-brown-dark-200  to-towni-brown-light-400 transition-all duration-300 ease-in-out before:absolute before:-right-3 before:-top-2 before:bottom-0 before:h-0 before:w-0 before:border-t-12 before:border-b-12 before:border-l-18 before:border-towni-brown-dark-100 before:border-b-transparent before:border-t-transparent;
}

.rounded-shadow {
  background: radial-gradient(
    circle,
    hsla(0, 0%, 83.9%, 0.3) 0,
    hsla(0, 0%, 90.6%, 0) 30%
  );
}
</style>
