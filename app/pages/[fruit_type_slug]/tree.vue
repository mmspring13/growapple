<!-- pages/apple-graph.vue -->
<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-2">Apple Network</h1>
        <p class="text-stone-500 dark:text-stone-400 max-w-2xl">
          Interactive network graph showing the genetic relationships between apple varieties.
          Hover over a node to see parents (blue) and children (red).
        </p>
      </div>
      <button
        @click="openModal"
        class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-stone-700 dark:text-stone-300 font-medium"
      >
        <FilterIcon class="w-4 h-4" />
        Filter Varieties
        <span
          v-if="fruits.length > 0"
          class="ml-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
        >
          {{ fruits.length }}
        </span>
      </button>
    </div>

    <fruits-network-graph :fruits="fruits" />

<!--    <AppleNetworkGraph :selected-apple-ids="selectedAppleIds" />-->

<!--      <fruits-select-modal-->
<!--        :is-open="isModalOpen"-->
<!--        :selected-ids="selectedAppleIds"-->
<!--        @close="closeModal"-->
<!--        @update:selected-ids="updateSelectedIds"-->
<!--      />-->
  </div>
</template>

<script setup lang="ts">
import { Filter as FilterIcon } from 'lucide-vue-next';
import {isString} from "#shared/helpers/string";
import {
  FruitsNetworkDocument,
  type FruitsNetworkQuery,
  type FruitsNetworkQueryVariables
} from "~/composables/fruits/fruits-network.generated";

// Nuxt 3 composition API with auto-imports
const isModalOpen = ref(false)

const selectedFruits = ref<string[]>([
  {
    "slug": "ruby-frost-apple"
  },
  {
    "slug": "sweet-tango-apple"
  },
  {
    "slug": "kiku-apple"
  },
  {
    "slug": "smitten-apple"
  },
  {
    "slug": "sugarbee-apple"
  },
  {
    "slug": "green-dragon-apple"
  },
  {
    "slug": "cripps-pink-apple"
  },
  {
    "slug": "autumn-glory-apple"
  },
  {
    "slug": "red-delicious-apple"
  },
  {
    "slug": "pazazz-apple"
  },
  {
    "slug": "granny-smith-apple"
  },
  {
    "slug": "braeburn-apple"
  },
  {
    "slug": "evercrisp-apple"
  },
  {
    "slug": "empire-apple"
  },
  {
    "slug": "golden-delicious-apple"
  },
  {
    "slug": "envy-apple"
  },
  {
    "slug": "zestar-apple"
  },
  {
    "slug": "pink-pearl-apple"
  },
  {
    "slug": "fuji-apple"
  },
  {
    "slug": "modi-apple"
  },
  {
    "slug": "gala-apple"
  },
  {
    "slug": "honeycrisp-apple"
  }
].map(({ slug }) => slug));

const route = useRoute();
const fruitTypeSlug = isString(route.params?.['fruit_type_slug']) ? route.params['fruit_type_slug'] : 'apple';

const { $apollo } = useNuxtApp();

const req = await $apollo.query<FruitsNetworkQuery, FruitsNetworkQueryVariables>({
  query: FruitsNetworkDocument,
  variables: {
    type: fruitTypeSlug,
    take: 100,
    slugs: selectedFruits.value,
  }
});

const fruits = req.data?.fruits?.data || [];

// Component methods
const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// const updateSelectedIds = (ids: number[]) => {
//   selectedAppleIds.value = ids
// }
//
// // Handle modal selection changes
// const handleSelectionChange = (ids: number[]) => {
//   selectedAppleIds.value = ids
// }

// Page head management
useHead({
  title: 'Apple Network Graph',
  meta: [
    {
      name: 'description',
      content: 'Interactive network graph showing genetic relationships between apple varieties'
    }
  ]
})
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>