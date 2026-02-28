<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

// Icons (you'll need to install and import them)
import { Sun, Moon } from 'lucide-vue-next'

// Theme management
const isDark = ref(false)

// Toggle theme function
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateThemeClass()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Update HTML class based on theme
const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize theme on mount
onMounted(() => {
  // Check localStorage first, then system preference
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme ? savedTheme === 'dark' : systemPrefersDark
  updateThemeClass()
})

// Watch for theme changes
watch(isDark, updateThemeClass)

// Get current year for copyright
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <div class="min-h-screen bg-[#FDFCF8] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-300">
    <nav class="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FDFCF8]/80 dark:bg-stone-950/80 backdrop-blur-md transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink to="/" class="flex items-center gap-2 group">
              <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-serif italic font-bold text-lg group-hover:scale-105 transition-transform">
                A
              </div>
              <span class="text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Apple Genealogy
              </span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-6">
            <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors" aria-current="page" href="#">Home</NuxtLink>
            <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors" href="/apple">Apples</NuxtLink>
            <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors" href="/bubbles">Bubbles</NuxtLink>
            <NuxtLink to="/" class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
              Directory
            </NuxtLink>
            <button
              @click="toggleTheme"
              class="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <Sun v-if="isDark" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 mt-12 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-stone-500 dark:text-stone-400 text-sm">
        <p>© {{ currentYear }} Apple Genealogy Project. Cultivating knowledge.</p>
      </div>
    </footer>
  </div>
</template>

<!--<template>-->
<!--  <div class="app">-->
<!--    <aside class="sidebar-wrapper p-2 bg-800">-->
<!--      <div class="sidebar">-->
<!--        <h1 class="font-bold">GrowApple</h1>-->
<!--        <span class="font-bold">description</span>-->
<!--        <nav class="nav flex-column">-->
<!--          <NuxtLink class="nav-link" aria-current="page" href="#">Home</NuxtLink>-->
<!--          <NuxtLink class="nav-link" href="/apple">Apples</NuxtLink>-->
<!--          <NuxtLink class="nav-link" href="/bubbles">Bubbles</NuxtLink>-->
<!--        </nav>-->
<!--      </div>-->
<!--    </aside>-->

<!--    <div class="page-wrapper">-->
<!--      <main class="scroll-container">-->
<!--        <div class="page-content">-->
<!--          <NuxtPage />-->
<!--        </div>-->
<!--      </main>-->

<!--      <footer class="footer">-->
<!--        Footer Content (Only visible at bottom)-->
<!--      </footer>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped lang="scss">-->
<!--@import "bootstrap/scss/functions";-->
<!--@import "bootstrap/scss/variables";-->
<!--@import "bootstrap/scss/mixins";-->

<!--.sidebar-wrapper {-->
<!--  display: none;-->
<!--  position: absolute;-->
<!--  height: 100%;-->
<!--  width: 100%;-->

<!--  @include media-breakpoint-up('sm') {-->
<!--    position: static;-->
<!--    display: block;-->
<!--    width: auto;-->
<!--    height: auto;-->
<!--  }-->

<!--  &.__opened {-->
<!--    display: block;-->
<!--    top: 0;-->
<!--    left: 0;-->
<!--  }-->

<!--  .nav {-->
<!--    &#45;&#45;bs-nav-link-hover-color: var(&#45;&#45;bs-teal-600);-->

<!--    .nav-link.active {-->
<!--      color: white;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--/* Optional: Customizing the base nav-link behavior */-->
<!--.nav-link {-->
<!--  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;-->
<!--  border-radius: 0.375rem;-->
<!--  margin-bottom: 0.25rem;-->
<!--}-->

<!--.app {-->
<!--  display: grid;-->
<!--  height: 100dvh;-->
<!--  width: 100vw;-->
<!--  overflow: hidden;-->

<!--  grid-template-areas:-->
<!--    "sidebar main";-->
<!--  ;-->

<!--  @include media-breakpoint-up('sm') {-->
<!--    grid-template-columns: 240px 1fr;-->
<!--    grid-template-rows: 1fr 120px;-->
<!--  }-->
<!--}-->

<!--.sidebar-wrapper {-->
<!--  height: 100dvh;-->
<!--  overflow: hidden;-->
<!--  grid-area: sidebar;-->
<!--}-->

<!--.page-wrapper {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--  grid-template-rows: 1fr auto;-->
<!--  grid-area: main;-->
<!--  //height: 100vh;-->
<!--  overflow-y: auto;-->
<!--  overflow-x: hidden;-->
<!--  overscroll-behavior-y: contain;-->
<!--  -webkit-overflow-scrolling: touch;-->
<!--}-->

<!--.scroll-container {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  /* min-height: 100% ensures the container is at least as tall as the screen */-->
<!--  //min-height: 100%;-->
<!--}-->

<!--.page-content {-->
<!--  flex: 1 0 auto;-->
<!--  padding: 20px;-->
<!--}-->

<!--.footer {-->
<!--  //flex-shrink: 0;-->
<!--  padding: 40px 20px;-->
<!--  border-top: 1px solid rgba(0, 0, 0, 0.1);-->
<!--  box-shadow: 0 3px 9px 2px rgba(255, 255, 255, .2)-->
<!--  /* width: 100% is fine, but as a flex item it's already fill-width */-->
<!--}-->
<!--</style>-->