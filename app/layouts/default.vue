<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Menu } from 'lucide-vue-next'
import Github from '~/assets/icons/github.svg';

const config = useRuntimeConfig();
const siteName = config.public.siteName;

const isDark = ref(false)

const mobileMenuOpen = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateThemeClass()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const updateThemeClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme ? savedTheme === 'dark' : systemPrefersDark
  updateThemeClass()
})

watch(isDark, updateThemeClass)

const currentYear = computed(() => new Date().getFullYear())

useHead({
  // title: siteName,
});
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
            <div class="hidden md:flex items-center gap-2">
              <NuxtLink class="desktop-nav-link" aria-current="page" href="/">Home</NuxtLink>
              <NuxtLink class="desktop-nav-link" href="/apple">Apples</NuxtLink>
              <NuxtLink class="desktop-nav-link" href="/apple/tree">Genetic Tree</NuxtLink>
              <NuxtLink class="desktop-nav-link" href="/about">About</NuxtLink>
              <NuxtLink target="_blank" class="desktop-nav-link" href="/api/fruit/gql">Graphql</NuxtLink>
            </div>
            <!-- Mobile Menu Button -->
            <button
              @click="toggleMobileMenu"
              class="md:hidden p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu class="w-6 h-6" />
            </button>
          </div>
        </div>
        <!-- Mobile Navigation Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NuxtLink class="mobile-nav-link" href="/" @click="closeMobileMenu">Home</NuxtLink>
            <NuxtLink class="mobile-nav-link" href="/apple" @click="closeMobileMenu">Apples</NuxtLink>
            <NuxtLink class="mobile-nav-link" href="/apple/tree" @click="closeMobileMenu">Genetic Tree</NuxtLink>
            <NuxtLink class="mobile-nav-link" href="/about" @click="closeMobileMenu">About</NuxtLink>
            <NuxtLink target="_blank" class="nav-link" href="/api/fruit/gql" @click="closeMobileMenu">Graphql</NuxtLink>
          </div>
        </div>
      </div>
    </nav>
    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot />
    </main>
    <footer class="mt-auto mb-0 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-stone-500 dark:text-stone-400 text-sm flex flex-col items-center gap-3">
        <p>© {{ currentYear }} Apple Genealogy Project. Cultivating knowledge.</p>
        <p class="max-w-2xl text-xs text-stone-400 dark:text-stone-500">
          <strong>Free Use License:</strong> All information on this site may be freely used, copied, and distributed without any requirement for attribution or source linking.
        </p>
        <div>
          <a href="https://github.com/mmspring13/growapple" target="_blank">
            <Github />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@reference "tailwindcss";

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors;
}
.desktop-nav-link {
  @apply text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2 rounded-md;
}
</style>