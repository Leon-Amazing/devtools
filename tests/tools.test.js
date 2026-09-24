import test from 'node:test'
import assert from 'node:assert/strict'
import { processTool } from '../src/tools.js'

test('JSON 格式化与压缩', async () => {
  assert.equal(await processTool('json', '{"x":1}', 'format'), '{\n  "x": 1\n}')
  assert.equal(await processTool('json', '{ "x": 1 }', 'minify'), '{"x":1}')
})

test('Base64 支持 Unicode 往返转换', async () => {
  const encoded = await processTool('base64', '你好 🌍', 'encode')
  assert.equal(await processTool('base64', encoded, 'decode'), '你好 🌍')
})

test('URL 编解码往返转换', async () => {
  const encoded = await processTool('url', 'a b&中', 'encode')
  assert.equal(await processTool('url', encoded, 'decode'), 'a b&中')
})

test('时间戳按秒转换', async () => {
  assert.match(await processTool('timestamp', '0', 'convert'), /1970-01-01T00:00:00.000Z/)
})

test('正则匹配与无效表达式', async () => {
  assert.match(await processTool('regex', 'a1 b2', 'match', { pattern: '\\d', flags: 'g' }), /2 处匹配/)
  await assert.rejects(processTool('regex', 'a', 'match', { pattern: '[', flags: 'g' }))
})

test('哈希与 UUID 生成', async () => {
  assert.equal(await processTool('hash', 'abc', 'calculate'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  assert.equal((await processTool('uuid', '', 'generate', { count: 3 })).split('\n').length, 3)
})
