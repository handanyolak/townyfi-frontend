<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Coordinate: </template>
      <LanguageDropdown />
    </ListItem>
    <ListItem>
      <template #title> Theme: </template>
      <Switch @toggled="toggleTheme()">
        <template #item-1>Light</template>
        <template #item-2>Dark</template>
      </Switch>
    </ListItem>
    <ListItem>
      <template #title> Sound: </template>
      <Switch @toggled="appOptionStore.toggleAudio()">
        <template #item-1>Yes</template>
        <template #item-2>No</template>
      </Switch>
    </ListItem>
    <ListItem>
      <template #title> Music: </template>
      <Switch @toggled="appOptionStore.toggleMusic()">
        <template #item-1>Yes</template>
        <template #item-2>No</template>
      </Switch>
    </ListItem>
    <ListTitle>Interface</ListTitle>
    <ListItem>
      <template #title> Near Level: </template>
      <Switch>
        <template #item-1>1</template>
        <template #item-2>2</template>
      </Switch>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import LanguageDropdown from '~/components/LanguageDropdown.vue'
import Switch from '~/components/Switch.vue'

const appOptionStore = useAppOptionsStore()

const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleTheme = useToggle(isDark)
</script>
