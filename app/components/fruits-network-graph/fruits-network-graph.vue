<!-- components/AppleNetworkGraph.vue -->
<template>
  <div class="w-full space-y-4">
    <div ref="containerRef" class="w-full rounded-xl overflow-hidden shadow-xl border border-stone-800 bg-[#222]">
      <svg ref="svgRef" class="block w-full"></svg>
    </div>
    <div class="rounded-xl shadow-xl border border-stone-800 bg-[#222] p-4">
      <h3 class="text-white font-bold text-lg mb-3">Legend</h3>
      <div class="mt-2 mb-4 flex flex-row gap-1.5">
        <label for="parentColor">
          <input type="color" v-model="parentColor" id="parentColor" />
          Parent color
        </label>
        <label for="childrenColor">
          <input type="color" v-model="childrenColor" id="childrenColor" />
          Children color
        </label>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <div
          v-for="fruit in sortedFruits"
          :key="fruit.id"
          class="flex items-center gap-2 p-2 rounded hover:bg-stone-700/50 transition-colors cursor-pointer"
          @click="handleLegendClick(fruit)"
          @mouseenter="handleLegendHover(fruit.id)"
          @mouseleave="handleLegendHover(null)"
        >
          <div
            class="w-4 h-4 rounded-full border border-white shrink-0"
            :style="{ backgroundColor: colorMap.get(fruit.id)|| '#cccccc' }"
          ></div>
          <span class="text-white text-sm truncate" :title="fruit.name">{{ fruit.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import getRandomTailwindColor from "#shared/helpers/get-random-tailwind-color";

interface D3Node {
  id: number
  name: string
  slug: string
  color: string
  x?: number | null
  y?: number | null
  fx?: number | null
  fy?: number | null
}

interface D3Link {
  source: number | D3Node
  target: number | D3Node
}

const props = withDefaults(defineProps<{
  fruits: Array<any>
}>(), {
  fruits: () => [],
})

const router = useRouter()
const svgRef = ref<SVGSVGElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const simulation = ref<d3.Simulation<D3Node, D3Link> | null>(null)
const hoveredFruitId = ref<number | null>(null)

const parentColor = ref('#DB5461');
const childrenColor = ref('#31AFD4');

const colorMap = ref<Map<string, string>>(new Map());
watch(() => props.fruits, () => {
  props.fruits.forEach((fruit) => {
    colorMap.value.set(fruit.id, getRandomTailwindColor());
  });
}, { immediate: true });

watch(
  [() => props.fruits, colorMap],
  () => {
    if (svgRef.value && containerRef.value) {
      renderGraph()
    }
  }
)

watch(hoveredFruitId, (newId) => {
  highlightNodeFromLegend(newId)
})


onMounted(() => {
  renderGraph();
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (simulation.value) {
    simulation.value.stop()
  }
})

const handleResize = () => {
  if (svgRef.value && containerRef.value) {
    renderGraph()
  }
}

const sortedFruits = computed(() => {
  return [...props.fruits].sort((a, b) => a.name.localeCompare(b.name))
})

const handleLegendClick = (fruit: any) => {
  router.push(`/fruit/${fruit.slug}`)
}

const handleLegendHover = (fruitId: number | null) => {
  hoveredFruitId.value = fruitId
}

const highlightNodeFromLegend = (fruitId: number | null) => {
  if (!svgRef.value) return

  const svg = d3.select(svgRef.value)
  const nodes = svg.selectAll('g g g')
  const links = svg.selectAll('g g line')

  if (fruitId === null) {
    // Reset all nodes and links
    nodes.select('circle')
      .attr('r', 20)
      .attr('stroke-width', 1.5)
      .attr('fill', (d: any) => d.color)
    
    nodes.select('text')
      .style('font-size', '12px')
    
    links
      .attr('stroke', '#e6e6e6')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.6)
  } else {
    // Dim all nodes first
    nodes.select('circle')
      .attr('r', 20)
      .attr('stroke-width', 1.5)
      .attr('fill', (d: any) => d.id === fruitId ? d.color : d.color + '40')
    
    nodes.select('text')
      .style('font-size', (d: any) => d.id === fruitId ? '14px' : '12px')
      .style('font-weight', (d: any) => '100')
    
    // Highlight the selected node
    nodes.filter((d: any) => d.id === fruitId)
      .select('circle')
      .attr('r', 25)
      .attr('stroke-width', 3)
      .attr('fill', (d: any) => d.color)
    
    // Highlight related links
    links.each(function(l: any) {
      const sel = d3.select(this)
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source
      const targetId = typeof l.target === 'object' ? l.target.id : l.target
      
      if (sourceId === fruitId || targetId === fruitId) {
        sel.attr('stroke', targetId === fruitId ? parentColor.value : childrenColor.value)
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 1)
        
        // Highlight connected nodes
        const connectedId = sourceId === fruitId ? targetId : sourceId
        nodes.filter((n: any) => n.id === connectedId)
          .select('circle')
          .attr('fill', (d: any) => d.color)
      } else {
        sel.attr('stroke', '#e6e6e6')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.2)
      }
    })
  }
}

const renderGraph = () => {
  if (!svgRef.value || !containerRef.value) return

  const width = containerRef.value.clientWidth
  const height = 800

  // Clear previous SVG content
  d3.select(svgRef.value).selectAll('*').remove();

  const filteredApples = props.fruits;

  // Prepare Nodes
  const nodes: D3Node[] = filteredApples.map(a => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    color: colorMap.value.get(a.id) || '#cccccc',
    x: width / 2, // Initial positions
    y: height / 2,
    fx: null,
    fy: null
  }))

  // Prepare Links
  const links: D3Link[] = []
  filteredApples.forEach(apple => {
    apple.parentage.forEach(p => {
      // Ensure parent exists in the FILTERED dataset
      if (filteredApples.find(a => a.id === p.id)) {
        links.push({ source: p.id, target: apple.id })
      }
    })
  })

  // Setup Simulation
  simulation.value = d3.forceSimulation<D3Node>(nodes)
    .force('link', d3.forceLink<D3Node, D3Link>(links)
      .id(d => d.id)
      .distance(120))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(30).strength(0.7))

  const svg = d3.select(svgRef.value)
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#222')

  // Add a group for the graph
  const g = svg.append('g')

  // Draw Links
  const link = g.append('g')
    .attr('stroke', '#e6e6e6')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', 1)

  // Draw Nodes
  const node = g.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('g')
    .data(nodes)
    .join('g')
    .style('cursor', 'pointer')
    .call(d3.drag<SVGGElement, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))

  // Node Circles
  node.append('circle')
    .attr('r', 20)
    .attr('fill', d => d.color)

  // Node Labels
  node.append('text')
    .attr('x', 25)
    .attr('y', 5)
    .text(d => d.name)
    .style('font-size', '14px')
    .style('font-weight', '100')
    .style('fill', '#fff')
    .style('pointer-events', 'none')
    .style('text-shadow', '1px 1px 2px #000')

  // Interactions
  node.on('mouseover', function(event, d) {
    const activeNodeId = d.id

    // Highlight links
    link.each(function(l) {
      const sel = d3.select(this)

      // Convert source/target to node IDs for comparison
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source
      const targetId = typeof l.target === 'object' ? l.target.id : l.target

      // 1. Identify Children (where source is current node)
      if (sourceId === activeNodeId) {
        sel.attr('stroke', childrenColor.value)
          .attr('stroke-width', 4)
          .attr('stroke-opacity', 1)

        // Highlight child node (target)
        node.filter(n => n.id === targetId)
          .select('circle')
          .attr('fill', childrenColor.value)
      }

      // 2. Identify Parent (where target is current node)
      if (targetId === activeNodeId) {
        sel.attr('stroke', parentColor.value)
          .attr('stroke-width', 4)
          .attr('stroke-opacity', 1)

        // Highlight parent node (source)
        node.filter(n => n.id === sourceId)
          .select('circle')
          .attr('fill', parentColor.value)
      }
    })
  })
    .on('mouseout', function() {
      // Reset links
      link
        .attr('stroke', '#e6e6e6')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.6)

      // Reset nodes
      node.select('circle')
        .attr('fill', d => d.color)
    })
    .on('click', (event, d) => {
      router.push(`/fruit/${d.slug}`)
    })

  // Simulation Tick
  simulation.value.on('tick', () => {
    // Clamp nodes within the SVG bounds
    const radius = 20
    nodes.forEach(d => {
      d.x = Math.max(radius, Math.min(width - radius, d.x || 0))
      d.y = Math.max(radius, Math.min(height - radius, d.y || 0))
    })

    link
      .attr('x1', d => {
        const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source)
        return source?.x || 0
      })
      .attr('y1', d => {
        const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source)
        return source?.y || 0
      })
      .attr('x2', d => {
        const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target)
        return target?.x || 0
      })
      .attr('y2', d => {
        const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target)
        return target?.y || 0
      })

    node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`)
  })

  // Drag functions
  function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    if (!event.active && simulation.value) {
      simulation.value.alphaTarget(0.1).restart()
    }
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    if (!event.active && simulation.value) {
      simulation.value.alphaTarget(0)
    }
    event.subject.fx = null
    event.subject.fy = null
  }
}
</script>