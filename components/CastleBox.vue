<template>
  <div
    class="group relative border border-dashed border-towni-brown-light-500 p-3 dark:border-[#02024c]"
  >
    <div class="absolute -top-7 flex w-full justify-between">
      <div
        class="invisible z-50 flex items-center justify-center group-hover:visible"
      >
        <div class="bg-towni-brown-light-100 font-bold dark:bg-[#040413]">
          <div
            class="bg-gradient-to-b from-[#bf841a] via-[#bf841a] to-[#ffcd74] bg-clip-text text-sm text-transparent"
          >
            <span>({{ item.x.toString() }}</span>
            <span>,</span>
            <span>{{ item.y.toString() }})</span>
          </div>
        </div>
      </div>

      <div
        class="rounded-shadow flex h-20 w-20 items-center justify-center rounded-full"
      >
        <span
          :class="{
            'bg-green-500': addresses.length <= 10,
            'bg-yellow-500': addresses.length > 10 && addresses.length < 1000,
            'bg-red-500': addresses.length >= 1000,
          }"
          class="inline-block h-1 w-1 rounded-full p-1"
        >
        </span>
      </div>
    </div>
    <!-- <div
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
    </div> -->
    <div
      class="relative flex h-5v cursor-pointer flex-col items-center justify-center"
      @click="toggleModal()"
    >
      <img
        src="@/assets/img/castle-dark.svg"
        class="hidden h-10 w-10 dark:block"
      />
      <img
        src="@/assets/img/castle-light.svg"
        class="block h-10 w-10 dark:hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserGameStore } from '~/stores/userGame'
import { CoordinateItem } from '~/types'
import { Direction } from '~/constants'

interface CastleBoxProps {
  item: CoordinateItem
}
const props = defineProps<CastleBoxProps>()

const emit = defineEmits(['modalOpened'])

const toggleModal = () => {
  emit('modalOpened', props.item)
}
const addresses = ref<string[]>([])

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
