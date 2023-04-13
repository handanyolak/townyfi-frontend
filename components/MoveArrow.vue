<template>
  <div class="arrow left-[50%] w-10"></div>
</template>

<style scoped>
.arrow {
  @apply absolute h-2 origin-left transform  cursor-pointer bg-towni-brown-dark-200 opacity-50 transition-all duration-300 ease-in-out before:absolute before:-right-3 before:-top-2 before:bottom-0 before:h-0 before:w-0 before:border-t-12 before:border-b-12 before:border-l-18 before:border-towni-brown-dark-200 before:border-b-transparent before:border-t-transparent active:opacity-95;
}
</style>
