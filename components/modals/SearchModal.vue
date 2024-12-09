<template>
  <div
    class="flex flex-col items-center space-y-4 bg-towny-brown-light-100 px-4 py-2"
  >
    <ListTitle class="my-8 w-3/4">Search</ListTitle>
    <div class="flex w-full space-x-2">
      <ListItem class="w-full" title="Type:">
        <template #item>
          <AppDropdown
            v-model="currentSearchType"
            :select="currentSearchType"
            :dropdown-items="Object.values(searchOptions)"
            @selected="handleSearchTypeChange"
          />
        </template>
      </ListItem>

      <ListItem class="w-full" title="By:">
        <template #item>
          <AppDropdown
            :key="currentSearchType"
            v-model="currentFindOption"
            :select="
              dynamicFindOptions.includes(currentFindOption)
                ? currentFindOption
                : dynamicFindOptions[0]
            "
            :dropdown-items="dynamicFindOptions"
            @selected="handleDropdownChange"
          />
        </template>
      </ListItem>
    </div>
    <VeeForm class="flex w-3/4 flex-col items-center" @submit.prevent>
      <ListItem class="w-full" :title="`${currentFindOption}:`">
        <template #item>
          <VeeField
            v-model="searchFormInput[findOptions[currentFindOption]]"
            :name="findOptions[currentFindOption]"
            :placeholder="placeholders[findOptions[currentFindOption]]"
            :rules="rules[findOptions[currentFindOption]]"
            @input="search()"
          />
          <VeeErrorMessage
            class="text-red-800"
            :name="findOptions[currentFindOption]"
          />
        </template>
      </ListItem>
    </VeeForm>
    <TheLoading v-if="isDataLoading" />
    <OtherTown
      v-if="
        searchFormInput[findOptions[currentFindOption]] &&
        foundTownId &&
        currentSearchType === SearchType.Town
      "
      :id="foundTownId"
      :key="foundTownId.toString()"
      class="w-full"
    />
    <OtherUser
      v-if="
        currentSearchType === SearchType.User &&
        currentFindOption === FindOptions.Address &&
        currentUserAddress
      "
      class="w-full"
      :address="currentUserAddress"
    />

    <div
      v-if="
        currentSearchType === SearchType.User &&
        currentFindOption === FindOptions.Coordinate &&
        userAddressList.length > 0
      "
      class="w-full"
    >
      <Accordion
        v-for="(_address, index) in userAddressList"
        :key="index"
        class="w-full"
      >
        <template #title>
          <div
            class="flex w-full items-center py-1"
            @click="selectedAddress = _address"
          >
            <div class="text-xs">
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
import ListItem from '~/components/common/ListItem.vue'
import ListTitle from '~/components/common/ListTitle.vue'
import AppDropdown from '~/components/common/AppDropdown.vue'
import OtherTown from '~/components/OtherTown.vue'
import OtherUser from '~/components/OtherUser.vue'
import TheLoading from '~/components/common/TheLoading.vue'
import Accordion from '~/components/common/Accordion.vue'

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

// --------[ Props & Emits ]-------- //
interface SearchModalProps {
  searchType?: SearchType
  findBy?: FindOptions
  findInputText?: string | bigint
}

const props = withDefaults(defineProps<SearchModalProps>(), {
  searchType: SearchType.Town,
  findBy: FindOptions.ID,
  findInputText: '',
})
console.log(props)

// --------[ Store ]-------- //
const contractStore = useContractStore()

const { getKtaPublic } = storeToRefs(contractStore)

// --------[ Data ]-------- //
const currentSearchType = ref(props.searchType)
const currentFindOption = ref(props.findBy)
const currentUserAddress = ref<Address | null>(null)
const userAddressList = ref<readonly Address[]>([])
const selectedAddress = ref<string | null>(null)
const foundTownId = ref<bigint | null>(null)
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
searchFormInput[findOptions[currentFindOption.value]] =
  props.findInputText.toString()

onMounted(() => {
  if (props.findInputText !== undefined) {
    search()
  }
})

// --------[ Computed ]-------- //
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

const selectedItemSchema = computed(() => {
  switch (currentFindOption.value) {
    case FindOptions.ID:
      return idValidationSchema
    case FindOptions.Address:
      return addressValidationSchema
    case FindOptions.Coordinate:
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

const isTownUnavailable = computed(() => foundTownId.value === BigInt(0))

// --------[ Method ]-------- //
const handleSearchTypeChange = (selectedValue: SearchType) => {
  resetSearchCriteria()
  Object.keys(searchFormInput).forEach((key) => {
    const formKey = key as keyof typeof searchFormInput
    searchFormInput[formKey] = ''
  })
  currentSearchType.value = selectedValue
  if (!dynamicFindOptions.value.includes(currentFindOption.value)) {
    currentFindOption.value = dynamicFindOptions.value[0]
  }
}

const handleDropdownChange = (newSelectedItem: FindOptions) => {
  resetSearchCriteria()
  searchFormInput[findOptions[currentFindOption.value]] = ''
  currentFindOption.value = newSelectedItem
}

const getTownIdById = async (value: string) => {
  const townInfo = transformTown(
    await getKtaPublic.value.read.townById([BigInt(value)]),
  )
  return townInfo.leader === zeroAddress ? BigInt(0) : BigInt(value)
}

const getTownIdByAddress = async (address: Address) => {
  const userInfo = transformUser(
    await getKtaPublic.value.read.userByAddr([address]),
  )
  return userInfo.townInfo.townId
}

const getTownIdByCoordinates = async (value: string) => {
  const coordinates = value
    .split(',')
    .map((coordinate) => BigInt(coordinate.trim())) as unknown as Readonly<
    [bigint, bigint]
  >

  return await getKtaPublic.value.read.townIdByCoordinate(coordinates)
}

const loadUserDetailsByAddress = (address: Address) => {
  currentUserAddress.value = address
}

const getAddressesByCoordinates = async (coordinateValue: string) => {
  const [x, y] = coordinateValue.split(',').map((coord) => BigInt(coord.trim()))
  const coordinates = { _x: x, _y: y }
  return await getKtaPublic.value.read.getAddressesByCoordinate([coordinates])
}

const debouncedSearch = useDebounceFn(async () => {
  if (!formIsValid.value) return
  isDataLoading.value = true
  const value = searchFormInput[findOptions[currentFindOption.value]]
  try {
    if (currentSearchType.value === SearchType.Town) {
      switch (currentFindOption.value) {
        case FindOptions.ID:
          foundTownId.value = await getTownIdById(value)
          break
        case FindOptions.Address:
          foundTownId.value = await getTownIdByAddress(value as Address)
          break
        case FindOptions.Coordinate:
          foundTownId.value = await getTownIdByCoordinates(value)
          break
      }
    } else if (currentSearchType.value === SearchType.User) {
      switch (currentFindOption.value) {
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
  foundTownId.value = null
  currentUserAddress.value = null
  selectedAddress.value = null
  userAddressList.value = []
}
</script>
