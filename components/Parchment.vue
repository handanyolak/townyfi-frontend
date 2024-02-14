<template>
  <div>
    <div
      class="round-parchment h-[16%] scale-105 transform rounded-xl bg-white py-3 text-center text-5xl font-bold text-towni-brown-dark-400 md:h-[12%]"
    >
      <slot name="parchment-header" />
    </div>
    <div
      class="parchment scrollbar-gutter-stable overflow-auto bg-white py-8 px-2 text-towni-brown-dark-600"
    >
      <div class="animate-fadein">
        <slot />
      </div>
    </div>
    <div
      class="round-parchment flex h-[16%] scale-105 transform items-center justify-center rounded-xl bg-white md:h-[12%]"
    >
      <slot name="parchment-footer" />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bilbo&display=swap');
.round-parchment {
  box-shadow: 2px 3px 20px #3f2007, 0px -10px 40px #8a4d0f inset;
  font-family: 'Bilbo', cursive;
}
.parchment {
  height: 50vh;
  animation: height 4s 1;
  box-shadow: 2px 3px 20px #3f2007, 0 0 60px #8a4d0f inset;
}

@keyframes height {
  0% {
    height: 10vh;
  }
  100% {
    height: 50vh;
  }
}
</style>
