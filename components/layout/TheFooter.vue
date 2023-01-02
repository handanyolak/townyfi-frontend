<template>
  <div>
    <button class="rounded bg-red-500 p-2" @click="userMove(Direction.Up)">
      up
    </button>
    <button class="rounded bg-red-500 p-2" @click="userMove(Direction.Right)">
      right
    </button>
    <button class="rounded bg-red-500 p-2" @click="userMove(Direction.Down)">
      down
    </button>
    <button class="rounded bg-red-500 p-2" @click="userMove(Direction.Left)">
      left
    </button>
  </div>
</template>

<script setup lang="ts">
import { Coordinates } from '~/types/typechain-types/contracts/game/KillThemAll'

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

const connectionStore = useConnectionStore()
const kta = useKta()

onMounted(() => {
  kta.on(
    'UserMoved',
    (
      user: string,
      oldCoordinate: Coordinates.CoordinateStructOutput,
      newCoordinate: Coordinates.CoordinateStructOutput
    ) => {
      console.log(`user: ${user}`)
      console.log(`oldCoordinate: ${oldCoordinate}`)
      console.log(`newCoordinate: ${newCoordinate}`)
    }
  )
})

const userMove = async (direction: Direction) => {
  console.log(direction)
  try {
    await kta.connect(connectionStore.signer).move(direction)
  } catch (error) {
    console.log(error)
  }
}
</script>
