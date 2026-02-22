<script setup lang="ts">
import {useApi} from "~/hooks/useApi";
import { ref, computed } from 'vue';
import type { AppFruit } from "#shared/entities/fruit";

const api = useApi();

const allFruitsResponse = await api.fetchAllApples();
const searchQuery = ref('');
const expandedRows = ref<Set<number>>(new Set());

const filteredApples = computed(() => {
  if (!searchQuery.value) return allFruitsResponse.data;

  const query = searchQuery.value.toLowerCase();
  return allFruitsResponse.data.filter(apple =>
    apple.name.toLowerCase().includes(query)
  );
});

const toggleRow = (appleId: number) => {
  if (expandedRows.value.has(appleId)) {
    expandedRows.value.delete(appleId);
  } else {
    expandedRows.value.add(appleId);
  }
};

const formatYear = (year: number) => {
  return year > 0 ? year.toString() : 'Unknown';
};

const highlightedFruit = ref<number | null>(null);

const scrollToFruit = (fruitId: number) => {
  // Find the fruit in the filtered list
  const targetFruit = filteredApples.value.find(fruit => fruit.id === fruitId);
  if (!targetFruit) return;

  // Get the index in the filtered list for scrolling
  const targetIndex = filteredApples.value.findIndex(fruit => fruit.id === fruitId);

  // Clear any existing highlight
  highlightedFruit.value = null;

  // Scroll to the fruit
  setTimeout(() => {
    const fruitElement = document.querySelector(`[data-fruit-id="${fruitId}"]`);
    if (fruitElement) {
      fruitElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Highlight the fruit
      highlightedFruit.value = fruitId;

      // Remove highlight after animation
      setTimeout(() => {
        highlightedFruit.value = null;
      }, 2000);
    }
  }, 100);
};

const getParentageNames = (apple: AppFruit) => {
  return apple.parentage.map(parentId => {
    const parent = allFruitsResponse.data.find(a => a.id === parentId);
    return {
      id: parentId,
      name: parent ? parent.name : `Unknown (${parentId})`
    };
  });
};

const getChildrenNames = (apple: AppFruit) => {
  return apple.children.map(childId => {
    const child = allFruitsResponse.data.find(a => a.id === childId);
    return {
      id: childId,
      name: child ? child.name : `Unknown (${childId})`
    };
  });
};
</script>

<template>
  <div class="apples-container">
    <h1>All Apples</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search apples by name..."
        class="search-input"
      />
      <span class="results-count">{{ filteredApples.length }} apples found</span>
    </div>

    <div class="table-container">
      <table class="apples-table">
        <thead>
        <tr>
          <th class="expand-col"></th>
          <th class="name-col">Name</th>
          <th class="year-col">Year</th>
          <th class="parents-col">Parents</th>
          <th class="children-col">Children</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="apple in filteredApples" :key="apple.id">
          <tr
            class="apple-row"
            :class="{
                expanded: expandedRows.has(apple.id),
                highlighted: highlightedFruit === apple.id
              }"
            :data-fruit-id="apple.id"
            @click="toggleRow(apple.id)"
          >
            <td class="expand-col">
              <span class="expand-icon">{{ expandedRows.has(apple.id) ? '▼' : '▶' }}</span>
            </td>
            <td class="name-col">{{ apple.name }}</td>
            <td class="year-col">{{ formatYear(apple.opening_year) }}</td>
            <td class="parents-col">{{ apple.parentage.length }}</td>
            <td class="children-col">{{ apple.children.length }}</td>
          </tr>
          <tr v-if="expandedRows.has(apple.id)" class="details-row">
            <td colspan="5" class="details-cell">
              <div class="apple-details">
                <div class="details-section">
                  <h3>{{ apple.name }}</h3>
                  <p><strong>Year:</strong> {{ formatYear(apple.opening_year) }}</p>
                  <p><strong>Description:</strong> {{ apple.description || 'No description available' }}</p>
                </div>

                <div class="details-grid">
                  <div class="parentage-section" v-if="apple.parentage.length > 0">
                    <h4>Parentage</h4>
                    <ul>
                      <li v-for="parent in getParentageNames(apple)" :key="parent.id">
                          <span
                            class="clickable-fruit"
                            @click.stop="scrollToFruit(parent.id)"
                            :title="`Click to scroll to ${parent.name}`"
                          >
                            {{ parent.name }}
                          </span>
                      </li>
                    </ul>
                  </div>

                  <div class="children-section" v-if="apple.children.length > 0">
                    <h4>Children</h4>
                    <ul>
                      <li v-for="child in getChildrenNames(apple)" :key="child.id">
                          <span
                            class="clickable-fruit"
                            @click.stop="scrollToFruit(child.id)"
                            :title="`Click to scroll to ${child.name}`"
                          >
                            {{ child.name }}
                          </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>

      <div v-if="filteredApples.length === 0" class="no-results">
        No apples found matching "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.apples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 600;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.results-count {
  color: #7f8c8d;
  font-size: 14px;
  white-space: nowrap;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.apples-table {
  width: 100%;
  border-collapse: collapse;
}

.apples-table th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-align: left;
  padding: 16px;
  border-bottom: 2px solid #e1e8ed;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.apples-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
}

.apple-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.apple-row:hover {
  background-color: #f8f9fa;
}

.apple-row.expanded {
  background-color: #e3f2fd;
}

.apple-row.highlighted {
  animation: highlight-blink 2s ease-in-out;
}

.apple-row.highlighted {
  animation: highlight-blink 2s ease-in-out;
}

.expand-col {
  width: 40px;
  text-align: center;
}

.expand-icon {
  color: #3498db;
  font-size: 12px;
  display: inline-block;
  transition: transform 0.2s ease;
}

.name-col {
  font-weight: 500;
  color: #2c3e50;
  min-width: 200px;
}

.year-col {
  color: #7f8c8d;
  font-size: 14px;
  width: 80px;
}

.parents-col,
.children-col {
  color: #7f8c8d;
  font-size: 14px;
  width: 100px;
  text-align: center;
}

.details-row {
  background-color: #f8f9fa;
}

.details-cell {
  padding: 0;
}

.apple-details {
  padding: 24px;
  border-left: 4px solid #3498db;
}

.details-section {
  margin-bottom: 24px;
}

.details-section h3 {
  color: #2c3e50;
  margin: 0 0 16px 0;
  font-size: 1.5rem;
}

.details-section p {
  margin: 8px 0;
  color: #34495e;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.parentage-section,
.children-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
}

.parentage-section h4,
.children-section h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.parentage-section ul,
.children-section ul {
  margin: 0;
  padding-left: 20px;
  color: #34495e;
}

.parentage-section li,
.children-section li {
  margin: 4px 0;
  line-height: 1.5;
}

.clickable-fruit {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.clickable-fruit:hover {
  color: #2980b9;
  text-decoration: none;
}

.clickable-fruit {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.clickable-fruit:hover {
  color: #2980b9;
  text-decoration: none;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-size: 16px;
}

@keyframes highlight-blink {
  0% { background-color: transparent; }
  20% { background-color: #fff3cd; }
  40% { background-color: #ffeaa7; }
  60% { background-color: #fff3cd; }
  80% { background-color: #ffeaa7; }
  100% { background-color: transparent; }
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .apples-table {
    font-size: 14px;
  }

  .apples-table th,
  .apples-table td {
    padding: 12px 8px;
  }
}
</style>