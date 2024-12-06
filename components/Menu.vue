<template>
  <transition name="menu">
    <div
      v-if="menuOpen"
      ref="menu"
      style="box-shadow: 0px 0px 30px 10px rgba(155, 70, 34, 1)"
      class="fixed right-0 top-0 z-20 h-[350px] w-[350px] rounded-bl-full bg-towny-brown-dark-600 text-3xl text-white md:h-[400px] md:w-[400px]"
    >
      <Icon
        name="ic:round-close"
        class="absolute right-2 top-3 h-11 w-11 cursor-pointer text-towny-brown-dark-400 md:right-5 md:top-6"
        @click="closeMenu"
      />
      <div class="ml-16 mt-10 flex h-full flex-col items-center justify-center">
        <UserAccessManager v-if="hasMetamask" class="block md:hidden" />
        <UserPreferences />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import UserAccessManager from '~/components/UserAccessManager.vue'
import UserPreferences from '~/components/UserPreferences.vue'

// --------[ Prop & Emit ]-------- //
interface MenuProps {
  menuOpen: boolean
  hasMetamask: boolean
}

withDefaults(defineProps<MenuProps>(), {
  menuOpen: false,
  hasMetamask: false,
})

const emit = defineEmits(['close'])

const closeMenu = () => {
  emit('close')
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.4s ease;
  transform-origin: top right;
}

.menu-enter-from {
  transform: scale(0) translate(100%, -100%);
}

.menu-enter-to {
  transform: scale(1) translate(0, 0);
}

.menu-leave-from {
  transform: scale(1) translate(0, 0);
}

.menu-leave-to {
  transform: scale(0) translate(100%, -100%);
}
</style>
