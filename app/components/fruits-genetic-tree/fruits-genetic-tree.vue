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
import { useTheme } from '~/composables/useTheme'

const props = defineProps({
  apple: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { theme } = useTheme()

const svgRef = ref(null)
const containerRef = ref(null)

// Helper function to get apples by IDs (replace with your actual data fetching)
const getApplesByIds = (ids) => {
  // This is a placeholder - implement based on your data structure
  // You might want to use a composable or store for this
  return ids.map(id => ({
    id,
    slug: `apple-${id}`,
    name: `Apple ${id}`,
    parentage: []
  }))
}

// Build the tree data structure
const buildTreeData = (apple) => {
  const nodes = []
  const links = []

  // Level 0: Focus Apple
  nodes.push({
    id: apple.id,
    slug: apple.slug,
    name: apple.name,
    level: 0,
    type: 'focus'
  })

  // Level -1: Parents
  const parents = getApplesByIds(apple.parentage || [])
  parents.forEach(p => {
    nodes.push({
      id: p.id,
      slug: p.slug,
      name: p.name,
      level: -1,
      type: 'parent'
    })
    links.push({ source: p.id, target: apple.id })

    // Level -2: Grandparents
    const grandparents = getApplesByIds(p.parentage || [])
    grandparents.forEach(gp => {
      if (!nodes.find(n => n.id === gp.id)) {
        nodes.push({
          id: gp.id,
          slug: gp.slug,
          name: gp.name,
          level: -2,
          type: 'grandparent'
        })
      }
      links.push({ source: gp.id, target: p.id })
    })
  })

  // Level 1: Children
  const children = getApplesByIds(apple.children || [])
  children.forEach(c => {
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

// Draw the tree
const drawTree = () => {
  if (!svgRef.value || !containerRef.value || !props.apple) return

  const width = containerRef.value.clientWidth
  const height = 600
  const margin = { top: 40, right: 90, bottom: 40, left: 90 }

  // Clear previous SVG
  d3.select(svgRef.value).selectAll('*').remove()

  const svg = d3
    .select(svgRef.value)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // Build the data structure
  const { nodes, links } = buildTreeData(props.apple)

  // Calculate positions
  const levelHeight = 150
  const centerY = height / 2 - margin.top - margin.bottom

  // Group by level
  const levels = {}
  nodes.forEach(n => {
    if (!levels[n.level]) levels[n.level] = []
    levels[n.level].push(n)
  })

  // Assign X/Y positions
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

  // Draw Links
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

      // Curved cubic bezier
      return `M${source.x},${source.y} C${source.x},${(source.y + target.y) / 2} ${target.x},${(source.y + target.y) / 2} ${target.x},${target.y}`
    })

  // Draw Nodes
  const nodeGroup = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      router.push(`/apple/${d.slug}`)
    })

  // Node Circles
  nodeGroup.append('circle')
    .attr('r', d => d.type === 'focus' ? 30 : 20)
    .attr('fill', d => {
      if (d.type === 'focus') return '#F27D26' // Accent
      if (d.type === 'parent' || d.type === 'grandparent') return '#E6E65C' // Yellowish
      return '#E85D5D' // Reddish
    })
    .attr('stroke', 'currentColor')
    .attr('class', 'text-white dark:text-stone-900 transition-all duration-300 hover:scale-110')
    .attr('stroke-width', 2)

  // Node Labels
  nodeGroup.append('text')
    .attr('dy', d => d.type === 'focus' ? 45 : 35)
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'text-xs font-sans font-medium fill-stone-700 dark:fill-stone-300')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
}

// Create theme composable if it doesn't exist
// You can create this file at composables/useTheme.ts
if (!useTheme) {
  // Fallback theme detection
  const isDark = ref(false)

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  })

  // Provide a simple theme composable if not available
  const useTheme = () => ({
    theme: computed(() => isDark.value ? 'dark' : 'light')
  })
}

// Draw on mount and when apple or theme changes
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

watch(theme, () => {
  // Redraw on theme change to update colors
  drawTree()
})

// Handle window resize
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