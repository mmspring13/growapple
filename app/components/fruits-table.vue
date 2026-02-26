<script setup lang="ts">
import { ref, computed } from 'vue';
import type {AllFruitsByTypeFruit} from '#shared/api/types';

const props = defineProps<{
  tableData: AllFruitsByTypeFruit[];
  loading?: boolean;
}>();

const getFruitNames = (fruitIds: number[]) => {
  return fruitIds.filter(() => {

  }).map(id => {
    const fruit = props.tableData?.find(f => f.id === id);
    return {
      id: id,
      name: fruit ? fruit.name : `Unknown (${id})`,
      slug: fruit?.slug,
    };
  });
};
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle shadow-sm rounded border">
      <thead class="table-light">
      <tr>
        <th scope="col" style="width: 40px;"></th>
        <th scope="col" class="text-uppercase small fw-bold">ID</th>
        <th scope="col" class="text-uppercase small fw-bold">Image</th>
        <th scope="col" class="text-uppercase small fw-bold">Name</th>
        <th scope="col" class="text-uppercase small fw-bold">Year</th>
        <th scope="col" class="text-uppercase small fw-bold">Parentage</th>
        <th scope="col" class="text-uppercase small fw-bold">Children</th>
      </tr>
      </thead>

      <tbody>
      <tr v-if="loading">
        <td colspan="6" class="text-center py-5">
          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          <span>Loading...</span>
        </td>
      </tr>

      <tr v-else-if="tableData.length === 0">
        <td colspan="6" class="text-center py-5 text-muted">
          No fruits found.
        </td>
      </tr>

      <template v-else v-for="fruit in tableData" :key="fruit.id">
        <fruits-table-row
          :fruit="fruit"
        >
          <template #parentage="{ parentage }">
            <ul class="list-unstyled small mb-0">
              <li v-for="parent in getFruitNames(parentage)" :key="parent.id">
                <NuxtLink target="_blank" :to="`/fruit/${parent.id}`">
                  • {{ parent.name }}
                </NuxtLink>
              </li>
            </ul>
          </template>
          <template #children="{ children }">
            <ul class="list-unstyled small mb-0">
              <li v-for="child in getFruitNames(children)" :key="child.id">
                • {{ child.name }}
              </li>
            </ul>
          </template>
        </fruits-table-row>
      </template>
      </tbody>
    </table>
  </div>
</template>
