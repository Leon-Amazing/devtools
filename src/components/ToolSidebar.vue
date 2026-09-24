<script setup>
import { ShieldCheck, X } from 'lucide-vue-next'
import { tools } from '../tools.js'
import { toolIcons } from '../toolIcons.js'

defineProps({
  activeId: { type: String, required: true },
  open: { type: Boolean, required: true },
})
defineEmits(['select', 'close'])

const groups = [...new Set(tools.map(tool => tool.category))].map(name => ({
  name,
  items: tools.filter(tool => tool.category === name),
}))
</script>

<template>
  <aside class="sidebar" :class="{ open }">
    <div class="sidebar-mobile-head"><strong>工具导航</strong><button class="icon-button" type="button" aria-label="关闭导航" @click="$emit('close')"><X :size="19" /></button></div>
    <nav aria-label="工具导航">
      <div v-for="group in groups" :key="group.name" class="nav-group">
        <h2>{{ group.name }}</h2>
        <button v-for="tool in group.items" :key="tool.id" type="button" class="nav-tool" :class="{ active: activeId === tool.id }" :aria-current="activeId === tool.id ? 'page' : undefined" @click="$emit('select', tool.id)">
          <component :is="toolIcons[tool.id]" :size="16" :stroke-width="1.8" />
          <span>{{ tool.title }}</span>
        </button>
      </div>
    </nav>
    <div class="sidebar-foot"><ShieldCheck :size="15" /> 数据仅在本地处理</div>
  </aside>
</template>
