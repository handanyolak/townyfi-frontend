<template>
  <div
    v-show="isModalVisible"
    class="fixed left-0 top-0 z-[99999999] flex h-full w-full items-center justify-center bg-transparent"
  >
    <svg
      :width="windowWidth"
      :height="windowHeight"
      class="absolute left-0 top-0"
    >
      <mask id="mask" x="0" y="0" width="100%" height="100%">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <rect
          :x="positions.elementLeftPosition"
          :y="positions.elementTopPosition"
          :width="positions.elementWidth"
          :height="positions.elementHeight"
          fill="black"
        />
      </mask>
      <rect
        x="0"
        y="0"
        :width="windowWidth"
        :height="windowHeight"
        fill="rgba(0,0,0,0.5)"
        mask="url(#mask)"
      />
      <polygon
        :points="`${positions.elementLeftPosition + positions.elementWidth / 2},${positions.elementTopPosition + positions.elementHeight} ${positions.elementLeftPosition + positions.elementWidth / 2 - 10},${
          positions.elementTopPosition + positions.elementHeight + 10
        } ${positions.elementLeftPosition + positions.elementWidth / 2 + 10},${positions.elementTopPosition + positions.elementHeight + 10}`"
        fill="white"
      />
    </svg>
    <div
      v-if="currentStep"
      class="z-[99999] flex flex-col justify-between rounded-sm bg-white p-1"
      :style="popoverStyle"
    >
      <h1 class="my-2 text-center font-bold text-towni-brown-dark-400">
        {{ currentStep.title }}
      </h1>
      <div
        class="scrollbar-gutter-stable my-1 max-h-44 overflow-y-auto overflow-x-hidden p-1"
      >
        <p class="text-center">{{ currentStep.content }}</p>
      </div>
      <AppButton fill-hover inline-class="px-6" @click="goToNextStep">{{
        buttonLabel
      }}</AppButton>
    </div>
    <div
      :style="`position: absolute; top: ${positions.elementTopPosition}px; left: ${positions.elementLeftPosition}px; width: ${positions.elementWidth}px; height: ${positions.elementHeight}px;`"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize, useStorage } from '@vueuse/core'
import type { Step, TourData } from '~/types'

interface AppTourProps {
  steps: Step[]
  disableStorage?: boolean
  storageKey?: string
}

// --------[ Props & Inject ]-------- //
const props = withDefaults(defineProps<AppTourProps>(), {
  storageKey: 'vue-tour-has-completed-tour',
  disableStorage: false,
})
const tourData = inject<TourData>('tourData')
const nextStep = inject<Function>('nextStep')

// --------[ Composable ]-------- //
const { width: windowWidth, height: windowHeight } = useWindowSize()

// --------[ Data ]-------- //
const currentStepIndex = ref(0)
const isModalVisible = ref(false)
const POPOVER_WIDTH = 220
const hasCompletedTour = useStorage(props.storageKey, false, undefined, {
  writeDefaults: !props.disableStorage,
})

// --------[ Computed ]-------- //

const currentStep = computed(() =>
  props.steps ? props.steps[currentStepIndex.value] : null,
)

const buttonLabel = computed(() =>
  currentStepIndex.value === props.steps.length - 1 ? 'Finish' : 'Next',
)

const positions = computed(() => calculatePositions())

const isRight = computed(
  () =>
    window.innerWidth * (dynamicPercentage.value / 100) <
    (tourData?.left.value ?? 0),
)

const dynamicPercentage = computed(() => {
  if (windowWidth.value < 600) {
    return 75
  } else {
    return 85
  }
})

const popoverStyle = computed<Record<string, string | number>>(() => {
  const baseStyle: Record<string, string | number> = {
    position: 'absolute',
    top: `${(tourData?.top.value ?? 0) + (tourData?.height.value ?? 0) + 15}px`,
    width: `${POPOVER_WIDTH}px`,
  }

  if (isRight.value) {
    return { ...baseStyle, right: '0' }
  } else {
    const popoverLeft =
      (tourData?.left.value ?? 0) -
      (POPOVER_WIDTH - (tourData?.width.value ?? 0)) / 2
    return { ...baseStyle, left: `${popoverLeft}px` }
  }
})

// --------[ Method ]-------- //
const goToNextStep = () => {
  const isLastStep = currentStepIndex.value >= props.steps.length - 1
  if (isLastStep) {
    completeTour()
  } else {
    currentStepIndex.value++
    if (nextStep) {
      nextStep(props.steps[currentStepIndex.value]?.target)
    }
  }
}

const completeTour = () => {
  if (!props.disableStorage) {
    hasCompletedTour.value = true
  }

  isModalVisible.value = false
}

const checkStepsForTarget = () => {
  const hasStepOne = props.steps.some(
    (step) => step.target === props.steps[0].target,
  )
  isModalVisible.value = hasStepOne
}

const checkModalStatus = () => {
  isModalVisible.value = props.disableStorage || !hasCompletedTour.value
}

const calculatePositions = () => {
  const popoverTopPosition =
    (tourData?.top.value ?? 0) + (tourData?.height.value ?? 0) + 15
  const elementWidth = (tourData?.width.value ?? 0) + 10
  const elementHeight = (tourData?.height.value ?? 0) + 10
  const elementLeftPosition = (tourData?.left.value ?? 0) - 3
  const elementTopPosition = (tourData?.top.value ?? 0) - 3

  return {
    elementLeftPosition,
    popoverTopPosition,
    elementTopPosition,
    elementHeight,
    elementWidth,
  }
}

// --------[ Hook ]-------- //
onMounted(() => {
  const timer = setTimeout(() => {
    checkStepsForTarget()
    checkModalStatus()
  }, 1000)

  onUnmounted(() => {
    clearTimeout(timer)
  })
})
</script>
