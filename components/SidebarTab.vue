<template>
  <div style="font-family: 'Bilbo Swash Caps'" class="mx-4 p-4">
    <ul class="my-3 grid grid-cols-2 space-x-2">
      <li class="text-center">
        <a
          style="font-family: Pirata One, sans-serif"
          class="block rounded p-2 font-bold uppercase leading-normal shadow-lg"
          :class="{
            'bg-towni-brown-100 text-towni-brown-200 hover:shadow-towni-brown-300':
              openTab !== 1,
            'bg-towni-brown-200 text-towni-brown-100 ': openTab === 1,
          }"
          @click="toggleTabs(1)"
        >
          User
        </a>
      </li>
      <li class="text-center">
        <a
          style="font-family: Pirata One, sans-serif"
          class="block rounded p-2 font-bold uppercase leading-normal shadow-lg"
          :class="{
            'bg-towni-brown-100 text-towni-brown-200 hover:shadow-towni-brown-300':
              openTab !== 2,
            'bg-towni-brown-200 text-towni-brown-100': openTab === 2,
          }"
          @click="toggleTabs(2)"
        >
          Town
        </a>
      </li>
    </ul>
    <div class="w-full">
      <div>
        <div class="tab-content tab-space">
          <div :class="{ hidden: openTab !== 1, block: openTab === 1 }">
            <p>
              Collaboratively administrate empowered markets via plug-and-play
              networks. Dynamically procrastinate B2C users after installed base
              benefits.
              <br />
              <br />
              Dramatically visualize customer directed convergence without
              revolutionary ROI.
            </p>
          </div>
          <div :class="{ hidden: openTab !== 2, block: openTab === 2 }">
            <p>
              Completely synergize resource taxing relationships via premier
              niche markets. Professionally cultivate one-to-one customer
              service with robust ideas.
              <br />
              <br />
              Dynamically innovate resource-leveling customer service for state
              of the art customer service.
            </p>
          </div>
          <div :class="{ hidden: openTab !== 3, block: openTab === 3 }">
            <p>
              Efficiently unleash cross-media information without cross-media
              value. Quickly maximize timely deliverables for real-time schemas.
              <br />
              <br />
              Dramatically maintain clicks-and-mortar solutions without
              functional solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const openTab = ref(1)

const toggleTabs = (tabNumber: number) => {
  openTab.value = tabNumber
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Pirata+One|Bilbo+Swash+Caps&display=swap');

@font-face {
  font-family: Morris;
  src: url(https://cdn.statically.io/gh/EmmesCodes/Tipografias/dae9f5bb/MorrisInitials.ttf);
}
</style>
