<script setup lang="ts">
import FruitBubblesClient from '~/components/fruit-bubbles.client.vue';
</script>

<template>
  <div>
    <h1>Apples Page</h1>

    <ClientOnly>
      <FruitBubblesClient />
    </ClientOnly>
  </div>
</template>

<style>
</style>