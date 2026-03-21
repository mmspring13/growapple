><!-- pages/apples.vue -->
<template>
  <div class="space-y-8">
    <div
      class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-colors duration-300"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-stone-200 dark:divide-stone-800 relative min-h-24">
          <colgroup>
            <col style="width: 64px" />
            <col style="width: 20%" />
            <col style="width: auto" />
            <col style="width: auto" />
            <col style="width: 42%" class="min-w-md" />
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

          <Transition name="slide-up">
            <tbody class="bg-white dark:bg-stone-900 divide-y divide-stone-200 dark:divide-stone-800" v-if="isLoading">
              <fruits-table-row-skeleton
                v-for="i in 5"
                :key="`skeleton-${i}`"
              />
            </tbody>

            <tbody v-else class="bg-white dark:bg-stone-900 divide-y divide-stone-200 dark:divide-stone-800">
              <fruits-table-row
                v-for="(fruit, i) in tableData"
                :key="fruit.id"
                :fruit="fruit"
              />
            </tbody>
          </Transition>
        </table>
      </div>
      <div v-if="!isLoading && tableData?.length === 0" class="p-12 text-center text-stone-500 dark:text-stone-400">
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
import type {
  ListOfFruitsQuery,
  ListOfFruitsQueryVariables
} from "~/composables/fruits/list-of-fruits.generated";
import { ListOfFruitsDocument } from "~/composables/fruits/list-of-fruits.generated";

const props = defineProps<{
  typeSlug: string;
  searchTerm?: string;
}>();

const { $apollo } = useNuxtApp();
const config = useRuntimeConfig();

const currentPage = ref(0);
const itemsPerPage = ref(config.public.listFruitsLimit);
const totalCount = ref(0);
const searchTerm = ref('');

const queryKey = computed(() => `fruits-${props.searchTerm}-${currentPage.value}`)
const { data, pending: isLoading } = await useAsyncData(
  queryKey.value,
  () => $apollo.query<ListOfFruitsQuery, ListOfFruitsQueryVariables>({
    query: ListOfFruitsDocument,
    variables: {
      search: props.searchTerm,
      type: props.typeSlug,
      skip: currentPage.value * itemsPerPage.value,
      take: itemsPerPage.value
    }
  }),
  {
    lazy: true,
    watch: [queryKey],
    transform: (result) => {
      if (!result.error) {
        return result.data?.fruits;
      }
    }
  }
);

const tableData = computed(() => data.value?.data);
const pageInfo = computed(() => data.value?.pageInfo);
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => props.searchTerm, () => {
  currentPage.value = 0;
});
</script>

<style scoped>
@reference "tailwindcss";

.table-th {
  @apply px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider font-mono;
}

.pagination-cursor-btn {
  @apply px-3 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}


/* 1. The Fade-Out (Skeleton) */
.fade-out-leave-active {
  transition: opacity 0.4s ease-out, transform 0.6s ease-out;
}

.fade-out-leave-to {
  opacity: 0;
  //transform: scale(0.84); /* Subtle shrink makes it feel like it's receding */
}

/* 2. The Slide-Up (Real Data) */
.slide-up-enter-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(25px);
}

/* smooth move for existing rows */
.slide-up-move {
  transition: transform 0.6s ease;
}
</style>
