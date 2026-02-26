<script setup lang="ts">
import type {AllFruitsByTypeFruit} from "#shared/api/types";

const isExpanded = ref(false);

defineProps<{
  fruit: AllFruitsByTypeFruit;
}>();

const toggleExpandedRow = () => {
  isExpanded.value = !isExpanded.value;
};

const formatYear = (year: number) => {
  return year > 0 ? year.toString() : 'Unknown';
};
</script>

<template>
  <tr>
    <td>
      <button
        @click="toggleExpandedRow"
        class="btn btn-link btn-sm text-decoration-none p-0 text-light"
      >
        <span v-if="isExpanded">&#9660;</span>
        <span v-else>&#9658;</span>
      </button>
    </td>
    <td>{{ fruit.id }}</td>
    <td>
      <a
        v-if="fruit.images?.[0]"
        :href="fruit.images?.[0]"
        :key="fruit.images?.[0]"
        target="_blank"
        class="d-block fruit-row__image border rounded-circle overflow-hidden"
        style="width: 40px; aspect-ratio: 1"
      >
        <NuxtImg
          class="fruit-row__image__el img-fluid w-full h-full object-fit-cover"
          :alt="`image of ${fruit.name}`"
          :src="fruit.images?.[0]"
          provider="baseProvider"
        />
      </a>
      <span v-else style="text-align: center;">-</span>
    </td>
    <td class="fw-bold">{{ fruit.name }}</td>
    <td>{{ formatYear(fruit.opening_year) }}</td>
    <td><span class="badge rounded-pill bg-light text-dark border">{{ fruit.parentage.length }}</span></td>
    <td><span class="badge rounded-pill bg-light text-dark border">{{ fruit.children.length }}</span></td>
  </tr>

  <tr v-if="isExpanded">
    <td colspan="7" class="p-4 bg-800 text-light">
<!--      <div style="width: 40px; height: 40px;" class="text-pink-600 bg-pink-200">Lorem ipsum dolor sit amet.</div>-->
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <h6 class="fw-bold">Short Description:</h6>
          <p class="small mb-0 text-secondary">{{ fruit.short_description }}</p>
        </div>

        <div v-if="fruit.images?.length" class="col-12 col-md-6">
          <h6 class="fw-bold">Images:</h6>
          <div class="d-flex flex-wrap gap-2">
            <a
              v-for="(img, i) in fruit.images"
              :href="img"
              :key="img"
              target="_blank"
              class="d-block fruit-row__image border rounded overflow-hidden"
              style="width: 120px; aspect-ratio: 1"
            >
              <NuxtImg
                class="fruit-row__image__el img-fluid w-full h-full object-fit-cover"
                :alt="`image of ${fruit.name} ${i}`"
                :src="img"
                provider="baseProvider"
              />
            </a>
          </div>
        </div>

        <div v-if="fruit.parentage.length" class="col-12 col-md-3">
          <h6 class="fw-bold small">Parentage:</h6>
          <slot name="parentage" :parentage="fruit.parentage" />
        </div>

        <div v-if="fruit.children.length" class="col-12 col-md-3">
          <h6 class="fw-bold small">Children:</h6>
          <slot name="children" :children="fruit.children" />
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped lang="scss">
.fruit-row {
  &__image {
    position: relative;
    &__el {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
    }
  }
}
</style>