<script setup lang="ts">
import { ArrowLeft, Calendar, MapPin, GitBranch } from 'lucide-vue-next';
import FruitsGeneticTree from "~/components/fruits-genetic-tree/fruits-genetic-tree.vue";
import { AppFruitDocument, type AppFruitQuery, type AppFruitQueryVariables } from "~/composables/fruit/fruit.generated";

const route = useRoute();
const fruitSlug = route.params.slug as string;

const { $apollo } = useNuxtApp();

const query = await $apollo.query<AppFruitQuery, AppFruitQueryVariables>({
  query: AppFruitDocument,
  variables: {
    slug: fruitSlug
  }
});

const fruit = query?.data?.fruit;

if (!fruit) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Fruit not found'
  });
}

const parents = fruit.parentage?.data || [];
const children = fruit.children?.data || [];
</script>

<template>
  <div class="space-y-8">
    <NuxtLink to="/" class="inline-flex items-center text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
      <ArrowLeft class="w-4 h-4 mr-1" /> Back to Directory
    </NuxtLink>

    <!-- Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 uppercase tracking-wider">
              {{ fruit.id }}
            </span>
          </div>
          <h1 class="text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mb-4">
            {{ fruit.name }}
          </h1>
          <p class="text-xl text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
            {{ fruit.description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-6 py-6 border-y border-stone-200 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-stone-400 dark:text-stone-500" />
            <div>
              <div class="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Introduced</div>
              <div class="font-mono text-stone-900 dark:text-stone-200">{{ fruit.opening_year || "Unknown" }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <MapPin class="w-5 h-5 text-stone-400 dark:text-stone-500" />
            <div>
              <div class="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold">Type</div>
              <div class="text-stone-900 dark:text-stone-200 capitalize">{{ fruit.type?.name || "Unknown" }}</div>
            </div>
          </div>
        </div>

        <!-- Lineage Text Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border border-stone-100 dark:border-stone-800">
            <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GitBranch class="w-4 h-4" /> Parentage
            </h3>
            <ul v-if="parents.length > 0" class="space-y-2">
              <li v-for="p in parents" :key="p.id">
                <NuxtLink :to="`/fruit/${p.slug}`" class="flex items-center gap-2 group">
                  <div class="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-orange-500 transition-colors"></div>
                  <span class="text-stone-700 dark:text-stone-300 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4 group-hover:decoration-orange-300 dark:group-hover:decoration-orange-500">
                    {{ p.name }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <p v-else class="text-stone-500 dark:text-stone-500 italic text-sm">Chance seedling (Unknown parents)</p>
          </div>

          <div class="bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border border-stone-100 dark:border-stone-800">
            <h3 class="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GitBranch class="w-4 h-4 rotate-180" /> Offspring
            </h3>
            <ul v-if="children.length > 0" class="space-y-2">
              <li v-for="c in children" :key="c.id">
                <NuxtLink :to="`/fruit/${c.slug}`" class="flex items-center gap-2 group">
                  <div class="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-orange-500 transition-colors"></div>
                  <span class="text-stone-700 dark:text-stone-300 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4 group-hover:decoration-orange-300 dark:group-hover:decoration-orange-500">
                    {{ c.name }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
            <p v-else class="text-stone-500 dark:text-stone-500 italic text-sm">No recorded major offspring</p>
          </div>
        </div>
      </div>

      <!-- Sidebar / Visual -->
      <div class="lg:col-span-1">
        <div v-if="fruit.images && fruit.images.length > 0" class="aspect-square rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800 shadow-inner relative overflow-hidden">
          <NuxtImg
            class="w-full h-full object-cover rounded-2xl"
            :alt="`Image of ${fruit.name}`"
            :src="fruit.images[0]"
            provider="baseProvider"
          />
        </div>
        <div v-else class="aspect-square rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800 shadow-inner relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] dark:bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div class="w-48 h-48 rounded-full shadow-2xl relative z-10 bg-gradient-to-br from-orange-400 to-orange-600">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-stone-700 dark:bg-stone-900 rounded-full rotate-12"></div>
          </div>
        </div>
        <p class="text-center text-xs text-stone-400 dark:text-stone-500 mt-2 font-mono">
          {{ fruit.images && fruit.images.length > 0 ? fruit.name : 'Representative Visualization' }}
        </p>
      </div>
    </div>

    <!-- Genetic Tree Visualization -->
    <div class="pt-8 border-t border-stone-200 dark:border-stone-800">
      <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-6">Genetic Tree Visualization</h2>
      <p class="text-stone-500 dark:text-stone-400 mb-6 max-w-3xl">
        Interactive visualization of {{ fruit.name }}'s immediate genetic network.
        Nodes are clickable. Top level represents parents, middle is the current variety, bottom are children.
      </p>
      <fruits-genetic-tree :fruit="fruit" />
    </div>
  </div>
</template>

