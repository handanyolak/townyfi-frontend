<template>
  <div>
    <button class="p-2 bg-red-500 rounded" @click="userMove(Direction.Up)">
      up
    </button>
    <button class="p-2 bg-red-500 rounded" @click="userMove(Direction.Right)">
      right
    </button>
    <button class="p-2 bg-red-500 rounded" @click="userMove(Direction.Down)">
      down
    </button>
    <button class="p-2 bg-red-500 rounded" @click="userMove(Direction.Left)">
      left
    </button>
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'ethers'

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

interface Coordinate {
  _x: BigNumber
  _y: BigNumber
}

const connectionStore = useConnectionStore()
const provider = connectionStore.provider
const { $kta } = useNuxtApp()
const kta = $kta(provider)

onMounted(() => {
  kta.on(
    'UserMoved',
    (user: string, oldCoordinate: Coordinate, newCoordinate: Coordinate) => {
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
