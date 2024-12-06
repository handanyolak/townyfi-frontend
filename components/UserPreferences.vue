<template>
  <div class="flex h-full flex-col items-center gap-2 md:gap-6">
    <AppDropdown
      :select="language"
      :dropdown-items="languages"
      :icon-names="languages"
      class="dropdown-background step-3"
      @selected="(item) => selected(item)"
    />

    <div class="flex items-center justify-center">
      <img
        :src="themeIcon"
        class="h-14 w-14 cursor-pointer"
        @click="toggleTheme()"
      />
      <img
        :src="audioIcon"
        class="step-1 mr-4 h-16 w-16 cursor-pointer"
        @click="toggleAudio()"
      />
      <client-only>
        <Vue3Lottie
          v-if="audio"
          class="cursor-pointer"
          :animation-data="Harp"
          :height="55"
          :width="55"
          :scale="1.4"
          :auto-play="isAnimating"
          :pause-animation="!isAnimating"
          @click="toggleMusicAndAnimation()"
        />
      </client-only>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from 'vue3-lottie'
import Harp from '~/assets/lotties/harp.json'
import AppDropdown from '~/components/common/AppDropdown.vue'

// --------[ Strore ]-------- //
const appOptionStore = useAppOptionsStore()
const useUserOptions = useUserOptionsStore()
const { toggleMusic, toggleAudio } = appOptionStore
const { audio } = storeToRefs(appOptionStore)
const { language } = storeToRefs(useUserOptions)
const { setLanguage } = useUserOptions

// --------[ Composable ]-------- //
const isDark = useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

// --------[ Data ]-------- //
const toggleTheme = useToggle(isDark)
const isAnimating = ref(false)

// --------[ Computed ]-------- //
const audioIcon = computed(() => useSvg(audio.value ? 'sound' : 'sound-mute'))

const themeIcon = computed(() =>
  useSvg(isDark.value ? 'dark-mode' : 'light-mode'),
)

const languages = computed(() =>
  ['en', 'tr', 'de'].filter((item) => item !== language.value),
)

// --------[ Method ]-------- //
const selected = (item: string) => {
  setLanguage(item)
}

const toggleMusicAndAnimation = () => {
  toggleMusic()
  isAnimating.value = !isAnimating.value
}
</script>
