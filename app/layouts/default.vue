<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

// Icons (you'll need to install and import them)
import { Sun, Moon, Menu, X } from 'lucide-vue-next'

// Theme management
const isDark = ref(false)

// Mobile menu state
const mobileMenuOpen = ref(false)

// Toggle theme function
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateThemeClass()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
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
  <div class="flex flex-col min-h-screen bg-[#FDFCF8] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-300">
    <nav class="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FDFCF8]/80 dark:bg-stone-950/80 backdrop-blur-md transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink to="/" class="flex items-center gap-2 group" @click="closeMobileMenu">
              <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-serif italic font-bold text-lg group-hover:scale-105 transition-transform">
                A
              </div>
              <span class="text-xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Apple Genealogy
              </span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-6">
              <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-md" aria-current="page" href="/">Home</NuxtLink>
              <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-md" href="/apple">Apples</NuxtLink>
              <NuxtLink class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-md" href="/apple/tree">Genetic Tree</NuxtLink>
              <NuxtLink target="_blank" class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-md" href="/api/fruit/gql">Graphql</NuxtLink>
            </div>
            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu class="w-6 h-6" />
            </button>
<!--            <button-->
<!--              @click="toggleTheme"-->
<!--              class="hidden md:block p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"-->
<!--              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"-->
<!--            >-->
<!--              <Sun v-if="isDark" class="w-5 h-5" />-->
<!--              <Moon v-else class="w-5 h-5" />-->
<!--            </button>-->
          </div>
        </div>
        <!-- Mobile Navigation Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NuxtLink class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors" href="/" @click="closeMobileMenu">Home</NuxtLink>
            <NuxtLink class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors" href="/apple" @click="closeMobileMenu">Apples</NuxtLink>
            <NuxtLink class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors" href="/apple/tree" @click="closeMobileMenu">Genetic Tree</NuxtLink>
            <NuxtLink target="_blank" class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors" href="/api/fruit/gql" @click="closeMobileMenu">Graphql</NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot />
    </main>
    <footer class="mt-auto mb-0 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 mt-8 sm:mt-12 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-stone-500 dark:text-stone-400 text-sm">
        <p>© {{ currentYear }} Apple Genealogy Project. Cultivating knowledge.</p>
      </div>
    </footer>
  </div>
</template>