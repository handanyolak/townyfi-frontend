<template>
  <div class="w-full">
    <ul class="grid grid-cols-3 my-3 space-x-2">
      <li class="text-center">
        <a
          class="block p-2 text-xs font-bold leading-normal uppercase rounded shadow-lg"
          :class="{
            'text-pink-600 bg-white': openTab !== 1,
            'text-white bg-pink-600': openTab === 1,
          }"
          @click="toggleTabs(1)"
        >
          Profile
        </a>
      </li>
      <li class="text-center">
        <a
          class="block p-2 text-xs font-bold leading-normal uppercase rounded shadow-lg"
          :class="{
            'text-pink-600 bg-white': openTab !== 2,
            'text-white bg-pink-600': openTab === 2,
          }"
          @click="toggleTabs(2)"
        >
          Settings
        </a>
      </li>
      <li class="text-center">
        <a
          class="block p-2 text-xs font-bold leading-normal uppercase rounded shadow-lg"
          :class="{
            'text-pink-600 bg-white': openTab !== 3,
            'text-white bg-pink-600': openTab === 3,
          }"
          @click="toggleTabs(3)"
        >
          Options
        </a>
      </li>
    </ul>
    <div
      class="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg"
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
