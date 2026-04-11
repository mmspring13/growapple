<script setup lang="ts">
import { Info, Leaf, Network, Scale } from "lucide-vue-next";

const d = 'Learn about the Apple Genealogy Project, our mission to map the genetic heritage of apples.';
useSeoMeta({
  title: 'About us',
  description: d,
  ogDescription: d,
})
</script>

<template>
  <div class="text-center space-y-4">
    <h1 class="text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight">
      About the Project
    </h1>
    <p class="text-xl text-stone-600 dark:text-stone-400">
      Mapping the genetic heritage of the world's most beloved fruit.
    </p>
  </div>

  <div class="prose prose-stone dark:prose-invert max-w-none space-y-8 mt-6">
    <div class="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
          <Leaf class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 m-0">
          Our Mission
        </h2>
      </div>
      <p class="text-stone-600 dark:text-stone-300 leading-relaxed">
        The Apple Genealogy Project is dedicated to preserving and visualizing the complex genetic history of apple cultivars. From ancient chance seedlings to modern bred varieties, every apple has a story. Our goal is to make this rich botanical history accessible and engaging for pomologists, farmers, and apple enthusiasts alike.
      </p>
    </div>

    <div class="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Network class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 m-0">
          The Data
        </h2>
      </div>
      <p class="text-stone-600 dark:text-stone-300 leading-relaxed">
        Our database tracks the parentage, origin, and key characteristics of various apple varieties. By mapping these relationships, we can generate interactive network graphs that reveal how different lineages have influenced the apples we eat today. For example, you can visually trace how the classic 'Golden Delicious' has parented numerous modern favorites like 'Gala' and 'Pink Lady'.
      </p>
    </div>

    <div class="bg-stone-50 dark:bg-stone-900/50 p-8 rounded-2xl border border-stone-200 dark:border-stone-800">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400">
          <Info class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 m-0">
          Open Source
        </h2>
      </div>
      <p class="text-stone-600 dark:text-stone-300 leading-relaxed">
        This project is built with modern web technologies including Nuxtjs, D3.js for data visualization, and Tailwind CSS for styling, Graphql (apollo) for API. It serves as both an educational tool and a demonstration of interactive data visualization techniques.
      </p>
    </div>


    <div class="bg-stone-50 dark:bg-stone-900/50 p-8 rounded-2xl border border-stone-200 dark:border-stone-800">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Scale class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 m-0">
          Free Use License
        </h2>
      </div>
      <p class="text-stone-600 dark:text-stone-300 leading-relaxed">
        We believe that knowledge about our agricultural heritage should be freely accessible to everyone. All data, text, and visualizations on this site are provided under a <strong>free use license</strong>. You are welcome to use, copy, modify, and distribute this information for any purpose—commercial or non-commercial—without any requirement to provide attribution or link back to this source.
      </p>
    </div>
  </div>
</template>