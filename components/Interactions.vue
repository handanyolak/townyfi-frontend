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
          alt="teleport"
          @click="teleport()"
        />
      </div>
    </Accordion>
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
          <span class="m-auto">Attack</span>
        </div>
      </template>
      <div class="flex">
        <ListItem input>
          <template #title> Address: </template>
          <template #item>
            <input v-model="targetAddress" type="text" />
          </template>
          <span>{{ targetAddress }}</span>
        </ListItem>
        <img
          class="cursor-pointer"
          src="@/assets/img/check.svg"
          alt="attack"
          @click="attack()"
        />
      </div>
    </Accordion>
    <Accordion dropdown>
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
          <span class="m-auto">Move</span>
        </div>
      </template>
      <div class="flex">
        <ListItem input>
      <template #title> Direction: </template>
      <template #item>
        <SidebarDropdown
          @selected="(item: string) => onDropdownChanged(item)"
          :dropdown-items="enumKeys(Direction)"
        />
      </template>
    </ListItem>
        <img
          class="cursor-pointer"
          src="@/assets/img/check.svg"
          alt="attack"
          @click="move()"
        />
      </div>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/sidebar-items/ListItem.vue'
import Tooltip from '~/components/Tooltip.vue'
import { useUserGameStore } from '~/stores/userGame'
import { Direction } from '~/enums'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { getKtaCaller } = storeToRefs(connectionStore)
const { user } = storeToRefs(userGameStore)

//--------[ Data ]--------//
const coordinateX = ref(user.value?.coordinate._x)
const coordinateY = ref(user.value?.coordinate._y)
const targetAddress = ref('')
const direction = ref<Direction>(Direction.Up)

//--------[ Methods ]--------//
const teleport = async () => {
  getKtaCaller.value.callFunction('teleport', [{
    _x: coordinateX.value,
    _y: coordinateY.value,
  }])
}

const onDropdownChanged = async (item: any ) => {
  direction.value = Direction[item] as unknown as Direction
}

const attack = async () => {
  getKtaCaller.value.callFunction('attack', [targetAddress.value])
}

const move = async () => {
  getKtaCaller.value.callFunction('move', [direction.value])
}
</script>
