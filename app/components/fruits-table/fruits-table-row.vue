<template>
  <tr
    class="fruit-table-row group hover:bg-primary-50"
    :style="{ '--fruit-color': fruit.color || '#087E8B' }"
    @click="navigateToFruit"
  >
    <td class="table-td-default">
      <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">
        {{ fruit.id }}
      </div>
    </td>
    <td class="table-td-default">
      <div class="flex items-center">
        <div 
          class="shrink-0 border relative overflow-hidden h-10 w-10 rounded-full flex items-center justify-center border-stone-200 dark:border-stone-700"
          :style="{ backgroundColor: (fruit?.color || '#ccc') + '20' }"
        >
          <NuxtImg
            v-if="fruit.avatar"
            loading="lazy"
            placeholder
            placeholder-class="app-img-shimmer"
            class="w-full h-full absolute img-fluid object-cover"
            :alt="`image of ${fruit.name}`"
            :src="fruit.avatar.url"
            provider="baseProvider"
          />
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ fruit.name }}
          </div>
        </div>
      </div>
    </td>
    <td class="table-td-default">
      <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">{{ fruit.opening_year || "Unknown" }}</div>
    </td>
    <td class="table-td-default">
      <div class="flex flex-col items-start gap-y-1.5">
        <span class="family-label">
          {{ fruit.parentage?.length }} Parents
        </span>
        <span class="family-label">
          {{ fruit.children?.length }} Offsprings
        </span>
      </div>
    </td>
    <td class="table-td-default">
      <div class="text-sm text-stone-900 dark:text-stone-300 font-mono whitespace-pre-wrap line-clamp-2 text-ellipsis overflow-hidden">
        {{ fruit.short_description }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <NuxtLink :to="`/fruit/${fruit.slug}`" class="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 inline-flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
        Details <ArrowRight class="w-4 h-4" />
      </NuxtLink>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type {Fruit} from "~~/composables/fruits/types";

const props = defineProps<{
  fruit: Fruit;
}>();

const navigateToFruit = () => {
  navigateTo(`/fruit/${props.fruit.slug}`);
};
</script>

<style scoped>
@reference "tailwindcss";

.fruit-table-row {
  @apply relative transition-colors cursor-pointer;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(90deg,
    var(--color-stone-800) 16%,
    var(--color-stone-900) 24%,
    var(--fruit-color) 100%);
    opacity: .15;
  }
}

.table-td-default {
  @apply px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400 z-10;
}
.family-label {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300;
}
</style>
