<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading fruits</div>
    <div v-else ref="chartTarget" style="width: 100%; height: 800px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import type {AppFruit} from "#shared/entities/fruit";
if (import.meta.client) {
  // 1. Dynamically import the core and the module
  const Highcharts = (await import('highcharts')).default;
  const Exporting = (await import('highcharts/modules/exporting')).default;
  await import('highcharts/highcharts-more');

  // 2. Initialize the module
  if (typeof Exporting === 'function') {
    Exporting(Highcharts);
  }
}

interface FruitApiResponse {
  fruits: AppFruit[];
}

const { data, pending, error } = await useFetch<FruitApiResponse>('/api/fruits/1/all');

const chartTarget = ref<HTMLElement | null>(null);
const chartInstance = ref<Highcharts.Chart | null>(null);

// Clean up on unmount
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

// Watch for data changes and update chart
watchEffect(() => {
  if (!data.value || !data.value.data.length || !chartTarget.value) {
    return;
  }

  const fruits = data.value.data;

  // Group fruits by type
  const fruitsByType = fruits.reduce((acc, fruit) => {
    if (!acc[fruit.type]) {
      acc[fruit.type] = [];
    }
    acc[fruit.type].push(fruit);
    return acc;
  }, {});

  // Get the first type (or handle multiple types)
  const typeName = Object.keys(fruitsByType)[0];
  const fruitsOfType = fruitsByType[typeName];

  // Prepare data for packed bubble chart
  const chartData = fruitsOfType.map(fruit => ({
    name: fruit.name,
    value: fruit.id
  }));

  console.log(chartData)

  const options: Highcharts.Options = {
    chart: {
      type: 'packedbubble',
      backgroundColor: '#222',
      // height: '60%',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}</b>'
    },
    legend: {
      itemStyle: {
        fontSize: '16px',      // Adjust this value as needed
        fontWeight: 'bold',    // Optional: make it stand out
        fontFamily: 'Arial',   // Optional: change the font family
        color: '#fff'       // Optional: change the text color
      },
      itemHoverStyle: {
        color: '#234560'
      }
    },
    plotOptions: {
      packedbubble: {
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02
        },
        dataLabels: {
          enabled: true,
          // format: '{series.name}',
          formatter: (...d) => {
            console.log(d)
            return 'A'
          },
          style: {
            textOutline: 'none',
            color: 'black',
            fontSize: '1.2em'
          }
        },
        minSize: '30%',
        maxSize: '120%'
      }
    },
    series: chartData.map((c) => ({
      name: c.name,
      data: [{ value: c.value }]
    }))
    // series: [{
    //   name: typeName,
    //   data: chartData
    // }]
  };

  // Destroy old chart if it exists
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  // Create new chart
  // console.log('Highcharts', Highcharts.)
  chartInstance.value = Highcharts.chart(chartTarget.value, options);
});
</script>