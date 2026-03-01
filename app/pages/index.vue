<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
    <div class="space-y-6 max-w-3xl">
      <h1 class="text-6xl md:text-8xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
        The Apple <br />
        <span class="italic text-orange-600 dark:text-orange-500">Genealogy</span> Project
      </h1>
      <p class="text-xl md:text-2xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
        Explore the rich history, genetic lineage, and complex relationships of the world's most popular apple cultivars.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
      <NuxtLink
        to="/apple"
        class="group relative overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 text-left transition-all hover:border-orange-500/50 hover:shadow-lg dark:hover:border-orange-500/30"
      >
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <LucideListTree class="w-32 h-32" />
        </div>
        <div class="relative z-10 space-y-4">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <LucideListTree class="w-6 h-6" />
          </div>
          <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">Browse Directory</h2>
          <p class="text-stone-600 dark:text-stone-400">
            View a comprehensive list of apple varieties, filter by name or origin, and discover detailed profiles.
          </p>
          <div class="flex items-center text-orange-600 dark:text-orange-400 font-medium mt-4 group-hover:translate-x-1 transition-transform">
            Go to Directory <ArrowRight class="w-4 h-4 ml-2" />
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/graph"
        class="group relative overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 text-left transition-all hover:border-blue-500/50 hover:shadow-lg dark:hover:border-blue-500/30"
      >
        <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <NetworkIcon class="w-32 h-32" />
        </div>
        <div class="relative z-10 space-y-4">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <NetworkIcon class="w-6 h-6" />
          </div>
          <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">Network Graph</h2>
          <p class="text-stone-600 dark:text-stone-400">
            Visualize the genetic connections between varieties in an interactive force-directed graph.
          </p>
          <div class="flex items-center text-blue-600 dark:text-blue-400 font-medium mt-4 group-hover:translate-x-1 transition-transform">
            View Graph <ArrowRight class="w-4 h-4 ml-2" />
          </div>
        </div>
      </NuxtLink>
    </div>

    <div class="pt-12 border-t border-stone-200 dark:border-stone-800 w-full max-w-2xl">
      <div class="flex justify-center gap-8 text-stone-400 dark:text-stone-600 font-mono text-sm uppercase tracking-widest">
        <span>Est. 2026</span>
        <span>•</span>
        <span>Pomology Database</span>
        <span>•</span>
        <span>v1.0.0</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, ArrowLeft, NetworkIcon, LucideListTree } from 'lucide-vue-next';

const { $apollo } = useNuxtApp();
</script>
