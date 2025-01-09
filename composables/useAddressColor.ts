import { computed } from 'vue'
import { keccak256 } from 'viem'
import type { Address } from 'viem'

export function useAddressColor(address: Address | undefined) {
  const calculateCardColor = computed(() => {
    const hash = keccak256(address as Address).slice(2)
    const firstThirtyHexChars = hash.slice(0, 30)
    const colors = []

    for (let i = 0; i < 10; i++) {
      const segment = firstThirtyHexChars.slice(i * 3, i * 3 + 3)
      const r = parseInt(segment[0], 16) * 10 + 50
      const g = parseInt(segment[1], 16) * 10 + 50
      const b = parseInt(segment[2], 16) * 10 + 50
      colors.push(`rgb(${r}, ${g}, ${b})`)
    }

    return colors
  })

  return {
    colors: calculateCardColor,
  }
}
