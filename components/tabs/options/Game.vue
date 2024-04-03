<template>
  <div>
    <div v-for="(settingGroup, index) in settings" :key="index">
      <ListItem
        v-for="(value, key) in settingGroup"
        :key="key"
        :title="getTitle(index, key.toString())"
        >{{ value }}</ListItem
      >
    </div>
    <ListItem v-if="settings && settings[7]" title="Number Digits:">{{
      settings[7]
    }}</ListItem>
    <a href="https://docs.townyfi.com/" target="_blank">
      <AppButton class="my-6 flex w-full justify-center">
        <span>For more information, visit</span>
        <Icon name="iconamoon:link-external-fill" class="ml-1" />
      </AppButton>
    </a>
  </div>
</template>

<script setup lang="ts">
import ListItem from '~/components/common/ListItem.vue'
import AppButton from '~/components/common/AppButton.vue'

const contractStore = useContractStore()
const { getKta } = storeToRefs(contractStore)
const settings = ref<any>(null)

onMounted(async () => {
  settings.value = await getKta.value.read.settings()
})

const titles = ['Max', 'Price', 'Rate', 'Time', 'Min', 'Exp', 'Multiplier']

const getTitle = (index: number, key: string): string => {
  const prefix = titles[index] || 'Custom'
  return `${prefix} ${toCapitalizedWords(key.toString())}:`
}
</script>
