<template>
  <div>
    <Accordion>
      <template #title>
        <div class="group flex">
          <Tooltip class="self-center">
            <template #tooltip-image>
              <img
                class="mr-1 h-3 w-3 cursor-pointer opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                src="@/assets/img/information.svg"
              />
            </template>
            <span
              >Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aspernatur, deserunt!</span
            >
          </Tooltip>
          <span class="m-auto">Teleport</span>
        </div>
      </template>
      <div class="flex">
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
        <img
          class="cursor-pointer"
          src="@/assets/img/check.svg"
          alt="save"
          @click="teleport()"
        />
      </div>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { useUserGameStore } from '~/stores/userGame'
import Tooltip from '~/components/Tooltip.vue'

const kta = useKta()
const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)

const coordinateX = ref(user.value?.coordinate._x)
const coordinateY = ref(user.value?.coordinate._y)

const teleport = async () => {
  await kta.teleport({
    _x: coordinateX.value,
    _y: coordinateY.value,
  })
}
</script>
