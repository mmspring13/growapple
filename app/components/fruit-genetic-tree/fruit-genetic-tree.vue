<!-- components/GeneticTree.vue -->
<template>
  <div ref="containerRef" class="w-full overflow-hidden bg-white/50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-300">
    <svg ref="svgRef" class="w-full block"></svg>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useRouter } from '#app'

const props = defineProps({
  apple: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const svgRef = ref(null)
const containerRef = ref(null)

const getApplesByIds = (ids) => {
  return ids.map(id => ({
    id,
    slug: `apple-${id}`,
    name: `Apple ${id}`,
    parentage: []
  }))
}

const buildTreeData = (apple) => {
  const nodes = []
  const links = []

  nodes.push({
    id: apple.id,
    slug: apple.slug,
    name: apple.name,
    level: 0,
    type: 'focus'
  })

  apple.parentage?.forEach(p => {
    nodes.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      level: -1,
      type: 'parent'
    })
    links.push({ source: p.id, target: apple.id })
  })

  apple.children?.forEach(c => {
    nodes.push({
      id: c.id,
      slug: c.slug,
      name: c.name,
      level: 1,
      type: 'child'
    })
    links.push({ source: apple.id, target: c.id })
  })

  return { nodes, links }
}

const drawTree = () => {
  if (!svgRef.value || !containerRef.value || !props.apple) return

  const width = containerRef.value.clientWidth
  const height = 600
  const margin = { top: 40, right: 90, bottom: 40, left: 90 }

  d3.select(svgRef.value).selectAll('*').remove()

  const svg = d3
    .select(svgRef.value)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const { nodes, links } = buildTreeData(props.apple)

  const levelHeight = 150
  const centerY = height / 2 - margin.top - margin.bottom

  const levels = {}
  nodes.forEach(n => {
    if (!levels[n.level]) levels[n.level] = []
    levels[n.level].push(n)
  })

  Object.keys(levels).forEach(key => {
    const lvl = parseInt(key)
    const nodesInLevel = levels[lvl]
    const totalW = width - margin.left - margin.right
    const step = totalW / (nodesInLevel.length + 1)

    nodesInLevel.forEach((n, i) => {
      n.x = step * (i + 1)
      n.y = centerY + (lvl * levelHeight)
    })
  })

  svg.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('class', 'text-stone-300 dark:text-stone-700')
    .attr('stroke-width', 2)
    .attr('d', d => {
      const source = nodes.find(n => n.id === d.source)
      const target = nodes.find(n => n.id === d.target)
      if (!source || !target) return ''

      return `M${source.x},${source.y} C${source.x},${(source.y + target.y) / 2} ${target.x},${(source.y + target.y) / 2} ${target.x},${target.y}`
    })

  const nodeGroup = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      router.push(`/fruit/${d.slug}`)
    })

  nodeGroup.append('circle')
    .attr('r', d => d.type === 'focus' ? 30 : 20)
    .attr('fill', d => {
      if (d.type === 'focus') return '#F27D26'
      if (d.type === 'parent' || d.type === 'grandparent') return '#E6E65C'
      return '#E85D5D'
    })
    .attr('stroke', 'currentColor')
    .attr('class', 'text-white dark:text-stone-900 transition-all duration-300 hover:scale-110')
    .attr('stroke-width', 2)

  nodeGroup.append('text')
    .attr('dy', d => d.type === 'focus' ? 45 : 35)
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'text-xs font-sans font-medium fill-stone-700 dark:fill-stone-300')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
}

onMounted(() => {
  nextTick(() => {
    drawTree()
  })
})

watch(() => props.apple, () => {
  nextTick(() => {
    drawTree()
  })
}, { deep: true })

onMounted(() => {
  const handleResize = () => {
    drawTree()
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<!--<template>-->
<!--  <div ref="container"></div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, onMounted, watch } from 'vue';-->
<!--import * as d3 from 'd3';-->

<!--const props = defineProps<{-->
<!--  fruit: any;-->
<!--  allFruits: any[];-->
<!--  colorMap: Map<string, string>;-->
<!--  hoveredFruitId: number | null;-->
<!--}>();-->

<!--const emits = defineEmits<{ (e: 'node-click', fruit: any): void; (e: 'node-hover', fruitId: number | null): void }>();-->
<!--const container = ref(null);-->

<!--const createChart = () => {-->
<!--  if (!container.value) return;-->
<!--  d3.select(container.value).select('svg').remove();-->

<!--  const root = d3.hierarchy(props.fruit, getChildren);-->
<!--  const screenWidth = window.innerWidth;-->
<!--  const isSmallScreen = screenWidth < 768;-->
<!--  const nodeSize = { width: isSmallScreen ? 220 : 300, height: isSmallScreen ? 200 : 150 };-->
<!--  const treeLayout = d3.tree().nodeSize([nodeSize.height, nodeSize.width]);-->

<!--  treeLayout(root);-->
<!--  -->
<!--  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;-->
<!--  root.each(d => {-->
<!--    if (d.x < minX) minX = d.x;-->
<!--    if (d.x > maxX) maxX = d.x;-->
<!--    if (d.y < minY) minY = d.y;-->
<!--    if (d.y > maxY) maxY = d.y;-->
<!--  });-->

<!--  const width = maxY - minY + nodeSize.width * 2;-->
<!--  const height = maxX - minX + nodeSize.height * 2;-->

<!--  const svg = d3.select(container.value).append('svg')-->
<!--    .attr('width', width)-->
<!--    .attr('height', height)-->
<!--    .attr('class', 'overflow-visible');-->

<!--  const g = svg.append('g').attr('transform', `translate(${nodeSize.width / 2 - minY}, ${height / 2 - (maxX + minX) / 2})`);-->

<!--  g.selectAll('.link')-->
<!--    .data(root.links())-->
<!--    .enter().append('path')-->
<!--      .attr('d', d => `M${d.source.y},${d.source.x} L${d.target.y},${d.target.x}`)-->
<!--      .attr('class', 'link');-->

<!--  const node = g.selectAll('.node')-->
<!--    .data(root.descendants())-->
<!--    .enter().append('g')-->
<!--      .attr('transform', d => `translate(${d.y},${d.x})`)-->
<!--      .attr('class', 'node')-->
<!--      .on('click', (event, d) => emits('node-click', d.data))-->
<!--      .on('mouseenter', (event, d) => emits('node-hover', d.data.id))-->
<!--      .on('mouseleave', () => emits('node-hover', null))-->
<!--      .style('cursor', 'pointer');-->
<!--      -->

<!--  node.append('rect')-->
<!--    .attr('width', 200)-->
<!--    .attr('height', 100)-->
<!--    .attr('rx', 10)-->
<!--    .attr('ry', 10)-->
<!--    .attr('x', -100)-->
<!--    .attr('y', -50)-->
<!--    .attr('class', 'node-rect');-->

<!--  node.append('text')-->
<!--    .attr('dy', '.35em')-->
<!--    .attr('text-anchor', 'middle')-->
<!--    .text(d => d.data?.name)-->
<!--    .attr('class', 'node-text');-->

<!--  function getChildren(d) {-->
<!--    if (!d?.parentage) return null;-->
<!--    return d.parentage.map(p => props.allFruits.find(f => f.id === p.id)).filter(Boolean);-->
<!--  }-->

<!--  watch(() => props.hoveredFruitId, (newId) => {-->
<!--    node.selectAll('.node-rect').style('stroke', d => d.data?.id === newId ? 'white' : 'transparent')-->
<!--      .style('stroke-width', d => d.data.id === newId ? 3 : 1);-->
<!--  });-->


<!--}-->

<!--onMounted(createChart);-->

<!--watch(props, createChart, { deep: true, immediate: true });-->

<!--</script>-->

<!--<style>-->
<!--.node-rect {-->
<!--  stroke: transparent;-->
<!--  stroke-width: 1px;-->
<!--  transition: stroke 0.3s, node-text;-->
<!--  fill: white;-->
<!--  font-size: 1.1rem;-->
<!--  font-weight: 500;-->
<!--  text-shadow: 0 1px 3px rgba(0,0,0,0.5);-->
<!--}-->

<!--.link {-->
<!--  fill: none;-->
<!--  stroke: #555;-->
<!--  stroke-width: 2px;-->
<!--  stroke-dasharray: 2, 2;-->
<!--}-->
<!--</style>-->
