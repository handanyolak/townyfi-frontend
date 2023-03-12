<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem>
      <template #title> Coordinate: </template>
      <SidebarDropdown
        :select="language"
        :dropdown-items="languages"
        :icon-names="languages"
        @selected="(item) => selectLanguage(item)"
      />
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
      <SidebarDropdown
        :select="nearLevel"
        :dropdown-items="nearLevels"
        @selected="(item) => selectNearLevel(item)"
      ></SidebarDropdown>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import ListTitle from '~/components/sidebar-items/ListTitle.vue'
import ListItem from '~/components/sidebar-items/ListItem.vue'
import SidebarDropdown from '~/components/SidebarDropdown.vue'
import Switch from '~/components/Switch.vue'

const useUserOptions = useUserOptionsStore()
const { language } = storeToRefs(useUserOptions)
const appOptionStore = useAppOptionsStore()
const userGameStore = useUserGameStore()
const { nearLevel } = storeToRefs(userGameStore)

const nearLevels = ['1', '2', '3']

const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleTheme = useToggle(isDark)

const languages = computed(() => {
  const allLanguages = ['en', 'tr', 'de']

  return allLanguages.filter((item) => item !== language.value)
})

const selectLanguage = (item: string) => {
  useUserOptions.setLanguage(item)
}

const selectNearLevel = (item: string) => {
  nearLevel.value = item
  userGameStore.setUserCoordinate()
}
</script>
