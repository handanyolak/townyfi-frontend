<template>
  <div class="w-full">
    <ul class="my-3 grid grid-cols-3 space-x-2">
      <li class="text-center">
        <a
          class="block rounded p-2 text-xs font-bold uppercase leading-normal shadow-lg"
          :class="{
            'bg-white text-pink-600': openTab !== 1,
            'bg-pink-600 text-white': openTab === 1,
          }"
          @click="toggleTabs(1)"
        >
          Profile
        </a>
      </li>
      <li class="text-center">
        <a
          class="block rounded p-2 text-xs font-bold uppercase leading-normal shadow-lg"
          :class="{
            'bg-white text-pink-600': openTab !== 2,
            'bg-pink-600 text-white': openTab === 2,
          }"
          @click="toggleTabs(2)"
        >
          Settings
        </a>
      </li>
      <li class="text-center">
        <a
          class="block rounded p-2 text-xs font-bold uppercase leading-normal shadow-lg"
          :class="{
            'bg-white text-pink-600': openTab !== 3,
            'bg-pink-600 text-white': openTab === 3,
          }"
          @click="toggleTabs(3)"
        >
          Options
        </a>
      </li>
    </ul>
    <div
      class="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg"
    >
      <div class="px-4 py-5">
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
