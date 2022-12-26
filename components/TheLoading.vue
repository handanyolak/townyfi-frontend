<template>
  <div class="modal-backdrop fixed inset-0 h-full w-full bg-gray-300">
    <div class="flex min-h-screen items-center justify-center">
      <div class="loader flex space-x-3 rounded-full bg-white px-20 py-10">
        <div class="h-10 w-10 animate-bounce rounded-full">
          <img src="~/assets/img/swords.svg" alt="swords" />
        </div>
        <div class="h-10 w-10 animate-bounce rounded-full">
          <img src="~/assets/img/castle-brown.svg" alt="swords" />
        </div>
        <div class="h-10 w-10 animate-bounce rounded-full">
          <img src="~/assets/img/swords.svg" alt="swords" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader div {
  animation-duration: 0.5s;
}

.loader div:first-child {
  animation-delay: 0.1s;
}

.loader div:nth-child(2) {
  animation-delay: 0.3s;
}

.loader div:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
