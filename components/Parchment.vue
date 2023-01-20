<template>
  <div>
    <div
      class="round-parchment h-20 -scale-105 transform rounded-xl bg-white"
    ></div>
    <div class="parchment bg-white text-towni-brown-dark-600">
      <div class="animate-fadein">
        <slot />
      </div>
    </div>
    <div
      class="round-parchment h-20 -scale-105 transform rounded-xl bg-white"
    ></div>
  </div>
</template>

<style scoped>
.round-parchment {
  box-shadow: 2px 3px 20px #3f2007, 0px -10px 40px #8a4d0f inset;
}
.parchment {
  height: 40vh;
  animation: height 3s 1;
  box-shadow: 2px 3px 20px #3f2007, 0 0 60px #8a4d0f inset;
}

@keyframes height {
  0% {
    height: 10vh;
  }
  100% {
    height: 40vh;
  }
}
</style>
