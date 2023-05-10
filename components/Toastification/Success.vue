<template>
  <!-- <img src="@/assets/img/success.svg" /> -->
  <client-only>
    <Vue3Lottie :animation-data="Sweat" :height="25" :width="25" />
  </client-only>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import Sweat from '~/assets/lotties/sweet-teapot.json'
</script>
