><!-- pages/apples.vue -->
<template>
  <div class="space-y-8">
    <div
      class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors duration-300"
      :class="{ 'animate-pulse pointer-events-none': isLoading }"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-stone-200 dark:divide-stone-800">
          <colgroup>
            <col style="width: 64px" />
            <col style="width: 20%" />
            <col style="width: auto" />
            <col style="width: auto" />
            <col style="width: 42%" />
            <col style="width: auto" />
          </colgroup>
          <thead class="bg-stone-50 dark:bg-stone-950">
          <tr>
            <th scope="col" class="table-th">
              #ID
            </th>
            <th scope="col" class="table-th">
              Variety Name
            </th>
            <th scope="col" class="table-th">
              Year
            </th>
            <th scope="col" class="table-th">
              Family
            </th>
            <th scope="col" class="table-th">
              Description
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
                <div class="flex-shrink-0 block border relative overflow-hidden h-10 w-10 rounded-full flex items-center justify-center border-stone-100 dark:border-stone-700" :style="{ backgroundColor: (apple.rest?.color || '#ccc') + '20' }">
                  <NuxtImg
                    v-if="apple.avatar"
                    loading="lazy"
                    placeholder
                    placeholder-class="app-img-shimmer"
                    class="w-full h-full absolute img-fluid object-cover"
                    :alt="`image of ${apple.name}`"
                    :src="apple.avatar.url"
                    provider="baseProvider"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {{ apple.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">{{ apple.opening_year || "Unknown" }}</div>
            </td>
            <td class="table-td-default">
              <div class="flex flex-col items-start gap-y-1.5">
                <span
                  class="family-label"
                >
                  {{ apple.parentage?.length }} Parents
                </span>
              <span
                class="family-label"
              >
                  {{ apple.children?.length }} Offsprings
              </span>
              </div>
            </td>
            <td class="table-td-default">
              <div class="text-sm text-stone-900 dark:text-stone-300 font-mono whitespace-pre-wrap line-clamp-2 text-ellipsis overflow-hidden">
                {{ apple.short_description }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink :to="`/fruit/${apple.slug}`" class="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 inline-flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
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
      
      <!-- Pagination Controls -->
      <div v-if="pageInfo && totalCount > itemsPerPage" class="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
        <div class="flex items-center justify-between">
          <div class="text-sm text-stone-700 dark:text-stone-300">
            Showing <span class="font-medium">{{ currentPage * itemsPerPage + 1 }}</span> to 
            <span class="font-medium">{{ Math.min((currentPage + 1) * itemsPerPage, totalCount) }}</span> of 
            <span class="font-medium">{{ totalCount }}</span> results
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 0"
              class="pagination-cursor-btn"
            >
              Previous
            </button>
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-orange-600 text-white'
                    : 'border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                ]"
              >
                {{ page + 1 }}
              </button>
            </div>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="!pageInfo.hasNextPage"
              class="pagination-cursor-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import {
  ListOfFruitsDocument,
  type ListOfFruitsQuery,
  type ListOfFruitsQueryVariables
} from "~/composables/fruits/list-of-fruits.generated";

const props = defineProps<{
  typeSlug: string;
  searchTerm?: string;
}>();

const { $apollo } = useNuxtApp();
const config = useRuntimeConfig();

// Pagination state
const currentPage = ref(0);
const itemsPerPage = ref(config.public.listFruitsLimit);
const tableData = ref([]);
const pageInfo = ref(null);
const totalCount = ref(0);
const isLoading = ref(true);

// Fetch data function
const fetchData = async () => {
  isLoading.value = true;

  const query = await $apollo.query<ListOfFruitsQuery, ListOfFruitsQueryVariables>({
    query: ListOfFruitsDocument,
    variables: {
      search: props.searchTerm,
      type: props.typeSlug,
      skip: currentPage.value * itemsPerPage.value,
      take: itemsPerPage.value
    }
  }).finally(() => {
    isLoading.value = false;
  });
  
  tableData.value = query?.data?.fruits?.data || [];
  pageInfo.value = query?.data?.fruits?.pageInfo || null;
  totalCount.value = query?.data?.fruits?.totalCount || 0;
}

// Initial data fetch
await fetchData()

// Search functionality
const searchTerm = ref('')

const filteredFruits = computed(() => {
  if (!searchTerm.value) return tableData.value

  return tableData.value.filter(fruit =>
    fruit.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Pagination functions
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(0, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible)
  
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible)
  }
  
  for (let i = start; i < end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = async (page: number) => {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  await fetchData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Navigation function
const navigateToApple = (slug) => {
  navigateTo(`/fruit/${slug}`)
}

watch(() => props.searchTerm, () => {
  currentPage.value = 0;
  fetchData();
});
</script>

<style scoped>
@reference "tailwindcss";

.table-th {
  @apply px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono;
}
.table-td-default {
  @apply px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400;
}
.pagination-cursor-btn {
  @apply px-3 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
.family-label {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300;
}
</style>
