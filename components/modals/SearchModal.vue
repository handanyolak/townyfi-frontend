<template>
  <div
    class="flex flex-col items-center space-y-4 bg-towni-brown-light-100 px-4 py-2"
  >
    <ListTitle class="w-3/4">Search</ListTitle>
    <div class="flex w-full space-x-2">
      <ListItem class="w-full" title="Type:" input>
        <template #item>
          <SidebarDropdown
            ref="searchTypeDropdown"
            :dropdown-items="Object.values(searchOptions)"
            @selected="handleSearchTypeChange"
          />
        </template>
      </ListItem>

      <ListItem class="w-full" title="By:" input>
        <template #item>
          <SidebarDropdown
            ref="sidebarDropdown"
            :dropdown-items="dynamicFindOptions"
            @selected="handleDropdownChange()"
          />
        </template>
      </ListItem>
    </div>
    <VeeForm class="flex w-3/4 flex-col items-center" @submit.prevent>
      <ListItem class="w-full" :title="`${selectedItem}:`" input>
        <template #item>
          <VeeField
            v-model="searchFormInput[findOptions[selectedItem]]"
            :name="findOptions[selectedItem]"
            :placeholder="placeholders[findOptions[selectedItem]]"
            :rules="rules[findOptions[selectedItem]]"
            @input="search()"
          />
          <VeeErrorMessage
            class="text-red-800"
            :name="findOptions[selectedItem]"
          />
        </template>
      </ListItem>
    </VeeForm>
    <TheLoading v-if="isDataLoading" />
    <OtherTown
      v-if="
        searchFormInput[findOptions[selectedItem]] &&
        selectedItemId &&
        currentSearchType === 'Town'
      "
      :id="selectedItemId"
      :key="selectedItemId.toString()"
      class="w-full"
    />
    <OtherUser
      v-if="
        currentSearchType === SearchType.User &&
        selectedItem === 'Address' &&
        currentUserAddress
      "
      class="w-full"
      :address="currentUserAddress"
    />

    <div
      v-if="
        currentSearchType === SearchType.User &&
        selectedItem === 'Coordinate' &&
        userAddressList.length > 0
      "
    >
      <Accordion
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
    </div>

    <div v-if="isTownUnavailable">town not found</div>
  </div>
</template>

<script setup lang="ts">
import { zeroAddress, type Address } from 'viem'
import { useDebounceFn } from '@vueuse/core'
import { object } from 'yup'
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
import {
  getAddressRule,
  getUintRule,
  getCoordinateRule,
} from '~/composables/useYupRules'
import { transformTown, transformUser } from '~/transformers'

// --------[ Stores ]-------- //
const contractStore = useContractStore()

const { getKta } = storeToRefs(contractStore)

// --------[ Data ]-------- //
const sidebarDropdown = ref<InstanceType<typeof SidebarDropdown> | null>(null)
const currentSearchType = ref<SearchType>(SearchType.Town)
const currentUserAddress = ref<Address | null>(null)
const selectedAddress = ref<string | null>(null)
const userAddressList = ref<readonly Address[]>([])
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
  [FindOptions.Address]: zeroAddress,
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

const handleDropdownChange = () => {
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
      return object()
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
  const townInfo = transformTown(
    await getKta.value.read.townById([BigInt(value)]),
  )
  return townInfo.leader === zeroAddress ? BigInt(0) : BigInt(value)
}

const getUserDetailsByAddress = async (address: Address) => {
  const userInfo = transformUser(await getKta.value.read.userByAddr([address]))
  return userInfo.townInfo.townId
}

const getTownIdByCoordinates = async (value: string) => {
  const coordinates = value
    .split(',')
    .map((coordinate) => BigInt(coordinate.trim())) as unknown as Readonly<
    [bigint, bigint]
  >

  return await getKta.value.read.townIdByCoordinate(coordinates)
}

const loadUserDetailsByAddress = (address: Address) => {
  currentUserAddress.value = address
}

const getAddressesByCoordinates = async (coordinateValue: string) => {
  const [x, y] = coordinateValue.split(',').map((coord) => BigInt(coord.trim()))
  const coordinates = { _x: x, _y: y }
  return await getKta.value.read.getAddressesByCoordinate([coordinates])
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
          selectedItemId.value = await getUserDetailsByAddress(value as Address)
          break
        case FindOptions.Coordinate:
          selectedItemId.value = await getTownIdByCoordinates(value)
          break
      }
    } else if (currentSearchType.value === SearchType.User) {
      switch (selectedItem.value) {
        case FindOptions.Address:
          loadUserDetailsByAddress(value as Address)
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
