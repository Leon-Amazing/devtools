<script setup>
defineProps({
  toolId: { type: String, required: true },
  pattern: { type: String, required: true },
  flags: { type: String, required: true },
  count: { type: Number, required: true },
})
defineEmits(['update:pattern', 'update:flags', 'update:count', 'update:input'])
</script>

<template>
  <div v-if="toolId === 'regex'" class="options-row regex-options">
    <label for="regex-pattern">正则表达式</label>
    <div class="regex-field"><span>/</span><input id="regex-pattern" :value="pattern" spellcheck="false" placeholder="例如 [a-z]+" @input="$emit('update:pattern', $event.target.value)" /><span>/</span><input :value="flags" class="flags-input" aria-label="正则标志" spellcheck="false" placeholder="g" @input="$emit('update:flags', $event.target.value)" /></div>
    <span class="option-help">g 表示查找全部</span>
  </div>
  <div v-else-if="toolId === 'uuid'" class="options-row">
    <label for="uuid-count">生成数量</label>
    <select id="uuid-count" :value="count" @change="$emit('update:count', Number($event.target.value))"><option v-for="number in [1, 3, 5, 10, 20]" :key="number" :value="number">{{ number }} 个</option></select>
    <span class="option-help">使用浏览器安全随机数生成 UUID v4</span>
  </div>
  <div v-else-if="toolId === 'timestamp'" class="options-row quick-time">
    <span class="option-label">快捷输入</span>
    <button type="button" @click="$emit('update:input', String(Math.floor(Date.now() / 1000)))">当前 Unix 秒</button>
    <button type="button" @click="$emit('update:input', new Date().toISOString())">当前 ISO 时间</button>
  </div>
</template>
