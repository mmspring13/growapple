<script setup lang="ts">
import { ArrowLeft, Calendar, MapPin, GitBranch } from 'lucide-vue-next';
import FruitGeneticTree from "~/components/fruit-genetic-tree/fruit-genetic-tree.vue";
import { AppFruitDocument, type AppFruitQuery, type AppFruitQueryVariables } from "~/composables/fruit/fruit.generated";
import FruitSlugLoader from "~/components/fruit-slug/fruit-slug-loader.vue";

const route = useRoute();
const fruitSlug = route.params.slug as string;

const { $apollo } = useNuxtApp();

const queryKey = computed(() => `fruit-${fruitSlug}`)
const { data: fruit, pending } = useAsyncData(
  queryKey.value,
  () => $apollo.query<AppFruitQuery, AppFruitQueryVariables>({
    query: AppFruitDocument,
    variables: {slug: fruitSlug}
  }),
  {
    watch: [queryKey],
    transform: (result) => {
      if (!result.error) {
        return result.data?.fruit;
      }
    }
  }
);

const relations = computed(() => [
  { label: 'Parentage', data: fruit.value?.parentage || [], icon: GitBranch, flip: false, empty: 'Chance seedling (Unknown)' },
  { label: 'Offspring', data: fruit.value?.children || [], icon: GitBranch, flip: true, empty: 'No recorded major offspring' }
]);

const seoDesc = computed(
  () => `Learn about the ${fruit.value?.name} apple variety, its origin, and genetic lineage.`
);
const seoAvatar = computed(() => fruit.value?.avatar?.url || '');
</script>

<template>
  <div class="space-y-8">
    <Head>
      <Title>{{ fruit?.name }}</Title>
      <Meta
        name="description"
        :content="seoDesc"
      />
      <Meta
        name="og:description"
        :content="fruit?.short_description || seoDesc"
      />
      <Meta
        name="og:image"
        :content="seoAvatar"
      />
      <Style>
        body { background-color: green; }
      </Style>
    </Head>

    <NuxtLink to="/" class="nav-back">
      <ArrowLeft class="w-4 h-4 mr-1" /> Back to Directory
    </NuxtLink>

    <Transition name="fade" mode="out-in">
      <div v-if="!fruit" key="loading">
        <fruit-slug-loader />
      </div>
      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-4">
          <div class="lg:col-span-2 space-y-6">
            <header>
              <span class="badge-slug">{{ fruit.slug }} ({{ fruit.id }})</span>
              <h1 class="heading-xl">{{ fruit.name }}</h1>
              <p class="text-lead">{{ fruit.short_description }}</p>
            </header>

            <div class="stats-container">
              <div class="stat-block">
                <div
                  class="w-12 h-12 rounded-2xl shadow-inner border border-stone-200 dark:border-stone-700"
                  :style="{ backgroundColor: fruit.color || '#087E8B' }"
                ></div>
                <div>
                  <div class="stat-label">Primary Hue</div>
                  <div class="stat-value font-mono">
                    {{ fruit.color || "Unknown" }}
                  </div>
                </div>
              </div>

              <div class="stat-block">
                <Calendar class="stat-icon" />
                <div>
                  <div class="stat-label">Introduced</div>
                  <div class="stat-value font-mono">{{ fruit.opening_year || "Unknown" }}</div>
                </div>
              </div>
              <div class="stat-block">
                <MapPin class="stat-icon" />
                <div>
                  <div class="stat-label">Type</div>
                  <div class="stat-value capitalize">{{ fruit.type || "Unknown" }}</div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="rel in relations" :key="rel.label" class="relation-card">
                <h3 class="relation-title">
                  <component :is="rel.icon" :class="['w-4 h-4', rel.flip ? 'rotate-180' : '']" />
                  {{ rel.label }}
                </h3>

                <ul v-if="rel.data.length > 0" class="space-y-2">
                  <li v-for="item in rel.data" :key="item.id">
                    <NuxtLink :to="`/fruit/${item.slug}`" class="link-node group">
                      <NuxtImg
                        v-if="item.avatar?.url"
                        :src="item.avatar.url"
                        class="node-avatar"
                        provider="baseProvider"
                      />
                      <div v-else class="node-dot"></div>
                      <span class="node-text">{{ item.name }}</span>
                    </NuxtLink>
                  </li>
                </ul>
                <p v-else class="text-empty">{{ rel.empty }}</p>
              </div>
            </div>
          </div>

          <aside class="lg:col-span-1">
            <div class="hero-image-container">
              <NuxtImg
                v-if="fruit.avatar"
                loading="lazy"
                placeholder
                placeholder-class="app-img-shimmer"
                class="w-full h-full object-cover"
                :src="fruit.avatar.url"
                provider="baseProvider"
              />
              <div v-else class="placeholder-art">
                <div class="art-apple"></div>
              </div>
            </div>
          </aside>
        </div>

        <section class="section-divider" v-if="fruit.short_description || fruit.description">
          <h2 class="heading-lg">About {{ fruit.name }}</h2>
          <div class="py-4">
            <p class="text-lead">{{ fruit.description }}</p>
          </div>
          <!--          <div v-if="fruit.short_description" class="prose-container">-->
<!--            <p class="text-lead">{{ fruit.short_description }}</p>-->

<!--            <Transition name="fade">-->
<!--              <div v-show="isDescriptionExpanded" class="pt-2">-->
<!--                <p class="text-lead">{{ fruit.description }}</p>-->
<!--              </div>-->
<!--            </Transition>-->

<!--            <button @click="isDescriptionExpanded = !isDescriptionExpanded" class="btn-toggle">-->
<!--              {{ isDescriptionExpanded ? 'Read Less' : 'Load More' }}-->
<!--              <component :is="isDescriptionExpanded ? ChevronUpIcon : ChevronDownIcon" class="w-4 h-4" />-->
<!--            </button>-->
<!--          </div>-->
        </section>

        <div v-if="fruit.images && fruit.images.length > 0" class="pt-8 border-t border-stone-200 dark:border-stone-800 pb-6">
          <h2 class="text-2xl font-serif font-medium text-stone-900 dark:text-stone-100 mb-6">Image Gallery</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="(image, index) in fruit.images" :key="index" class="aspect-square rounded-xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm">
              <NuxtImg
                class="w-full h-full object-cover"
                :alt="`Image ${index + 1} of ${fruit.name}`"
                :src="image"
                provider="baseProvider"
                loading="lazy"
                placeholder
                placeholder-class="app-img-shimmer"
              />
            </div>
          </div>
        </div>

        <section class="section-divider">
          <h2 class="heading-lg">Genetic Tree Visualization</h2>
          <p class="text-muted mb-6">Interactive visualization of immediate genetic network.</p>
          <fruit-genetic-tree :apple="fruit" />
        </section>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

/* Layout Components */
.section-divider {
  @apply pt-8 border-t border-stone-200 dark:border-stone-800;
}

.stats-container {
  @apply flex flex-wrap gap-6 py-6 border-y border-stone-200 dark:border-stone-800;
}

.stat-block {
  @apply flex items-center gap-2;
}

/* Typography */
.heading-xl {
  @apply text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mb-4;
}

.heading-lg {
  @apply text-2xl font-serif font-medium text-stone-900 dark:text-stone-100;
}

.text-lead {
  @apply text-base text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-wrap;
}

.text-muted {
  @apply text-stone-500 dark:text-stone-400;
}

.badge-slug {
  @apply inline-block px-3 py-1 mb-2 rounded-full text-xs font-mono bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 uppercase tracking-wider;
}

.stat-label {
  @apply text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold;
}

.stat-value {
  @apply text-stone-900 dark:text-stone-200;
}

.stat-icon {
  @apply w-5 h-5 text-stone-400 dark:text-stone-500;
}

/* Relation Cards */
.relation-card {
  @apply bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border border-stone-100 dark:border-stone-800;
}

.relation-title {
  @apply text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-4 flex items-center gap-2;
}

.link-node {
  @apply flex items-center gap-2 transition-colors;
}

.node-text {
  @apply text-stone-700 dark:text-stone-300 font-medium underline decoration-stone-300 dark:decoration-stone-700 underline-offset-4 group-hover:text-orange-700 dark:group-hover:text-orange-400 group-hover:decoration-orange-300;
}

.node-avatar {
  @apply w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-stone-700;
}

.node-dot {
  @apply w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-orange-500;
}

.hero-image-container {
  @apply aspect-square rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-100 dark:border-stone-800 shadow-inner overflow-hidden relative max-w-lg;
}

.placeholder-art {
  @apply absolute inset-0 flex items-center justify-center opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px];
}

.art-apple {
  @apply w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.nav-back {
  @apply inline-flex items-center text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors;
}

.btn-toggle {
  @apply mt-2 flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium transition-colors;
}
</style>