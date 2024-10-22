<template>
  <div class="background-town flex items-center bg-towny-brown-light-100 p-4">
    <div
      class="flex w-full flex-col items-center space-y-4 bg-towny-brown-light-100 bg-opacity-20 p-1 backdrop-blur-sm"
    >
      <VeeForm class="flex w-full flex-col items-center">
        <ListItem title="Name:" class="w-full bg-towny-brown-light-100" input>
          <template #item>
            <VeeField v-model="formInput.name" name="name" :rules="nameRules" />
            <VeeErrorMessage class="text-red-800" name="name" />
          </template>
        </ListItem>
        <ListItem title="Price:" class="w-full bg-towny-brown-light-100" input>
          <template #item>
            <VeeField
              v-model="formInput.price"
              name="price"
              :rules="priceRules"
            />
            <VeeErrorMessage class="text-red-800" name="price" />
          </template>
        </ListItem>
      </VeeForm>
      <div class="my-3 rounded-full bg-towny-brown-light-100">
        <AppButton :disabled="!formIsValid" @click="createTown()"
          >Create Town</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stringToHex } from 'viem'
import { object } from 'yup'
import ListItem from '~/components/common/ListItem.vue'
import AppButton from '~/components/common/AppButton.vue'
import { getBytes32Rule, getUintRule } from '~/composables/useYupRules'

// --------[ Stores ]-------- //
const contractStore = useContractStore()

const { getKtaCaller } = storeToRefs(contractStore)

// --------[ Data ]-------- //
const formInput = reactive({
  name: '',
  price: '',
})
const formIsValid = ref(false)
const nameRules = getBytes32Rule({
  required: true,
})
const priceRules = getUintRule()
const formRules = object().shape({
  name: nameRules,
  price: priceRules,
})

// --------[ Hooks ]-------- //
watch(formInput, (newFormInput) => {
  formIsValid.value = formRules.isValidSync(newFormInput)
})

// --------[ Methods ]-------- //
const createTown = async () => {
  await getKtaCaller.value.callFunction({
    type: 'write',
    name: 'createTown',
    args: [
      [stringToHex(formInput.name, { size: 32 }), BigInt(formInput.price)],
    ],
  })
}
</script>

<style scoped>
.background-town {
  background-image: url('~/assets/img/create-town.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
