<template>
  <div>
    <form class="flex items-center">
      <div class="relative w-full">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3"
        >
          <img class="h-6 w-6" src="@/assets/img/search-icon.svg" />
        </div>
        <input
          type="text"
          id="simple-search"
          class="block w-full rounded-lg border border-towni-brown-dark-100 bg-towni-brown-dark-300 bg-opacity-20 p-2.5 px-1 pl-10 text-sm text-towni-brown-dark-600 outline-none backdrop-blur focus:border-towni-brown-dark-300"
          placeholder="Search"
          required
        />
      </div>
      <button
        type="submit"
        class="ml-2 rounded-lg bg-towni-brown-dark-200 p-2.5 text-sm font-medium text-white transition duration-200 ease-in-out hover:bg-towni-brown-dark-300 focus:outline-none"
      >
        <img class="h-6 w-6" src="@/assets/img/search-icon.svg" />
        <span class="sr-only">Search</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts"></script>
