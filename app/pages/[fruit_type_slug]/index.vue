<script setup lang="ts">
import FruitsTable from '~/components/fruits-table/fruits-table.vue'
import { ref, computed } from 'vue';
import {isString} from "#shared/helpers/string";

const searchQuery = ref('');
const route = useRoute();
const fruitTypeSlug = isString(route.params?.['fruit_type_slug']) ? route.params['fruit_type_slug'] : 'apple';
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
    </div>

    <div class="pt-2">
      <fruits-table :type-slug="fruitTypeSlug" />
    </div>
  </div>
</template>

<style scoped>
</style>