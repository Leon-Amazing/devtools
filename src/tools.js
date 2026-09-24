const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })

export const tools = [
  { id: 'json', title: 'JSON 格式化', english: 'JSON FORMATTER', description: '整理、压缩与校验 JSON 数据', category: '数据处理', sample: '{"name":"Tools","version":3,"features":["fast","private"]}', placeholder: '在这里粘贴 JSON 数据…', modes: [['format', '格式化'], ['minify', '压缩'], ['validate', '校验']] },
  { id: 'base64', title: 'Base64 编解码', english: 'BASE64 ENCODER', description: '支持中文与 Unicode 文本', category: '编码转换', sample: 'Hello，世界！', placeholder: '输入需要编码或解码的文本…', modes: [['encode', '编码'], ['decode', '解码']] },
  { id: 'url', title: 'URL 编解码', english: 'URL ENCODER', description: '安全转换 URL 参数内容', category: '编码转换', sample: '你好 world & tools=1', placeholder: '输入 URL 参数或编码后的文本…', modes: [['encode', '编码'], ['decode', '解码']] },
  { id: 'timestamp', title: '时间戳转换', english: 'TIMESTAMP', description: '秒、毫秒与日期相互转换', category: '时间日期', sample: '', placeholder: '输入 Unix 时间戳（秒或毫秒）或日期，例如 2026-09-24T12:00:00Z', modes: [['convert', '转换']] },
  { id: 'uuid', title: 'UUID 生成器', english: 'UUID GENERATOR', description: '生成随机 UUID v4 标识符', category: '生成工具', sample: '', placeholder: '', modes: [['generate', '生成 UUID']] },
  { id: 'hash', title: 'SHA-256 哈希', english: 'SHA-256 HASH', description: '计算文本的 SHA-256 摘要', category: '生成工具', sample: 'Hello，世界！', placeholder: '输入需要计算哈希的文本…', modes: [['calculate', '计算哈希']] },
  { id: 'text', title: '文本统计', english: 'TEXT COUNTER', description: '统计字数、字符、行数与字节', category: '文本工具', sample: '写下一段文字，看看它有多少字符。\nBuild something useful.', placeholder: '输入或粘贴一段文本…', modes: [['count', '开始统计']] },
  { id: 'regex', title: '正则测试', english: 'REGEX TESTER', description: '快速检查表达式的匹配结果', category: '文本工具', sample: 'Contact hello@example.com or team@tools.dev', placeholder: '输入待匹配的文本…', modes: [['match', '查找匹配']] },
]

function bytesToBase64(value) {
  const bytes = encoder.encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToText(value) {
  const binary = atob(value.trim())
  return decoder.decode(Uint8Array.from(binary, char => char.charCodeAt(0)))
}

function formatTimestamp(value) {
  const trimmed = value.trim()
  const numeric = /^-?\d+(?:\.\d+)?$/.test(trimmed)
  const milliseconds = numeric ? Number(trimmed) * (Math.abs(Number(trimmed)) < 1e11 ? 1000 : 1) : Date.parse(trimmed)
  const date = new Date(milliseconds)
  if (!trimmed || !Number.isFinite(milliseconds) || Number.isNaN(date.getTime())) throw new Error('请输入有效的时间戳或日期。')
  return `ISO 8601       ${date.toISOString()}\nUnix 秒        ${Math.floor(milliseconds / 1000)}\nUnix 毫秒      ${milliseconds}\n本地时间       ${date.toLocaleString('zh-CN', { hour12: false })}`
}

function countText(value) {
  const characters = [...value].length
  const words = value.trim() ? (value.match(/[\p{L}\p{N}]+/gu) || []).length : 0
  const lines = value ? value.split(/\r\n|\r|\n/).length : 0
  return `字符数       ${characters}\n字词数       ${words}\n行数         ${lines}\nUTF-8 字节   ${encoder.encode(value).length}`
}

function testRegex(value, pattern, flags) {
  if (!pattern) throw new Error('请先输入正则表达式。')
  const regex = new RegExp(pattern, flags)
  const matches = []
  let match
  if (flags.includes('g')) {
    while ((match = regex.exec(value)) !== null && matches.length < 1000) {
      matches.push({ match: match[0], index: match.index, groups: match.groups || undefined })
      if (match[0] === '') regex.lastIndex++
    }
  } else {
    match = regex.exec(value)
    if (match) matches.push({ match: match[0], index: match.index, groups: match.groups || undefined })
  }
  return matches.length ? `${matches.length} 处匹配${matches.length === 1000 ? '（仅显示前 1000 处）' : ''}\n\n${matches.map((item, index) => `${index + 1}. 位置 ${item.index}  →  ${JSON.stringify(item.match)}${item.groups ? `\n   分组 ${JSON.stringify(item.groups)}` : ''}`).join('\n')}` : '未找到匹配内容。'
}

export async function processTool(id, value, mode, options = {}) {
  switch (id) {
    case 'json': {
      const parsed = JSON.parse(value)
      return mode === 'validate' ? '✓ JSON 格式有效' : JSON.stringify(parsed, null, mode === 'minify' ? 0 : 2)
    }
    case 'base64': return mode === 'decode' ? base64ToText(value) : bytesToBase64(value)
    case 'url': return mode === 'decode' ? decodeURIComponent(value) : encodeURIComponent(value)
    case 'timestamp': return formatTimestamp(value)
    case 'uuid': {
      if (!globalThis.crypto?.randomUUID) throw new Error('当前环境不支持安全随机数，请使用 HTTPS 或 localhost。')
      const count = Math.min(20, Math.max(1, Number(options.count) || 1))
      return Array.from({ length: count }, () => crypto.randomUUID()).join('\n')
    }
    case 'hash': {
      if (!globalThis.crypto?.subtle) throw new Error('当前环境不支持加密 API，请使用 HTTPS 或 localhost。')
      const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
      return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    }
    case 'text': return countText(value)
    case 'regex': return testRegex(value, options.pattern || '', options.flags || '')
    default: throw new Error('未知工具。')
  }
}
