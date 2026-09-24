<script setup>
import { Github, Menu, Moon, Sparkles, Sun } from 'lucide-vue-next'

defineProps({ dark: { type: Boolean, required: true } })
defineEmits(['open-menu', 'toggle-theme'])
</script>

<template>
  <header class="topbar">
    <div class="topbar-start">
      <button class="icon-button menu-button" type="button" aria-label="打开导航" @click="$emit('open-menu')"><Menu :size="20" /></button>
      <a class="brand" href="#workspace" aria-label="Tools 工具站">
        <span class="brand-icon"><Sparkles :size="19" :stroke-width="2" /></span>
        <span>Tools 工具站</span>
      </a>
    </div>
    <div class="topbar-end">
      <span class="local-indicator"><span></span> 浏览器本地运行</span>
      <a class="icon-button" href="https://github.com/Leon-Amazing/devtools" target="_blank" rel="noopener noreferrer" aria-label="查看 GitHub 仓库"><Github :size="18" /></a>
      <button class="icon-button" type="button" :aria-label="dark ? '切换浅色模式' : '切换深色模式'" @click="$emit('toggle-theme')"><Sun v-if="dark" :size="18" /><Moon v-else :size="18" /></button>
    </div>
  </header>
</template>
