<template>
  <div>
    <Accordion>
      <template #title>
        <div>Teleport</div>
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

const kta = useKta()
const userGameStore = useUserGameStore()
const { user } = storeToRefs(userGameStore)

const coordinateX = user.value?.coordinate._x
const coordinateY = user.value?.coordinate._y

const teleport = async () => {
  await kta.teleport({
    _x: coordinateX,
    _y: coordinateY,
  })
}
</script>
