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
  await import('highcharts/highcharts-more');

  if (typeof Exporting === 'function') {
    Exporting(Highcharts);
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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

  // Get the first type (or handle multiple types)
  const typeName = Object.keys(fruitsByType)[0];
  const fruitsOfType = fruitsByType[typeName];

  // Prepare data for packed bubble chart

  const chartData = fruitsOfType.map((fruit, i) => ({
    name: fruit.name,
    color: getRandomColor(),
    value: fruit.id
  }));

  console.log('fruitsOfType', fruitsOfType)

  // const chartData2 = chartData.splice(chartData.length / 2);

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
        point: {
          events: {
            mouseOver: function () {
              const chart = this.series.chart;
              const hoveredId = this.options.id;
              console.log('hoveredId', this.options);

              chart.series.forEach(series => {
                series.points.forEach(point => {
                  // We check ONLY if the point's parentage array contains the hovered ID
                  const isChild = point.options.parentage?.includes(hoveredId);

                  if (isChild) {
                    point.setState('hover');
                    point.graphic?.attr({ opacity: 1, zIndex: 10 });
                  } else {
                    // This will dim everything else, including the hovered bubble itself
                    point.setState('inactive');
                    point.graphic?.attr({ opacity: 0.1, zIndex: 1 });
                  }
                });
              });
            }
            // mouseOut: function () {
            //   const chart = this.series.chart;
            //   chart.series.forEach(series => {
            //     series.points.forEach(point => {
            //       point.setState('');
            //       if (point.graphic) point.graphic.attr({ opacity: 1, zIndex: 1 });
            //     });
            //   });
            // }
          }
        },
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02
        },
        dataLabels: {
          enabled: true,
          // format: '{series.name}',
          formatter: (...d) => {
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
      color: c.color,
      data: [{ value: c.value }]
    }))
  };

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  chartInstance.value = Highcharts.chart(chartTarget.value, options);
});
</script>