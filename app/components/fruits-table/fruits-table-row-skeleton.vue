
<template>
  <tr class="animate-pulse">
    <td class="table-td-default">
      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-8"></div>
    </td>
    <td class="table-td-default">
      <div class="flex items-center">
        <div class="shrink-0 border relative overflow-hidden h-10 w-10 rounded-full flex items-center justify-center border-stone-200 dark:border-stone-700">
          <div class="h-full w-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div class="ml-4">
          <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
        </div>
      </div>
    </td>
    <td class="table-td-default">
      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-12"></div>
    </td>
    <td class="table-td-default">
      <div class="flex flex-col items-start gap-y-1.5">
        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-24"></div>
      </div>
    </td>
    <td class="table-td-default">
      <div class="space-y-2">
        <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
        <div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6"></div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 inline-block"></div>
    </td>
  </tr>
</template>

<script setup lang="ts">
// This component has no script :)
</script>

<style scoped>
@reference "tailwindcss";

.table-td-default {
  @apply px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400;
}
</style>
