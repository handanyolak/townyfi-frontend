<template>
  <div>
    <ListTitle>General</ListTitle>
    <ListItem title="Coordinate:">
      <AppDropdown
        :select="language"
        :dropdown-items="languages"
        :icon-names="languages"
        rounded
        @selected="(item) => selectLanguage(item)"
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
      <AppDropdown
        :key="nearLevel"
        :select="nearLevel.toString()"
        :dropdown-items="createNumberArray(minNearLevel, maxNearLevel)"
        rounded
        @selected="(item) => selectNearLevel(item)"
      ></AppDropdown>
    </ListItem>
    <ListItem title="Map Size:">
      <AppDropdown
        :key="selectedMapSize"
        :select="selectedMapSize"
        :dropdown-items="mapSizes"
        rounded
        @selected="(item) => selectMapSize(item)"
      ></AppDropdown>
    </ListItem>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle, useLocalStorage } from '@vueuse/core'
import ListTitle from '~/components/common/ListTitle.vue'
import ListItem from '~/components/common/ListItem.vue'
import AppDropdown from '~/components/common/AppDropdown.vue'
import Switch from '~/components/common/Switch.vue'

// --------[ Nuxt Import ]-------- //
const {
  public: { minNearLevel, maxNearLevel },
} = useRuntimeConfig()

// --------[ Store ]-------- //
const appOptionStore = useAppOptionsStore()
const userGameStore = useUserGameStore()
const useUserOptions = useUserOptionsStore()

const { toggleAudio, toggleMusic } = appOptionStore
const { setNearLevelByCalculatingCoordinates } = userGameStore
const { setLanguage } = useUserOptions

const { nearLevel } = storeToRefs(userGameStore)
const { language } = storeToRefs(useUserOptions)

// --------[ Data ]-------- //
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleTheme = useToggle(isDark)

const mapSizes = Array.from({ length: 13 }, (_, i) => (i + 1).toString())
const mapSize = useLocalStorage('mapSize', 50)

// --------[ Computed ]-------- //
const languages = computed(() => {
  const allLanguages = ['en', 'tr', 'de']

  return allLanguages.filter((item) => item !== language.value)
})

const selectedMapSize = computed(() => {
  const size = (mapSize.value - 25) / 5
  return mapSizes.includes(size.toString()) ? size.toString() : mapSizes[0]
})

// --------[ Method ]-------- //
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

const selectMapSize = (item: string) => {
  mapSize.value = 25 + parseInt(item) * 5
}
</script>
