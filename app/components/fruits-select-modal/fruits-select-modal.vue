<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import { X, Search, Check } from 'lucide-vue-next';
import {
  FilteredFruitsDocument,
  type FilteredFruitsQuery,
  type FilteredFruitsQueryVariables
} from "~/components/fruits-select-modal/filtered-fruits.generated";

interface Props {
  isOpen: boolean;
  selected: Set<string>;
}

interface Fruit {
  id: string;
  name?: string | null;
  slug: string;
  avatar?: { url: string } | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'update:selectedIds']);

const ITEMS_PER_PAGE = 12;
const skip = ref(0);
const searchTerm = ref('');
const debouncedSearch = ref('');
const isLoading = ref(false);
const hasNextPage = ref(true);

const localSelected = reactive<Set<string>>(new Set());
const allFruits = ref<Fruit[]>([]);
const selectedFruitsCache = ref<Map<string, Fruit>>(new Map());
const observerTarget = ref<HTMLElement | null>(null);

const { $apollo } = useNuxtApp();

let searchTimeout: NodeJS.Timeout | null = null;

watch(searchTerm, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
    skip.value = 0;
    allFruits.value = [];
    loadFruits();
  }, 300);
});

const selectedFruits = computed(() => {
  const selected: Fruit[] = [];
  
  localSelected.forEach((slug) => {
    const fruitInList = allFruits.value.find(f => f.slug === slug);
    if (fruitInList) {
      selected.push(fruitInList);
    } else {
      const cachedFruit = selectedFruitsCache.value.get(slug);
      if (cachedFruit) {
        selected.push(cachedFruit);
      }
    }
  });
  
  return selected;
});

const unselectedFruits = computed(() => {
  return allFruits.value.filter(fruit => !localSelected.has(fruit.slug));
});

const loadFruits = async () => {
  if (isLoading.value || !hasNextPage.value) return;
  
  isLoading.value = true;
  
  try {
    console.log("Start request");
    const result = await $apollo.query<FilteredFruitsQuery, FilteredFruitsQueryVariables>({
      query: FilteredFruitsDocument,
      variables: {
        type: 'apple',
        take: ITEMS_PER_PAGE,
        skip: skip.value,
        search: debouncedSearch.value || null
      },
      fetchPolicy: 'network-only'
    });
    console.log("finish request", result);

    const newFruits = result.data?.fruits?.data || [];
    hasNextPage.value = result.data?.fruits?.pageInfo?.hasNextPage || false;
    
    newFruits.forEach(fruit => {
      if (localSelected.has(fruit.slug) && !selectedFruitsCache.value.has(fruit.slug)) {
        selectedFruitsCache.value.set(fruit.slug, fruit);
      }
    });
    
    if (skip.value === 0) {
      allFruits.value = newFruits;
    } else {
      allFruits.value = [...allFruits.value, ...newFruits];
  }
    
    skip.value += newFruits.length;
  } catch (error) {
    console.error('Error loading fruits:', error);
  } finally {
    isLoading.value = false;
  }
};

const setupIntersectionObserver = () => {
  if (!observerTarget.value) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage.value && !isLoading.value) {
        loadFruits();
      }
    },
    { threshold: 0.1 }
  );
  
  observer.observe(observerTarget.value);
  
  return () => observer.disconnect();
};

watch(() => props.isOpen, async (open) => {
  if (open) {
    localSelected.clear();
    props.selected.forEach((slug) => {
      localSelected.add(slug);
    });
    
    skip.value = 0;
    allFruits.value = [];
    hasNextPage.value = true;
    searchTerm.value = '';
    debouncedSearch.value = '';
    console.log("loading fruits");
    await loadFruits();
    
    await nextTick();
    
    allFruits.value.forEach(fruit => {
      if (localSelected.has(fruit.slug) && !selectedFruitsCache.value.has(fruit.slug)) {
        selectedFruitsCache.value.set(fruit.slug, fruit);
      }
    });
    
    setupIntersectionObserver();
  }
});

const toggleSelection = (slug: string) => {
  if (localSelected.has(slug)) {
    localSelected.delete(slug);
  } else {
    localSelected.add(slug);
    
    const fruit = allFruits.value.find(f => f.slug === slug);
    if (fruit && !selectedFruitsCache.value.has(slug)) {
      selectedFruitsCache.value.set(slug, fruit);
    }
  }
};

const selectAll = () => {
  allFruits.value.forEach(fruit => {
    localSelected.add(fruit.slug);
    if (!selectedFruitsCache.value.has(fruit.slug)) {
      selectedFruitsCache.value.set(fruit.slug, fruit);
    }
  });
};

const clearSelection = () => {
  localSelected.clear();
};

const onConfirm = () => {
  emit('update:selectedIds', Array.from(localSelected));
  emit('close');
};

const onReset = () => {
  localSelected.clear();
  props.selected.forEach((slug) => {
    localSelected.add(slug);
  });
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="emit('close')"
        />

        <Transition name="modal-pop" appear>
          <div class="relative bg-white dark:bg-stone-900 w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col border border-stone-200 dark:border-stone-800 overflow-hidden">

            <div class="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-900/50">
              <div>
                <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
                  Select Apples
                </h2>
                <p class="text-sm text-stone-500 dark:text-stone-400">
                  {{ localSelected.size }} selected
                </p>
              </div>
              <button
                @click="emit('close')"
                class="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors"
              >
                <X class="w-5 h-5 text-stone-500 dark:text-stone-400" />
              </button>
            </div>

            <div class="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-stone-900">
              <div class="relative w-full sm:w-72">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Search varieties..."
                  class="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div class="flex gap-2 w-full sm:w-auto">
                <button
                  @click="selectAll"
                  class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
                >
                  Select All
                </button>
                <button
                  @click="clearSelection"
                  class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent"
                >
                  Clear
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6 min-h-0 max-h-96">
              <TransitionGroup
                name="list"
                tag="div"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                <div
                  v-for="apple in selectedFruits"
                  :key="'selected-' + apple.id"
                  @click="toggleSelection(apple.slug)"
                  class="group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-500"
                >
                  <div class="absolute top-3 right-3">
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors bg-orange-500 border-orange-500 text-white">
                      <Check class="w-3 h-3" />
                    </div>
                  </div>

                  <div class="flex-shrink-0 block border relative overflow-hidden h-10 w-10 rounded-full flex items-center justify-center border-stone-100 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                    <NuxtImg
                      v-if="apple.avatar"
                      class="w-full h-full absolute img-fluid object-cover"
                      :alt="`image of ${apple.name}`"
                      :src="apple.avatar.url"
                      provider="baseProvider"
                    />
                  </div>

                  <div>
                    <h3 class="font-medium text-stone-900 dark:text-stone-100 text-sm leading-tight">
                      {{ apple.name }}
                    </h3>
                  </div>
                </div>

                <div
                  v-for="apple in unselectedFruits"
                  :key="'unselected-' + apple.id"
                  @click="toggleSelection(apple.slug)"
                  class="group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  <div class="absolute top-3 right-3">
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 group-hover:border-orange-400">
                    </div>
                  </div>

                  <div class="flex-shrink-0 block border relative overflow-hidden h-10 w-10 rounded-full flex items-center justify-center border-stone-100 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                    <NuxtImg
                      v-if="apple.avatar"
                      class="w-full h-full absolute img-fluid object-cover"
                      :alt="`image of ${apple.name}`"
                      :src="apple.avatar.url"
                      provider="baseProvider"
                    />
                  </div>

                  <div>
                    <h3 class="font-medium text-stone-900 dark:text-stone-100 text-sm leading-tight">
                      {{ apple.name }}
                    </h3>
                  </div>
                </div>
              </TransitionGroup>

              <div ref="observerTarget" class="h-4 w-full mt-4" />

              <div v-if="isLoading" class="text-center py-4">
                <div class="inline-block w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div v-if="!isLoading && allFruits.length === 0" class="text-center py-12 text-stone-500">
                No apples found{{ searchTerm ? ` matching "${searchTerm}"` : '' }}
              </div>
            </div>

            <div class="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex items-center justify-end gap-4">
              <button
                @click="onReset"
                class="px-5 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-700"
              >
                Reset
              </button>
              <button
                @click="onConfirm"
                class="px-6 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Fade/Scale Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-pop-leave-active {
  transition: all 0.2s ease-in;
}
.modal-pop-enter-from, .modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Grid List Animations with smooth movement */
.list-move {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}
</style>