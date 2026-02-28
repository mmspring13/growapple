<script setup lang="ts">
import FruitGraphClient from '~/components/fruit-graph.client.vue';
</script>

<template>
  <div>
    <h1>Apples Page</h1>

    <ClientOnly>
      <FruitGraphClient />
    </ClientOnly>
  </div>
</template>

<style>
</style>