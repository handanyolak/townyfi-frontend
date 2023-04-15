<template>
  <Transition name="loading-slide">
    <div
      class="modal-backdrop fixed inset-0 z-50 h-full w-full bg-towni-brown-light-100 dark:bg-night-blue"
    >
      <div class="flex min-h-screen items-center justify-center">
        <div class="loader flex space-x-3 rounded-full px-20 py-10">
          <div class="h-10 w-10 animate-bounce rounded-full">
            <img src="~/assets/img/swords.svg" alt="swords" />
          </div>
          <div class="h-10 w-10 animate-bounce rounded-full">
            <img
              class="block dark:hidden"
              src="~/assets/img/knight.svg"
              alt="knight"
            />
            <img
              class="hidden dark:block"
              src="~/assets/img/soldier.svg"
              alt="soldier"
            />
          </div>
          <div class="h-10 w-10 animate-bounce rounded-full">
            <img src="~/assets/img/swords.svg" alt="swords" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-slide-enter {
  opacity: 0;
}

.loading-slide-enter-active {
  animation: slide-in 1s ease-in forwards;
  transition: opacity 0.5s;
}

.loading-slide-leave-active {
  animation: slide-out 1s ease-out forwards;
  opacity: 0;
  transition: opacity 1s;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20px);
  }
}
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
