<script setup>
import { Check, Copy, Play, RotateCcw } from 'lucide-vue-next'

defineProps({
  tool: { type: Object, required: true },
  mode: { type: String, required: true },
  output: { type: String, required: true },
  running: { type: Boolean, required: true },
  copied: { type: Boolean, required: true },
})
defineEmits(['choose-mode', 'load-sample', 'clear', 'copy', 'run'])
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <div v-if="tool.modes.length > 1" class="mode-tabs" :aria-label="`${tool.title}操作`"><button v-for="entry in tool.modes" :key="entry[0]" type="button" :class="{ active: mode === entry[0] }" @click="$emit('choose-mode', entry[0])">{{ entry[1] }}</button></div>
      <span v-if="tool.modes.length > 1" class="toolbar-divider"></span>
      <button v-if="tool.sample && tool.id !== 'uuid'" class="toolbar-action" type="button" @click="$emit('load-sample')">载入示例</button>
      <button class="toolbar-action" type="button" @click="$emit('clear')"><RotateCcw :size="15" /> 清空</button>
    </div>
    <div class="toolbar-right">
      <button class="toolbar-action copy-action" type="button" :disabled="!output" @click="$emit('copy')"><Check v-if="copied" :size="15" /><Copy v-else :size="15" /> {{ copied ? '已复制' : '复制结果' }}</button>
      <button class="run-button" type="button" :disabled="running" @click="$emit('run')"><Play :size="14" fill="currentColor" /> {{ running ? '处理中…' : tool.id === 'uuid' ? '生成 UUID' : tool.id === 'hash' ? '计算哈希' : '开始处理' }}</button>
    </div>
  </div>
</template>
