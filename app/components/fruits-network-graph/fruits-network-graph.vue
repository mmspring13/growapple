<template>
  <div class="w-full space-y-4">
    <div ref="containerRef" class="w-full rounded-xl overflow-hidden shadow-xl border border-stone-800 bg-zinc-900">
      <svg ref="svgRef" class="block w-full" style="height: 600px;"></svg>
    </div>

    <div class="rounded-xl shadow-xl border border-stone-800 p-4 bg-zinc-800">
      <h3 class="text-white font-bold text-lg mb-3">Legend</h3>

      <div class="mt-2 mb-4 flex flex-row gap-6 items-center">
        <label class="text-stone-300 text-sm flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
          <input type="color" v-model="parentColor" class="w-5 h-5 bg-transparent border-none cursor-pointer" />
          Parent Connection
        </label>
        <label class="text-stone-300 text-sm flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
          <input type="color" v-model="childrenColor" class="w-5 h-5 bg-transparent border-none cursor-pointer" />
          Children Connection
        </label>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <div
          v-for="fruit in sortedFruits"
          :key="fruit.id"
          class="flex items-center gap-2 p-2 rounded hover:bg-stone-700/50 transition-colors cursor-pointer group"
          @click="handleLegendClick(fruit)"
          @mouseenter="hoveredFruitId = fruit.id"
          @mouseleave="hoveredFruitId = null"
        >
          <div
            class="w-3 h-3 rounded-full border border-white/20 shrink-0 group-hover:scale-110 transition-transform"
            :style="{ backgroundColor: fruit.color || '#087E8B' }"
          ></div>
          <span class="text-white text-xs truncate" :title="fruit.name">{{ fruit.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import getRandomTailwindColor from "#shared/helpers/get-random-tailwind-color";
import type { Fruit } from "~~/composables/fruits/types";

interface D3Node extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: any;
  target: any;
}

const props = withDefaults(defineProps<{ fruits: Array<Fruit> }>(), { fruits: () => [] });
const router = useRouter();

const svgRef = ref<SVGSVGElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const hoveredFruitId = ref<number | null>(null);

const nodes = ref<D3Node[]>([]);
const links = ref<D3Link[]>([]);
let simulation: d3.Simulation<D3Node, D3Link> | null = null;
let resizeObserver: ResizeObserver | null = null;

const parentColor = ref('#DB5461');
const childrenColor = ref('#31AFD4');

watch(() => props.fruits, () => {
  updateGraphData();
}, { immediate: true });

watch(hoveredFruitId, (id) => highlightNodes(id));

const sortedFruits = computed(() => [...props.fruits].sort((a, b) => a.name.localeCompare(b.name)));

function updateGraphData() {
  const width = containerRef.value?.clientWidth || 0;
  const height = 600;

  if (width === 0) return;

  const existingNodes = new Map(nodes.value.map(d => [d.id, d]));

  nodes.value = props.fruits.map(f => {
    const old = existingNodes.get(f.id);
    return {
      ...f,
      color: f.color || '#087E8B',
      x: old?.x ?? (width / 2 + (Math.random() - 0.5) * 100),
      y: old?.y ?? (height / 2 + (Math.random() - 0.5) * 100),
      vx: old?.vx ?? 0,
      vy: old?.vy ?? 0
    };
  });

  const newLinks: D3Link[] = [];
  props.fruits.forEach(fruit => {
    fruit.parentage.forEach(p => {
      if (props.fruits.some(a => a.id === p.id)) {
        newLinks.push({ source: p.id, target: fruit.id });
      }
    });
  });
  links.value = newLinks;

  if (simulation) {
    simulation.nodes(nodes.value);
    (simulation.force('link') as d3.ForceLink<D3Node, D3Link>).links(links.value);
    simulation.alpha(0.3).restart();
  }

  renderElements();
}

function renderElements() {
  if (!svgRef.value || !containerRef.value) return;
  const width = containerRef.value.clientWidth;
  const height = 600;
  const radius = 20;

  if (width === 0) return; // Guard against hidden container

  const svg = d3.select(svgRef.value).attr('width', width).attr('height', height);

  if (svg.select('.main-g').empty()) {
    const main = svg.append('g').attr('class', 'main-g');
    main.append('g').attr('class', 'links-layer');
    main.append('g').attr('class', 'nodes-layer');
  }

  const link = svg.select('.links-layer')
    .selectAll<SVGLineElement, D3Link>('line')
    .data(links.value, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`)
    .join('line')
    .attr('stroke', '#444')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.4);

  const node = svg.select('.nodes-layer')
    .selectAll<SVGGElement, D3Node>('.node-group')
    .data(nodes.value, d => d.id)
    .join(
      enter => {
        const g = enter.append('g').attr('class', 'node-group').style('cursor', 'grab');
        g.append('circle').attr('r', radius).attr('stroke', '#18181b').attr('stroke-width', 2);
        g.append('text').attr('dx', 25).attr('dy', 5).attr('fill', '#e5e7eb').style('font-size', '12px').style('pointer-events', 'none');
        return g;
      }
    )
    .on('mouseenter', (e, d) => hoveredFruitId.value = d.id)
    .on('mouseleave', () => hoveredFruitId.value = null)
    .on('click', (e, d) => router.push(`/fruit/${d.slug}`))
    .call(d3.drag<SVGGElement, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  node.select('circle').attr('fill', d => d.color);
  node.select('text').text(d => d.name);

  if (!simulation) {
    simulation = d3.forceSimulation<D3Node>(nodes.value)
      .force('link', d3.forceLink<D3Node, D3Link>(links.value).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide().radius(radius + 20))
      .on('tick', () => {
        // Updated clamping logic to use current container width
        const currentWidth = containerRef.value?.clientWidth || width;
        nodes.value.forEach(d => {
          d.x = Math.max(radius, Math.min(currentWidth - radius, d.x!));
          d.y = Math.max(radius, Math.min(height - radius, d.y!));
        });

        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      });
  }

  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.5).restart();
}

function highlightNodes(activeId: number | null) {
  const svg = d3.select(svgRef.value);
  if (!svg.node()) return;

  const nodesLayer = svg.selectAll('.node-group');
  const linksLayer = svg.selectAll('line');

  if (!activeId) {
    nodesLayer.style('opacity', 1).select('circle').attr('r', 20);
    linksLayer.attr('stroke', '#444').attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
    return;
  }

  const relatives = new Set<number>([activeId]);
  linksLayer.each((l: any) => {
    if (l.source.id === activeId || l.target.id === activeId) {
      relatives.add(l.source.id);
      relatives.add(l.target.id);
    }
  });

  nodesLayer.style('opacity', (d: any) => relatives.has(d.id) ? 1 : 0.1);
  linksLayer.each(function(l: any) {
    const isParent = l.target.id === activeId;
    const isChild = l.source.id === activeId;
    d3.select(this)
      .attr('stroke', isParent ? parentColor.value : (isChild ? childrenColor.value : '#444'))
      .attr('stroke-opacity', (isParent || isChild) ? 1 : 0.05)
      .attr('stroke-width', (isParent || isChild) ? 3 : 1);
  });
}

onMounted(async () => {
  await nextTick();

  resizeObserver = new ResizeObserver(() => {
    if (containerRef.value?.clientWidth) {
      updateGraphData();
    }
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  updateGraphData();
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (simulation) simulation.stop();
});

function dragstarted(event: any) {
  if (!event.active) simulation?.alphaTarget(0.2).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}
function dragged(event: any) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}
function dragended(event: any) {
  if (!event.active) simulation?.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

const handleLegendClick = (fruit: any) => router.push(`/fruit/${fruit.slug}`);
</script>

<style scoped>
.node-group text {
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  font-weight: 400;
  transition: font-size 0.2s;
}
</style>