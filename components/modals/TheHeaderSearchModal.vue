<template>
  <div>
    <OtherUser :address="address" />
  </div>
</template>

<script setup lang="ts">
import OtherUser from '~/components/OtherUser.vue'

//--------[ Props & Emits ]--------//
interface TheHeaderSearchModalProps {
  address: string
}

defineProps<TheHeaderSearchModalProps>()
</script>
