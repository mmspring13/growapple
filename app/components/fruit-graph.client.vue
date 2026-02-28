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
  const Highcharts = (await import('highcharts')).default;
  const Exporting = (await import('highcharts/modules/exporting')).default;
  const Graph = (await import('highcharts/modules/networkgraph')).default;
  await import('highcharts/highcharts-more');

  if (typeof Exporting === 'function') {
    Exporting(Highcharts);
  }
  if (typeof Graph === 'function') {
    Graph(Highcharts);
  }
}

interface FruitApiResponse {
  fruits: AppFruit[];
}

const { data, pending, error } = await useFetch<FruitApiResponse>('/api/fruits/apple');

const chartTarget = ref<HTMLElement | null>(null);
const chartInstance = ref<Highcharts.Chart | null>(null);

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

let s = (dd) => {
  let cn = (p, dq) => {
    return dq.filter((v) => {
      return v.parentage.includes(p)
    })
  }

  let ks = dd.reduce((acc, v) => {
    acc.set(v.slug, cn(v.id, dd))
    return acc
  }, new Map())

  return ks.entries().flatMap(([k, v]) => {
    return v.map(j => [k, j.slug])
  })
}

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

  const series = s(fruits).toArray();
  console.log(series)

  // Get the first type (or handle multiple types)
  const typeName = Object.keys(fruitsByType)[0];
  const fruitsOfType = fruitsByType[typeName];

  const options: Highcharts.Options = {
    chart: {
      type: 'networkgraph',
      height: '800px', // Makes the chart "more large" vertically
      style: {
        color: '#fff',
      },
      backgroundColor: '#222',
    },
    title: {
      text: 'Connected Bubble Network'
    },
    plotOptions: {
      networkgraph: {
        point: {
          events: {
            mouseOver: function () {
              const chart = this.series.chart;
              const activeNode = this.id;

              this.series.points.forEach(p => {
                // 1. Identify Children (where 'from' is current node)
                if (p.from === activeNode) {
                  p.graphic.attr({ stroke: '#ff0000', 'stroke-width': 4 }); // Red for child links
                  p.toNode.graphic.attr({ fill: '#ff0000' }); // Match child node color
                }

                // 2. Identify Parent (where 'to' is current node)
                if (p.to === activeNode) {
                  p.graphic.attr({ stroke: '#0000ff', 'stroke-width': 4 }); // Blue for parent links
                  p.fromNode.graphic.attr({ fill: '#0000ff' }); // Match parent node color
                }
              });
            },
            mouseOut: function () {
              // Reset everything to original colors/widths
              this.series.points.forEach(p => {
                p.graphic.attr({ stroke: '#e6e6e6', 'stroke-width': 1 });
                p.toNode.graphic.attr({ fill: p.toNode.color });
                p.fromNode.graphic.attr({ fill: p.fromNode.color });
              });
            }
          }
        },
        marker: {
          radius: 20,
        },
        keys: ['from', 'to'],
        layoutAlgorithm: {
          enableSimulation: true,
          maxIterations: 74,
          friction: -0.9,
          // linkLength: 600, // Increase this (e.g., 200 or 300) for wider gaps
          approximation: 'barnes-hut',
          // Adjusting gravity helps keep bubbles together
          gravitationalConstant: 0.02,
          initialPositions: 'circle',

          integration: 'verlet',

          linkLength: 220,          // 🔥 Bigger gap between nodes
          // gravitationalConstant: 0.005, // Smaller = more spread
          // friction: -0.95,          // More floaty
          // maxIterations: 2000
        }
      }
    },
    series: [{
      dataLabels: {
        enabled: true,
        linkFormat: '',
        style: {
          fontSize: '12px', // Larger text
          fontWeight: 'bold',
          color: '#fff',
          textOutline: 'none' // Cleaner look
        }
      },
      id: 'bubble-network',
      data: series,
    }]
  };

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  chartInstance.value = Highcharts.chart(chartTarget.value, options);
});
</script>