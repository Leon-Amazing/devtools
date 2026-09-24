<script setup>
import { computed, ref } from 'vue'
import { tools } from './tools.js'
import AppHeader from './components/AppHeader.vue'
import ToolSidebar from './components/ToolSidebar.vue'
import ToolWorkspace from './components/ToolWorkspace.vue'

const activeId = ref('json')
const activeTool = computed(() => tools.find(tool => tool.id === activeId.value))
const mobileMenu = ref(false)
const dark = ref(false)

function selectTool(id) {
  activeId.value = id
  mobileMenu.value = false
}
</script>

<template>
  <div class="app-shell" :class="{ 'dark-theme': dark }">
    <AppHeader :dark="dark" @open-menu="mobileMenu = true" @toggle-theme="dark = !dark" />
    <div class="body-layout">
      <ToolSidebar :active-id="activeId" :open="mobileMenu" @select="selectTool" @close="mobileMenu = false" />
      <div v-if="mobileMenu" class="sidebar-scrim" @click="mobileMenu = false"></div>
      <ToolWorkspace :key="activeId" :tool="activeTool" />
    </div>
  </div>
</template>
