<!-- pages/apples.vue -->
<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-4xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-2">Apple Varieties</h1>
        <p class="text-stone-500 dark:text-stone-400 max-w-2xl">
          Explore the rich history and genetic lineage of the world's most popular apple cultivars.
        </p>
      </div>
      <div class="relative w-full md:w-72">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-stone-400" />
        </div>
        <input
          type="text"
          placeholder="Search apples..."
          class="block w-full pl-10 pr-3 py-2 border border-stone-200 dark:border-stone-700 rounded-lg leading-5 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
          v-model="searchTerm"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
          <thead class="bg-stone-50 dark:bg-stone-950">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              #ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Variety Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Origin
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Year
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono">
              Family
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">View</span>
            </th>
          </tr>
          </thead>
          <tbody class="bg-white dark:bg-stone-900 divide-y divide-stone-200 dark:divide-stone-800">
          <tr
            v-for="apple in filteredFruits"
            :key="apple.id"
            @click="navigateToApple(apple.slug)"
            class="hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group cursor-pointer"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">
                {{ apple.id }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border border-stone-100 dark:border-stone-700" :style="{ backgroundColor: (apple.rest?.color || '#ccc') + '20' }">
                  <a
                    v-if="apple.images?.[0]"
                    :href="apple.images?.[0]"
                    :key="apple.images?.[0]"
                    target="_blank"
                    class="block border rounded-full relative overflow-hidden"
                    style="width: 40px; aspect-ratio: 1"
                  >
                    <NuxtImg
                      class="w-full h-full absolute img-fluid object-cover"
                      :alt="`image of ${apple.name}`"
                      :src="apple.images?.[0]"
                      provider="baseProvider"
                    />
                  </a>
<!--                  <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: apple.rest?.color || '#ccc' }"></div>-->
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {{ apple.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-stone-500 dark:text-stone-400">{{ apple.rest?.origin || "Unknown" }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">{{ apple.opening_year || "Unknown" }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                <span
                  v-if="apple.parentage?.length > 0"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300"
                >
                  {{ apple.parentage.length }} Parents
                </span>
              <span v-else class="text-stone-400 dark:text-stone-600 italic text-xs">Chance Seedling</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink :to="`/apple/${apple.slug}`" class="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 inline-flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                Details <ArrowRight class="w-4 h-4" />
              </NuxtLink>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredFruits.length === 0" class="p-12 text-center text-stone-500 dark:text-stone-400">
        No apples found matching "{{ searchTerm }}".
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ArrowRight } from 'lucide-vue-next'
import type {AllFruitsByTypeFruit} from "#shared/api/types";

// Define props if needed
// const props = defineProps({
//   apples: {
//     type: Array,
//     required: true
//   }
// })
const props = defineProps<{
  tableData: AllFruitsByTypeFruit[];
  loading?: boolean;
}>();

// Search functionality
const searchTerm = ref('')

const filteredFruits = computed(() => {
  if (!searchTerm.value) return props.tableData

  return props.tableData.filter(fruit =>
    fruit.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Navigation function
const navigateToApple = (slug) => {
  navigateTo(`/apple/${slug}`)
}

// Alternative: If you want to use the router directly
// const router = useRouter()
// const navigateToApple = (slug) => {
//   router.push(`/apple/${slug}`)
// }
</script>

<style scoped>
/* Any component-specific styles can go here */
</style>

<!--<script setup lang="ts">-->
<!--import { ref, computed } from 'vue';-->
<!--import type {AllFruitsByTypeFruit} from '#shared/api/types';-->

<!--const props = defineProps<{-->
<!--  tableData: AllFruitsByTypeFruit[];-->
<!--  loading?: boolean;-->
<!--}>();-->

<!--const getFruitNames = (fruitIds: number[]) => {-->
<!--  return fruitIds.filter(() => {-->

<!--  }).map(id => {-->
<!--    const fruit = props.tableData?.find(f => f.id === id);-->
<!--    return {-->
<!--      id: id,-->
<!--      name: fruit ? fruit.name : `Unknown (${id})`,-->
<!--      slug: fruit?.slug,-->
<!--    };-->
<!--  });-->
<!--};-->
<!--</script>-->

<!--<template>-->
<!--  <div class="table-responsive">-->
<!--    <table class="table table-hover align-middle shadow-sm rounded border">-->
<!--      <thead class="table-light">-->
<!--      <tr>-->
<!--        <th scope="col" style="width: 40px;"></th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">ID</th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">Image</th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">Name</th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">Year</th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">Parentage</th>-->
<!--        <th scope="col" class="text-uppercase small fw-bold">Children</th>-->
<!--      </tr>-->
<!--      </thead>-->

<!--      <tbody>-->
<!--      <tr v-if="loading">-->
<!--        <td colspan="6" class="text-center py-5">-->
<!--          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>-->
<!--          <span>Loading...</span>-->
<!--        </td>-->
<!--      </tr>-->

<!--      <tr v-else-if="tableData.length === 0">-->
<!--        <td colspan="6" class="text-center py-5 text-muted">-->
<!--          No fruits found.-->
<!--        </td>-->
<!--      </tr>-->

<!--      <template v-else v-for="fruit in tableData" :key="fruit.id">-->
<!--        <fruits-table-row-->
<!--          :fruit="fruit"-->
<!--        >-->
<!--          <template #parentage="{ parentage }">-->
<!--            <ul class="list-unstyled small mb-0">-->
<!--              <li v-for="parent in getFruitNames(parentage)" :key="parent.id">-->
<!--                <NuxtLink target="_blank" :to="`/fruit/${parent.id}`">-->
<!--                  • {{ parent.name }}-->
<!--                </NuxtLink>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </template>-->
<!--          <template #children="{ children }">-->
<!--            <ul class="list-unstyled small mb-0">-->
<!--              <li v-for="child in getFruitNames(children)" :key="child.id">-->
<!--                • {{ child.name }}-->
<!--              </li>-->
<!--            </ul>-->
<!--          </template>-->
<!--        </fruits-table-row>-->
<!--      </template>-->
<!--      </tbody>-->
<!--    </table>-->
<!--  </div>-->
<!--</template>-->
