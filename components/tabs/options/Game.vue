<template>
  <div>
    <div v-for="(setting, parentKey) in settings" :key="parentKey">
      <div v-if="typeof setting === 'object'">
        <ListItem
          v-for="(value, key) in setting"
          :key="key"
          :title="`${toCapitalizedWords(parentKey).toUpperCase()} ${toCapitalizedWords(key).toUpperCase()}`"
          >{{ value }}</ListItem
        >
      </div>
      <div v-else>
        <ListItem :title="toCapitalizedWords(parentKey).toUpperCase()">{{
          setting
        }}</ListItem>
      </div>
    </div>
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

const userGameStore = useUserGameStore()

const { settings } = storeToRefs(userGameStore)
</script>
