import { useStorage } from '@vueuse/core'

export const useSound = async (soundName: string, type: 'wav' | 'mp3') => {
  const audio = useStorage('audio', false)

  if (audio.value) {
    new Audio(
      (await import(`~/assets/sound/${soundName}.${type}`)).default,
    ).play()
  }
}
