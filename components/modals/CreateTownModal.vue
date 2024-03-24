<template>
  <div class="background-town flex items-center bg-towni-brown-light-100 p-4">
    <div
      class="flex w-full flex-col items-center space-y-4 bg-towni-brown-light-100 bg-opacity-20 p-1 backdrop-blur-sm"
    >
      <VForm class="flex w-full flex-col items-center">
        <ListItem title="Name:" class="w-full bg-towni-brown-light-100" input>
          <template #item>
            <VField v-model="formInput.name" name="name" :rules="nameRules" />
            <VErrorMessage class="text-red-800" name="name" />
          </template>
        </ListItem>
        <ListItem title="Price:" class="w-full bg-towni-brown-light-100" input>
          <template #item>
            <VField
              v-model="formInput.price"
              name="price"
              :rules="priceRules"
            />
            <VErrorMessage class="text-red-800" name="price" />
          </template>
        </ListItem>
      </VForm>
      <div class="my-3 rounded-full bg-towni-brown-light-100">
        <AppButton :disabled="!formIsValid" @click="createTown()"
          >Create Town</AppButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { encodeBytes32String } from 'ethers'
import { object } from 'yup'
import ListItem from '~/components/sidebar-items/ListItem.vue'
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
  await getKtaCaller.value.callFunction('write', 'createTown', [
    encodeBytes32String(formInput.name),
    BigInt(formInput.price),
  ])
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
