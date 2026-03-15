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
          v-if="selectedFruits.size > 0"
          class="ml-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
        >
          {{ selectedFruits.size }}
        </span>
      </button>
    </div>

    <fruits-network-graph :fruits="fruits" />
<!--    <fruits-network-graph-static :fruits="fruits" />-->

<!--    <AppleNetworkGraph :selected-apple-ids="selectedAppleIds" />-->

    <fruits-select-modal
      :is-open="isModalOpen"
      :selected="selectedFruits"
      @close="closeModal"
      @update:selected-ids="updateSelectedFruits"
    />
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
import {ApolloClient} from "@apollo/client";

const props = withDefaults(defineProps<{
  parentColor: string;
  childrenColor: string;
}>(), {
  parentColor: '#1EFC1E',
  childrenColor: '#7F7EFF'
});

const config = useRuntimeConfig();
const route = useRoute();

const isModalOpen = ref(false)
const selectedFruits = reactive<Set<string>>(new Set());

const fruitTypeSlug = isString(route.params?.['fruit_type_slug']) ? route.params['fruit_type_slug'] : 'apple';

const { $apollo } = useNuxtApp();

const request = ref<ApolloClient.QueryResult<FruitsNetworkQuery> | null>(null);
const fruits = computed(() => request.value?.data?.fruits?.data || []);

const query = async () => {
  request.value = await $apollo.query<FruitsNetworkQuery, FruitsNetworkQueryVariables>({
    query: FruitsNetworkDocument,
    variables: {
      type: fruitTypeSlug,
      take: (!selectedFruits.size || selectedFruits.size > config.public.listFruitsLimit)
        ? config.public.listFruitsLimit
        : selectedFruits.size,
      slugs: selectedFruits.size ? Array.from(selectedFruits) : null,
    }
  });
};
await query();

const openModal = () => {
  isModalOpen.value = true
}

const updateSelectedFruits = (fruits: string[]) => {
  selectedFruits.clear();
  fruits.forEach((fruit) => {
    selectedFruits.add(fruit);
  });
  query();
};

const closeModal = () => {
  isModalOpen.value = false
}

const d = 'Interactive network graph showing genetic relationships between apple varieties'
useSeoMeta({
  title: 'Apples Network Graph',
  description: d,
  ogDescription: d,
});
</script>

<style scoped>
/* Add any page-specific styles here if needed */
</style>