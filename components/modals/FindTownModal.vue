<template>
  <div
    class="find-town-background flex flex-col items-center space-y-4 bg-towni-brown-light-100"
  >
    <ListTitle class="w-3/4">Find Town</ListTitle>
    <ListItem class="w-1/2" input>
      <template #title> By: </template>
      <template #item>
        <SidebarDropdown
          ref="sidebarDropdown"
          @selected="onDropdownChanged()"
          :dropdown-items="Object.values(findOptions)"
        />
      </template>
    </ListItem>
    <VForm @submit.prevent class="flex w-3/4 flex-col items-center">
      <ListItem class="w-full" input>
        <template #title> {{ selectedItem }}: </template>
        <template #item>
          <VField
            v-model="formInput[findOptions[selectedItem]]"
            :name="findOptions[selectedItem]"
            @input="setId()"
            :placeholder="placeholders[findOptions[selectedItem]]"
            :rules="rules[findOptions[selectedItem]]"
          />
          <VErrorMessage
            class="text-red-800"
            :name="findOptions[selectedItem]"
          />
        </template>
      </ListItem>
    </VForm>
    <OtherTown
      class="w-full"
      v-if="formInput[findOptions[selectedItem]] && id"
      :key="id.toString()"
      :id="id"
    />
    <div v-if="id === BigInt(0)">town not found</div>
  </div>
</template>

<script setup lang="ts">
import { object } from 'yup'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import SidebarDropdown from '~/components/SidebarDropdown.vue'
import OtherTown from '~/components/OtherTown.vue'
import { useDebounceFn } from '@vueuse/core'
import {
  getAddressRule,
  getUintRule,
  getCoordinateRule,
} from '~/composables/useYupRules'
import { ZeroAddress } from 'ethers'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const { getKta } = storeToRefs(connectionStore)

//--------[ Data ]--------//
const sidebarDropdown = ref<InstanceType<typeof SidebarDropdown> | null>(null)
enum FindOptions {
  ID = 'ID',
  Address = 'Address',
  Coordinate = 'Coordinate',
}
const findOptions = FindOptions
const id = ref<bigint | null>(null)
const rules = {
  [FindOptions.ID]: getUintRule({
    required: true,
  }),
  [FindOptions.Address]: getAddressRule({
    required: true,
  }),
  [FindOptions.Coordinate]: getCoordinateRule({
    required: true,
  }),
}
const placeholders = {
  [FindOptions.ID]: '0',
  [FindOptions.Address]: ZeroAddress,
  [FindOptions.Coordinate]: '0,0',
}
const selectedItem = computed<FindOptions>(
  () =>
    (sidebarDropdown.value?.selectedItem as FindOptions) ||
    Object.keys(findOptions)[0]
)
const selectedItemFormInput = computed(() =>
  reactive({
    [findOptions[selectedItem.value]]: '',
  })
)
const formInput = selectedItemFormInput.value
const selectedItemFormRules = computed(() =>
  object().shape({
    [findOptions[selectedItem.value]]: rules[findOptions[selectedItem.value]],
  })
)
const formIsValid = computed(() =>
  selectedItemFormRules.value.isValidSync(formInput)
)

const onDropdownChanged = async () => {
  id.value = null
  formInput[findOptions[selectedItem.value]] = ''
}

const debouncedSetId = useDebounceFn(async () => {
  if (formIsValid.value) {
    const value = formInput[findOptions[selectedItem.value]]
    switch (selectedItem.value) {
      case findOptions.ID:
        const townInfo = await getKta.value.townById(value)
        id.value = townInfo.leader === ZeroAddress ? BigInt(0) : BigInt(value)
        break

      case findOptions.Address:
        const userInfo = await getKta.value.userByAddr(value)
        id.value = userInfo.townInfo.townId
        break

      case findOptions.Coordinate:
        const coordinates = value.split(',')
        // @ts-ignore
        id.value = await getKta.value.townIdByCoordinate(...coordinates)
        break
    }
  }
}, 500)

const setId = () => {
  id.value = null
  debouncedSetId()
}
</script>

<style scoped>
.find-town-background {
  background-image: url('~/assets/img/treasure-map.svg');
  background-repeat: no-repeat;
  background-position-x: center;
}
</style>
