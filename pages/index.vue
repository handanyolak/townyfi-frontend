<template>
  <div class="container">
    <div class="grid h-screen grid-cols-3 gap-3">
      <div
        v-for="item in 9"
        :key="item"
        class="flex items-start justify-center text-2xl font-bold border-8 shadow-2xl bg-gradient-to-r from-brown-light via-brown to-brown-dark rounded-xl border-brown"
      >
        <span class="px-4 my-2 bg-brown-light">
          <span
            class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-600"
            >DESTINY</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, inject } from 'vue'

export default defineComponent({
  setup() {
    /* const foo = inject('foo')

    return {
      foo,
    } */
  },
})
</script>
