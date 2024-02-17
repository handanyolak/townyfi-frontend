<template>
  <div
    class="flex flex-col items-center space-y-4 bg-towni-brown-light-100 py-2 px-4"
  >
    <ListTitle class="w-3/4">Search</ListTitle>
    <div class="flex w-full space-x-2">
      <ListItem class="w-full" title="Type:" input>
        <template #item>
          <SidebarDropdown
            ref="searchTypeDropdown"
            @selected="handleSearchTypeChange"
            :dropdown-items="Object.values(searchOptions)"
          />
        </template>
      </ListItem>

      <ListItem class="w-full" title="By:" input>
        <template #item>
          <SidebarDropdown
            ref="sidebarDropdown"
            @selected="handleDropdownChange()"
            :dropdown-items="dynamicFindOptions"
          />
        </template>
      </ListItem>
    </div>
    <VForm @submit.prevent class="flex w-3/4 flex-col items-center">
      <ListItem class="w-full" :title="`${selectedItem}:`" input>
        <template #item>
          <VField
            v-model="searchFormInput[findOptions[selectedItem]]"
            :name="findOptions[selectedItem]"
            @input="search()"
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
    <TheLoading v-if="isDataLoading" />
    <OtherTown
      class="w-full"
      v-if="
        searchFormInput[findOptions[selectedItem]] &&
        selectedItemId &&
        currentSearchType === 'Town'
      "
      :key="selectedItemId.toString()"
      :id="selectedItemId"
    />
    <OtherUser
      class="w-full"
      v-if="
        currentSearchType === SearchType.User &&
        selectedItem === 'Address' &&
        currentUserAddress
      "
      :address="currentUserAddress"
    />

    <Accordion
      v-if="
        currentSearchType === SearchType.User &&
        selectedItem === 'Coordinate' &&
        userAddressList.length > 0
      "
      v-for="(_address, index) in userAddressList"
      :key="index"
      class="w-full"
      tooltip
    >
      <template #title>
        <div class="flex items-center py-1">
          <div class="text-xs" @click="selectedAddress = _address">
            {{ _address }}
          </div>
        </div>
      </template>
      <template #content>
        <OtherUser v-if="selectedAddress === _address" :address="_address" />
      </template>
    </Accordion>

    <div v-if="isTownUnavailable">town not found</div>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import SidebarDropdown from '~/components/SidebarDropdown.vue'
import OtherTown from '~/components/OtherTown.vue'
import OtherUser from '~/components/OtherUser.vue'
import TheLoading from '~/components/TheLoading.vue'
import { SearchType, FindOptions } from '~/enums'
import {
  idValidationSchema,
  addressValidationSchema,
  coordinateValidationSchema,
} from '~/validations/'
import { useDebounceFn } from '@vueuse/core'
import * as yup from 'yup'
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
const currentSearchType = ref<SearchType>(SearchType.Town)
const currentUserAddress = ref<string | null>(null)
const selectedAddress = ref<string | null>(null)
const userAddressList = ref<string[]>([])
const selectedItemId = ref<bigint | null>(null)
const searchOptions = SearchType
const findOptions = FindOptions
const isDataLoading = ref(false)

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

const searchFormInput = reactive({
  [FindOptions.ID]: '',
  [FindOptions.Address]: '',
  [FindOptions.Coordinate]: '',
})

const selectedItem = computed<FindOptions>(() => {
  if (currentSearchType.value === SearchType.User) {
    return (
      (sidebarDropdown.value?.selectedItem as FindOptions) ||
      FindOptions.Address
    )
  } else {
    return (
      (sidebarDropdown.value?.selectedItem as FindOptions) || FindOptions.ID
    )
  }
})

const isTownUnavailable = computed(() => selectedItemId.value === BigInt(0))

const handleSearchTypeChange = (selectedValue: SearchType) => {
  resetSearchCriteria()
  currentSearchType.value = selectedValue
  Object.keys(searchFormInput).forEach((key) => {
    const formKey = key as keyof typeof searchFormInput
    searchFormInput[formKey] = ''
  })
}

const dynamicFindOptions = computed(() => {
  if (currentSearchType.value === SearchType.Town) {
    return Object.values({
      ID: FindOptions.ID,
      Address: FindOptions.Address,
      Coordinate: FindOptions.Coordinate,
    })
  } else if (currentSearchType.value === SearchType.User) {
    return Object.values({
      Address: FindOptions.Address,
      Coordinate: FindOptions.Coordinate,
    })
  }
  return []
})

const handleDropdownChange = async () => {
  resetSearchCriteria()
  searchFormInput[findOptions[selectedItem.value]] = ''
}

const selectedItemSchema = computed(() => {
  switch (selectedItem.value) {
    case 'ID':
      return idValidationSchema
    case 'Address':
      return addressValidationSchema
    case 'Coordinate':
      return coordinateValidationSchema
    default:
      return yup.object()
  }
})

const formIsValid = computed(() => {
  const schema = selectedItemSchema.value
  try {
    schema.validateSync(searchFormInput, { abortEarly: false })
    return true
  } catch (error) {
    return false
  }
})

const getTownDetailsById = async (value: string) => {
  const townInfo = await getKta.value.townById(BigInt(value))
  return townInfo.leader === ZeroAddress ? BigInt(0) : BigInt(value)
}

const getUserDetailsByAddress = async (value: string) => {
  const userInfo = await getKta.value.userByAddr(value)
  return userInfo.townInfo.townId
}

const getTownIdByCoordinates = async (value: string) => {
  const coordinates = value.split(',')
  //TODO:  Add error handling if coordinates cannot be parsed correctly.
  // @ts-ignore
  return await getKta.value.townIdByCoordinate(...coordinates)
}

const loadUserDetailsByAddress = async (address: string) => {
  currentUserAddress.value = address
}

const getAddressesByCoordinates = async (coordinateValue: string) => {
  const [x, y] = coordinateValue.split(',').map((coord) => BigInt(coord.trim()))
  const coordinates = { _x: x, _y: y }
  return await getKta.value.getAddressesByCoordinate(coordinates)
}

const debouncedSearch = useDebounceFn(async () => {
  if (!formIsValid.value) return
  isDataLoading.value = true
  const value = searchFormInput[findOptions[selectedItem.value]]
  try {
    if (currentSearchType.value === SearchType.Town) {
      switch (selectedItem.value) {
        case FindOptions.ID:
          selectedItemId.value = await getTownDetailsById(value)
          break
        case FindOptions.Address:
          selectedItemId.value = await getUserDetailsByAddress(value)
          break
        case FindOptions.Coordinate:
          selectedItemId.value = await getTownIdByCoordinates(value)
          break
      }
    } else if (currentSearchType.value === SearchType.User) {
      switch (selectedItem.value) {
        case FindOptions.Address:
          await loadUserDetailsByAddress(value)
          break
        case FindOptions.Coordinate:
          userAddressList.value = await getAddressesByCoordinates(value)
          break
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isDataLoading.value = false
  }
}, 500)

const search = () => {
  resetSearchCriteria()
  debouncedSearch()
}
const resetSearchCriteria = () => {
  selectedItemId.value = null
  currentUserAddress.value = null
  selectedAddress.value = null
  userAddressList.value = []
}
</script>
