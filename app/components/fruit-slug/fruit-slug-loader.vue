<template>
  <div class="animate-pulse">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div class="lg:col-span-2 space-y-6">
        <header>
          <div class="h-5 w-32 bg-stone-200 dark:bg-stone-800 rounded-full mb-4"></div>
          <div class="h-12 w-2/3 bg-stone-200 dark:bg-stone-800 rounded-lg mb-4"></div>
          <div class="space-y-2">
            <div class="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded"></div>
            <div class="h-4 w-5/6 bg-stone-200 dark:bg-stone-800 rounded"></div>
          </div>
        </header>

        <div class="stats-container">
          <div class="stat-block mb-2 flex items-center gap-2">
            <div class="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg"></div>
            <div class="space-y-2">
              <div class="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded"></div>
              <div class="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded"></div>
            </div>
          </div>
          <div class="stat-block flex items-center gap-2">
            <div class="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg"></div>
            <div class="space-y-2">
              <div class="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded"></div>
              <div class="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 2" :key="i" class="relation-card">
            <div class="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded mb-4"></div>
            <div class="space-y-3">
              <div v-for="j in 2" :key="j" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800"></div>
                <div class="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="aspect-square rounded-2xl bg-stone-100 dark:bg-stone-800"></div>
      </aside>
    </div>

    <section class="section-divider mt-8">
      <div class="h-8 w-48 bg-stone-200 dark:bg-stone-800 rounded mb-4"></div>
      <div class="space-y-2">
        <div class="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded"></div>
        <div class="h-4 w-full bg-stone-200 dark:bg-stone-800 rounded"></div>
        <div class="h-4 w-3/4 bg-stone-200 dark:bg-stone-800 rounded"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.shimmer {
  @apply bg-stone-200 dark:bg-stone-800 animate-pulse;
}
</style>