<template>
  <div class="flex flex-col items-center justify-center">
    <span>#{{ availableGameId }}</span>
    <span class="text-green-500"
      >Total Pool Balance: {{ totalPrizePoolBalanceFormatted }}</span
    >
    <span class="text-red-500"
      >Randomness Payment: {{ requestRandomnessPaymentFormatted }}</span
    >
    <span class="text-red-500"
      >Random Numbers Refund: {{ requestRandomNumbersRefundFormatted }}</span
    >
  </div>
</template>

<script lang="ts" setup>
const bingoStore = useBingoStore()
const {
  availableGameId,
  requestRandomnessPaymentFormatted,
  requestRandomNumbersRefundFormatted,
  totalPrizePoolBalanceFormatted,
} = storeToRefs(bingoStore)
</script>
