import { useElementSize, useElementBounding } from '@vueuse/core'
export const useTour = () => {
  const tourElement = ref<HTMLElement | null>(null)
  const { width, height } = useElementSize(tourElement)
  const { top, left } = useElementBounding(tourElement)

  provide('tourData', { width, height, top, left })

  const next = (step: string) => {
    const dynamicElement = document.querySelector(step) as HTMLElement
    tourElement.value = dynamicElement
  }

  provide('nextStep', next)

  onMounted(() => {
    setTimeout(() => {
      const step1Element = document.querySelector('.step-1') as HTMLElement
      if (step1Element) {
        tourElement.value = step1Element
      }
    }, 1000)
  })

  return { next, width, height, top, left }
}
