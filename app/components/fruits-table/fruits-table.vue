><!-- pages/apples.vue -->
<template>
  <div class="space-y-8">
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
              <div class="text-sm text-stone-900 dark:text-stone-300 font-mono">{{ apple.opening_year || "Unknown" }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300"
                >
                  {{ 10 }} Parents
                </span>
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
              class="px-3 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              class="px-3 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
}>();

const { $apollo } = useNuxtApp();

// Pagination state
const currentPage = ref(0)
const itemsPerPage = ref(10)
const tableData = ref([])
const pageInfo = ref(null)
const totalCount = ref(0)

// Fetch data function
const fetchData = async () => {
  const query = await $apollo.query<ListOfFruitsQuery, ListOfFruitsQueryVariables>({
    query: ListOfFruitsDocument,
    variables: {
      type: props.typeSlug,
      skip: currentPage.value * itemsPerPage.value,
      take: itemsPerPage.value
    }
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
  navigateTo(`/apple/${slug}`)
}
</script>

<style scoped>
/* Any component-specific styles can go here */
</style>
