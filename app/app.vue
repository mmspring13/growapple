<script setup lang="ts">
onMounted(async () => {
  if (import.meta.client) {
    await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>

</style>