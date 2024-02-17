<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem title="Coordinate:">
      <SidebarDropdown
        :select="language"
        :dropdown-items="languages"
        :icon-names="languages"
        @selected="(item) => selectLanguage(item)"
        rounded
      />
    </ListItem>
    <ListItem title="Theme:">
      <Switch @toggled="toggleTheme()">
        <template #item-1>Light</template>
        <template #item-2>Dark</template>
      </Switch>
    </ListItem>
    <ListItem title="Sound:">
      <Switch @toggled="toggleAudio()">
        <template #item-1>Yes</template>
        <template #item-2>No</template>
      </Switch>
    </ListItem>
    <ListItem title="Music:">
      <Switch @toggled="toggleMusic()">
        <template #item-1>Yes</template>
        <template #item-2>No</template>
      </Switch>
    </ListItem>
    <ListTitle>Interface</ListTitle>
    <ListItem title="Near Level:">
      <SidebarDropdown
        :select="nearLevel.toString()"
        :dropdown-items="createNumberArray(minNearLevel, maxNearLevel)"
        @selected="(item) => selectNearLevel(item)"
        rounded
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

//--------[ Nuxt Imports ]--------//
const { minNearLevel, maxNearLevel } = useRuntimeConfig().public

//--------[ Stores ]--------//
const appOptionStore = useAppOptionsStore()
const userGameStore = useUserGameStore()
const useUserOptions = useUserOptionsStore()

const { toggleAudio, toggleMusic } = appOptionStore
const { setNearLevelByCalculatingCoordinates } = userGameStore
const { setLanguage } = useUserOptions

const { nearLevel } = storeToRefs(userGameStore)
const { language } = storeToRefs(useUserOptions)

//--------[ Data ]--------//
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleTheme = useToggle(isDark)

//--------[ Computed ]--------//
const languages = computed(() => {
  const allLanguages = ['en', 'tr', 'de']

  return allLanguages.filter((item) => item !== language.value)
})

//--------[ Methods ]--------//
const selectLanguage = (item: string) => {
  setLanguage(item)
}

const createNumberArray = (start: number, end: number) => {
  const numberStrArray: string[] = []
  for (let i = start; i <= end; i++) {
    numberStrArray.push(i.toString())
  }
  return numberStrArray
}

const selectNearLevel = (item: any) => {
  setNearLevelByCalculatingCoordinates(item)
}
</script>
