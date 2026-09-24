<script setup>
import { nextTick, ref, watch } from 'vue'
import { Fingerprint, ShieldCheck } from 'lucide-vue-next'
import { processTool } from '../tools.js'
import { toolIcons } from '../toolIcons.js'
import ToolOptions from './ToolOptions.vue'
import ToolToolbar from './ToolToolbar.vue'

const props = defineProps({ tool: { type: Object, required: true } })

const input = ref('')
const output = ref('')
const mode = ref(props.tool.modes[0][0])
const pattern = ref('[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}')
const flags = ref('g')
const count = ref(5)
const error = ref('')
const running = ref(false)
const copied = ref(false)

async function run() {
  error.value = ''
  running.value = true
  try {
    output.value = await processTool(props.tool.id, input.value, mode.value, { pattern: pattern.value, flags: flags.value, count: count.value })
  } catch (exception) {
    output.value = ''
    error.value = exception instanceof Error ? exception.message : '处理失败，请检查输入。'
  } finally {
    running.value = false
  }
}

function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}

async function chooseMode(nextMode) {
  mode.value = nextMode
  await nextTick()
  if (props.tool.id === 'uuid' || input.value.trim()) await run()
}

async function copyResult() {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1800)
  } catch {
    error.value = '复制失败，请检查浏览器剪贴板权限。'
  }
}

watch([input, mode, pattern, flags, count], () => {
  output.value = ''
  error.value = ''
  copied.value = false
})
</script>

<template>
  <main id="workspace" class="workspace">
    <div class="workspace-intro">
      <div class="tool-heading"><span class="heading-icon"><component :is="toolIcons[tool.id]" :size="21" /></span><div><span class="heading-category">{{ tool.category }}</span><h1>{{ tool.title }}</h1></div></div>
      <p>{{ tool.description }}。基础操作在浏览器中完成，无需上传数据。</p>
    </div>

    <section class="tool-panel" :aria-label="tool.title">
      <ToolToolbar :tool="tool" :mode="mode" :output="output" :running="running" :copied="copied" @choose-mode="chooseMode" @load-sample="input = tool.sample" @clear="clear" @copy="copyResult" @run="run" />
      <ToolOptions :tool-id="tool.id" v-model:pattern="pattern" v-model:flags="flags" v-model:count="count" @update:input="input = $event" />

      <div class="editor-grid">
        <div class="editor-pane input-pane">
          <div class="pane-title"><label for="tool-input">{{ tool.id === 'uuid' ? '选项' : '输入内容' }}</label><span>{{ tool.id === 'uuid' ? 'UUID v4' : 'INPUT' }}</span></div>
          <textarea v-if="tool.id !== 'uuid'" id="tool-input" v-model="input" :placeholder="tool.placeholder" spellcheck="false" :aria-invalid="Boolean(error)" @keydown.ctrl.enter.prevent="run" @keydown.meta.enter.prevent="run"></textarea>
          <div v-else class="uuid-empty"><Fingerprint :size="34" :stroke-width="1.5" /><strong>准备生成 UUID</strong><p>选择上方的生成数量，然后点击“生成 UUID”。</p></div>
        </div>
        <div class="editor-pane output-pane">
          <div class="pane-title"><label for="tool-output">处理结果</label><span>OUTPUT</span></div>
          <textarea id="tool-output" :value="output" readonly :placeholder="tool.id === 'json' ? '输入 JSON 并点击处理后，结果会显示在这里…' : '处理结果会显示在这里…'" spellcheck="false"></textarea>
        </div>
      </div>

      <div class="panel-bottom">
        <p v-if="error" class="error-message" role="alert">{{ error }}</p>
        <span v-else class="privacy-note"><ShieldCheck :size="15" /> 所有处理均在当前浏览器中完成</span>
        <span class="shortcut">Ctrl ↵ 快速处理</span>
      </div>
    </section>
  </main>
</template>
