<template>
  <div class="flex flex-col items-center space-y-4">
    <ListTitle class="w-full">Create Town</ListTitle>
    <VForm class="flex flex-col items-center">
      <ListItem class="w-full" input>
        <template #title> Name: </template>
        <template #item>
          <VField v-model="formInput.name" name="name" :rules="nameRules" />
          <VErrorMessage class="text-red-800" name="name" />
        </template>
      </ListItem>
      <ListItem class="w-full" input>
        <template #title> Price: </template>
        <template #item>
          <VField v-model="formInput.price" name="price" :rules="priceRules" />
          <VErrorMessage class="text-red-800" name="price" />
        </template>
      </ListItem>
    </VForm>
    <TownyButton class="my-3" :disabled="!formIsValid" @click="createTown()"
      >Create Town</TownyButton
    >
  </div>
</template>

<script setup lang="ts">
import { encodeBytes32String } from 'ethers'
import * as yup from 'yup'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'

//--------[ Stores ]--------//
const connectionStore = useConnectionStore()
const { getKta } = storeToRefs(connectionStore)

//--------[ Data ]--------//
const formInput = reactive({
  name: '',
  price: '',
})
const formIsValid = ref(false)
const nameRules = yup.string().bytes32().required()
const priceRules = yup
  .number()
  .typeError('this must be a `number` type')
  .transform((value, originalValue) => {
    return originalValue === '' ? 0 : value
  })
  .integer()
  .min(0)
const formRules = yup.object().shape({
  name: nameRules,
  price: priceRules,
})

//--------[ Hooks ]--------//
watch(formInput, (newFormInput) => {
  formIsValid.value = formRules.isValidSync(newFormInput)
})

//--------[ Methods ]--------//
const createTown = async () => {
  try {
    await getKta.value.createTown(
      encodeBytes32String(formInput.name),
      BigInt(formInput.price)
    )
  } catch (error: any) {
    console.log(error)
    // console.log(
    //   getKta.value.interface.getError(error.info.error.data.data.result)
    // )
  }
}
</script>
