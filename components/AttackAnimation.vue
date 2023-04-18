<template>
  <div class="flex justify-between">
    <img class="l-sword h-36 w-36 transform" src="@/assets/img/sword.svg" />
    <div class="loader">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <img
      class="t-sword h-36 w-36 -rotate-90 transform"
      src="@/assets/img/sword.svg"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style>
.l-sword {
  animation: float 1s linear infinite;
}

.t-sword {
  animation: float1 1s linear infinite;
}
@keyframes float {
  0% {
    transform: rotate(0);
  }
  20% {
    transform: rotate(-10deg);
  }
  40% {
    transform: rotate(-20deg);
  }
  60% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}
@keyframes float1 {
  0% {
    transform: rotate(-90deg);
  }
  20% {
    transform: rotate(-60deg);
  }
  40% {
    transform: rotate(-50deg);
  }
  60% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}

.loader {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.dot {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.dot:nth-child(1) {
  background-color: red;
  animation: jump 0.6s 0.5s ease-in infinite;
}
.dot:nth-child(2) {
  background-color: blue;
  animation: jump 0.6s 0.7s ease-in infinite;
}
.dot:nth-child(3) {
  background-color: orange;
  animation: jump 0.6s 0.9s ease-in infinite;
}

@keyframes jump {
  0% {
    transform: translate3D(0, 0, 0);
    opacity: 0;
  }
  50% {
    transform: translate3D(0, -15px, 0);
    opacity: 0.5;
  }
  100% {
    transform: translate3D(0, 0, 0);
    opacity: 1;
  }
}
</style>
