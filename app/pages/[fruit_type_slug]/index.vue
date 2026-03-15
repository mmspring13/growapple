<script setup lang="ts">
import FruitsTable from '~/components/fruits-table/fruits-table.vue'
import { ref, computed } from 'vue';
import {isString} from "#shared/helpers/string";
import { Search } from 'lucide-vue-next';
import {useThrottle} from "~/composables/shared/useThrottle";

const searchText = ref('');
const searchQuery = useThrottle(searchText, 800);
const route = useRoute();
const fruitTypeSlug = isString(route.params?.['fruit_type_slug']) ? route.params['fruit_type_slug'] : 'apple';

const d = 'Browse our comprehensive directory of apple varieties. Filter by name or origin to discover detailed profiles.';
useSeoMeta({
  title: 'Apple Directory',
  description: d,
  ogDescription: d,
})
</script>

<template>
  <div>
    <div class="mt-2 mb-3 items-end flex justify-between flex-wrap">
      <h2 class="pr-4 flex text-2xl font-serif">All Apples</h2>

      <div class="flex-1 max-w-96 min-w-52">
        <label for="search" class="block mb-2.5 text-sm font-medium text-heading">Search by name</label>
        <div class="relative">
          <input type="text" id="search" placeholder="cripps pink" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" v-model="searchText" />
          <Search class="absolute m-auto top-0 bottom-0 right-3 left-auto" />
        </div>
      </div>
    </div>

    <div class="pt-2">
      <fruits-table :type-slug="fruitTypeSlug" :search-term="searchQuery" />
    </div>
  </div>
</template>

<style scoped>
</style>