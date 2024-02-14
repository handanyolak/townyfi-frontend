<template>
  <div>
    <Accordion tooltip>
      <template #title>
        <span class="m-auto"> Teleport </span>
      </template>
      <template #tooltip>
        <span> Lorem ipsum, dolor sit amet consectetur adipisicing. </span>
      </template>

      <template #content>
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
            @click="onClickTeleport()"
          />
        </div>
      </template>
    </Accordion>
    <Accordion tooltip>
      <template #title>
        <span class="m-auto"> Attack </span>
      </template>
      <template #tooltip>
        <span> Lorem ipsum, dolor sit amet consectetur adipisicing. </span>
      </template>
      <template #content>
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
            @click="onClickAttack()"
          />
        </div>
      </template>
    </Accordion>
    <Accordion dropdown tooltip>
      <template #title>
        <span class="m-auto"> Move </span>
      </template>
      <template #tooltip>
        <span> Lorem ipsum, dolor sit amet consectetur adipisicing. </span>
      </template>

      <template #content>
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
            alt="move"
            @click="onClickMove()"
          />
        </div>
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/sidebar-items/ListItem.vue'
import { useUserGameStore } from '~/stores/userGame'
import { Direction } from '~/enums'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const userGameStore = useUserGameStore()

const { getKtaCaller } = storeToRefs(connectionStore)
const { user } = storeToRefs(userGameStore)

const appOptionsStore = useAppOptionsStore()
const { clearModalInfo, setModalInfo } = appOptionsStore

//--------[ Data ]--------//
const coordinateX = ref(user.value?.coordinate._x)
const coordinateY = ref(user.value?.coordinate._y)
const targetAddress = ref('')
const direction = ref<Direction>(Direction.Up)
const directionTarget = ref('Up')

//--------[ Methods ]--------//

//TODO: notification will be made after the transaction is confirmed
const onClickTeleport = async () => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'teleport',
    message: `Are you sure want to teleport to (${coordinateX.value}, ${coordinateY.value})?`,
  })

  if (!confirmed) {
    return
  }

  try {
    await getKtaCaller.value.callFunction('teleport', [
      {
        _x: coordinateX.value,
        _y: coordinateY.value,
      },
    ])
  } catch (error) {
    console.error('Teleport transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}

const onDropdownChanged = async (item: any) => {
  direction.value = Direction[item] as unknown as Direction
  directionTarget.value = item
}

//TODO: notification will be made after the transaction is confirmed
const onClickAttack = async () => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'attack',
    message: `Are you sure you want to attack ${targetAddress.value}?`,
  })

  if (!confirmed) {
    return
  }

  try {
    await getKtaCaller.value.callFunction('attack', [targetAddress.value])
  } catch (error) {
    console.error('Attack transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}

//TODO: notification will be made after the transaction is confirmed
const onClickMove = async () => {
  const confirmed = await setModalInfo('AnimationModal', {
    animation: 'move',
    message: `Are you sure want to move to ${directionTarget.value}?`,
  })

  if (!confirmed) {
    return
  }

  try {
    // @ts-ignore
    await getKtaCaller.value.callFunction('move', [direction.value])
  } catch (error) {
    console.error('Move transaction failed: ', error)
  } finally {
    clearModalInfo()
  }
}
</script>
