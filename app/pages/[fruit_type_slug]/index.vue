<script setup lang="ts">
import {useApi} from "~/hooks/useApi";
import { ref, computed } from 'vue';
import {isString} from "#shared/helpers/string";

const api = useApi();

const searchQuery = ref('');
const route = useRoute();
const fruitTypeSlug = isString(route.params?.['fruit_type_slug']) ? route.params['fruit_type_slug'] : 'apple';

// const allFruitsResponse = await api.fetchFruitsByType(fruitTypeSlug);
//
// const filteredApples = computed(() => {
//   if (!searchQuery.value) return allFruitsResponse.data;
//
//   const query = searchQuery.value.toLowerCase();
//   return allFruitsResponse.data.filter(apple =>
//     apple.name.toLowerCase().includes(query)
//   );
// });
</script>

<template>
  <div>
    <h2>All Apples</h2>

    <div class="pt-3 row">
      <div class="col-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search apples by name..."
          class="form-control"
        />
      </div>
<!--      <span class="results-count align-self-center col-4">{{ filteredApples?.length }} apples found</span>-->
    </div>

    <div class="pt-2">
      <fruit-fruits-table :type-slug="fruitTypeSlug" />
<!--      <fruits-table :table-data="filteredApples" />-->

<!--      <div v-if="filteredApples.length === 0" class="no-results">-->
<!--        No apples found matching "{{ searchQuery }}"-->
<!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
</style>