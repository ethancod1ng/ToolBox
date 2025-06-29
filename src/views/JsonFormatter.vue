<template>
  <div class="formatter">
    <div class="formatter-header">
      <h1>JSON 格式化工具</h1>
      <p>粘贴、验证、格式化和压缩 JSON 数据</p>
    </div>

    <div class="formatter-actions">
      <button 
        class="main-btn" 
        @click="formatJson"
        :disabled="!inputJson.trim()"
        :class="{ 'disabled': !inputJson.trim() }"
      >
        <i class="mdi mdi-code-json"></i> 
        格式化
      </button>
      <button 
        class="main-btn" 
        @click="compressJson"
        :disabled="!inputJson.trim()"
        :class="{ 'disabled': !inputJson.trim() }"
      >
        <i class="mdi mdi-arrow-collapse-horizontal"></i> 
        压缩
      </button>
      <button 
        class="main-btn" 
        @click="validateJsonOnly"
        :disabled="!inputJson.trim()"
        :class="{ 'disabled': !inputJson.trim() }"
      >
        <i class="mdi mdi-check-circle-outline"></i> 
        验证
      </button>
      <button 
        class="main-btn" 
        @click="sortJson"
        :disabled="!inputJson.trim()"
        :class="{ 'disabled': !inputJson.trim() }"
      >
        <i class="mdi mdi-sort-alphabetical-ascending"></i> 
        排序
      </button>
    </div>

    <div class="formatter-content">
      <div 
        class="input-panel"
        @drop="handleFileDrop"
        @dragover.prevent
        @dragenter.prevent
        @dragleave.prevent
      >
        <div class="panel-header">
          <h3>输入 JSON</h3>
          <div class="input-actions">
            <button class="action-btn" @click="clearInput" title="清空输入">
              <i class="mdi mdi-delete-outline"></i>
              <span>清空</span>
            </button>
            <button class="action-btn" @click="pasteFromClipboard" title="从剪贴板粘贴">
              <i class="mdi mdi-clipboard-text-outline"></i>
              <span>粘贴</span>
            </button>
            <button class="action-btn" @click="selectFile" title="选择文件">
              <i class="mdi mdi-file-upload-outline"></i>
              <span>文件</span>
            </button>
            <input 
              ref="fileInput" 
              type="file" 
              @change="handleFileSelect" 
              style="display: none"
              accept=".json,.txt"
            />
          </div>
        </div>
        <div class="editor-container with-line-numbers">
          <div class="line-numbers">
            <div 
              v-for="(line, index) in inputLines" 
              :key="index" 
              class="line-number"
              :class="{ 'error-line': errorLine === index + 1 }"
            >
              {{ index + 1 }}
            </div>
          </div>
          <textarea 
            v-model="inputJson" 
            placeholder="请输入 JSON 字符串，或拖拽文件到此处" 
            class="json-input"
            @input="handleInputChange"
            :class="{ 'drag-over': isDragOver, 'error': hasError }"
            ref="jsonTextarea"
          ></textarea>
        </div>
        <div class="validation-message" v-if="validationMessage">
          <i class="mdi"
            :class="validationStatus ? 'mdi-check-circle text-success' : 'mdi-alert-circle text-error'"></i>
          <span>{{ validationMessage }}</span>
          <button 
            v-if="errorLine" 
            class="error-location-btn" 
            @click="scrollToError"
            title="跳转到错误位置"
          >
            <i class="mdi mdi-crosshairs-gps"></i>
            跳转到第 {{ errorLine }} 行
          </button>
        </div>
        <div v-if="jsonStats" class="json-stats">
          <span>字符数: {{ jsonStats.charCount }}</span>
          <span>行数: {{ jsonStats.lineCount }}</span>
          <span>深度: {{ jsonStats.maxDepth }}</span>
        </div>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <h3>格式化结果</h3>
          <div class="output-actions">
            <button 
              class="action-btn" 
              @click="downloadJson" 
              title="下载 JSON"
              :disabled="!formattedJson"
            >
              <i class="mdi mdi-download-outline"></i>
              <span>下载</span>
            </button>
            <button 
              class="action-btn" 
              @click="copyResult" 
              title="复制结果"
              :disabled="!formattedJson"
            >
              <i class="mdi" :class="copySuccess ? 'mdi-check' : 'mdi-content-copy'"></i>
              <span>{{ copySuccess ? '已复制' : '复制' }}</span>
            </button>
          </div>
        </div>
        <div class="editor-container with-line-numbers">
          <div class="line-numbers">
            <div 
              v-for="(line, index) in outputLines" 
              :key="index" 
              class="line-number"
            >
              {{ index + 1 }}
            </div>
          </div>
          <pre 
            class="json-output with-line-numbers" 
            v-html="highlightedJson"
          ></pre>
        </div>
        <div v-if="outputStats" class="output-stats">
          <span>字符数: {{ outputStats.charCount }}</span>
          <span>行数: {{ outputStats.lineCount }}</span>
          <span>压缩率: {{ outputStats.compressionRatio }}%</span>
        </div>
      </div>
    </div>

    <!-- 自定义提示框 -->
    <Transition name="toast">
      <div class="toast-container" v-if="toast.show">
        <div class="toast" :class="toast.type">
          <i class="mdi" :class="toast.icon"></i>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// 响应式数据
const inputJson = ref('')
const formattedJson = ref('')
const validationMessage = ref('')
const validationStatus = ref(false)
const copySuccess = ref(false)
const isDragOver = ref(false)
const hasError = ref(false)
const errorLine = ref(null)
const fileInput = ref(null)
const jsonTextarea = ref(null)

// Toast 状态
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  icon: 'mdi-check-circle'
})

// 防抖定时器
let debounceTimer = null

// 计算属性
const inputLines = computed(() => {
  return inputJson.value ? inputJson.value.split('\n') : []
})

const outputLines = computed(() => {
  return formattedJson.value ? formattedJson.value.split('\n') : []
})

const jsonStats = computed(() => {
  if (!inputJson.value) return null
  return {
    charCount: inputJson.value.length,
    lineCount: inputLines.value.length,
    maxDepth: calculateMaxDepth(inputJson.value)
  }
})

const outputStats = computed(() => {
  if (!formattedJson.value) return null
  const originalSize = inputJson.value.length
  const formattedSize = formattedJson.value.length
  const compressionRatio = originalSize > 0 ? Math.round((1 - formattedSize / originalSize) * 100) : 0
  return {
    charCount: formattedJson.value.length,
    lineCount: outputLines.value.length,
    compressionRatio: compressionRatio
  }
})

const highlightedJson = computed(() => {
  if (!formattedJson.value) return ''
  return highlightJson(formattedJson.value)
})

// 工具函数
const debounce = (func, delay) => {
  return (...args) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(this, args), delay)
  }
}

const showToast = (message, type = 'success') => {
  toast.value.message = message
  toast.value.type = type
  toast.value.icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
  toast.value.show = true

  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// JSON 处理函数
const validateJson = (json) => {
  try {
    if (!json.trim()) {
      validationMessage.value = ''
      validationStatus.value = false
      hasError.value = false
      errorLine.value = null
      return false
    }

    JSON.parse(json)
    validationMessage.value = '有效的 JSON 格式'
    validationStatus.value = true
    hasError.value = false
    errorLine.value = null
    return true
  } catch (e) {
    validationMessage.value = `无效的 JSON: ${e.message}`
    validationStatus.value = false
    hasError.value = true
    errorLine.value = findErrorLine(json, e.message)
    return false
  }
}

const findErrorLine = (json, errorMessage) => {
  try {
    // 尝试解析并找到错误位置
    const lines = json.split('\n')
    for (let i = 0; i < lines.length; i++) {
      try {
        JSON.parse(lines.slice(0, i + 1).join('\n'))
      } catch (e) {
        return i + 1
      }
    }
  } catch (e) {
    // 如果无法确定具体行号，返回 null
  }
  return null
}

const calculateMaxDepth = (jsonStr) => {
  try {
    const obj = JSON.parse(jsonStr)
    return getObjectDepth(obj)
  } catch (e) {
    return 0
  }
}

const getObjectDepth = (obj, depth = 0) => {
  if (obj === null || typeof obj !== 'object') {
    return depth
  }
  
  let maxDepth = depth
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      maxDepth = Math.max(maxDepth, getObjectDepth(obj[key], depth + 1))
    }
  }
  return maxDepth
}

const highlightJson = (json) => {
  // 先高亮 key
  let result = json.replace(/("[^"]+?")(?=\s*:)/g, '<span class="json-key">$1</span>')
  // 再高亮 value（字符串、数字、布尔、null）
  result = result.replace(/(:\s*)(".*?"|-?\d+(?:\.\d+)?|true|false|null)/g, '$1<span class="json-value">$2</span>')
  return result
}

// 输入处理函数
const handleInputChange = debounce(() => {
  if (inputJson.value.trim()) {
    const isValid = validateJson(inputJson.value)
    if (isValid) {
      // 自动格式化，使用2空格缩进
      try {
        const obj = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(obj, null, 2)
      } catch (e) {
        // 静默处理错误，不显示toast
      }
    }
  } else {
    validationMessage.value = ''
    formattedJson.value = ''
    hasError.value = false
    errorLine.value = null
  }
}, 300)

// 文件处理函数
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    readFile(file)
  }
  event.target.value = ''
}

const selectFile = () => {
  fileInput.value?.click()
}

const handleFileDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    readFile(files[0])
  }
}

const readFile = (file) => {
  if (file.size > 10 * 1024 * 1024) { // 10MB 限制
    showToast('文件过大，请选择小于 10MB 的文件', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    inputJson.value = e.target.result
    showToast(`已加载文件: ${file.name}`)
  }
  reader.onerror = () => {
    showToast('文件读取失败', 'error')
  }
  reader.readAsText(file)
}

// 主要功能函数
const formatJson = async () => {
  if (!inputJson.value.trim()) {
    showToast('请先输入JSON数据', 'error')
    return
  }

  try {
    if (validateJson(inputJson.value)) {
      const obj = JSON.parse(inputJson.value)
      formattedJson.value = JSON.stringify(obj, null, 2)
      showToast('JSON 格式化成功')
    } else {
      showToast('JSON 格式无效，请检查输入', 'error')
    }
  } catch (e) {
    showToast(`格式化失败: ${e.message}`, 'error')
  }
}

const compressJson = async () => {
  if (!inputJson.value.trim()) {
    showToast('请先输入JSON数据', 'error')
    return
  }

  try {
    if (validateJson(inputJson.value)) {
      const obj = JSON.parse(inputJson.value)
      formattedJson.value = JSON.stringify(obj)
      showToast('JSON 压缩成功')
    } else {
      showToast('JSON 格式无效，请检查输入', 'error')
    }
  } catch (e) {
    showToast(`压缩失败: ${e.message}`, 'error')
  }
}

const validateJsonOnly = async () => {
  if (!inputJson.value.trim()) {
    showToast('请先输入JSON数据', 'error')
    return
  }

  try {
    const isValid = validateJson(inputJson.value)
    if (isValid) {
      showToast('JSON 格式有效')
    } else {
      showToast('JSON 格式无效，请检查输入', 'error')
    }
  } catch (e) {
    showToast(`验证失败: ${e.message}`, 'error')
  }
}

const sortJson = async () => {
  if (!inputJson.value.trim()) {
    showToast('请先输入JSON数据', 'error')
    return
  }

  try {
    if (!validateJson(inputJson.value)) {
      showToast('JSON 格式无效，无法排序', 'error')
      return
    }

    const obj = JSON.parse(inputJson.value)
    const sortedObj = sortObjectKeys(obj)
    formattedJson.value = JSON.stringify(sortedObj, null, 2)
    showToast('JSON 已排序')
  } catch (e) {
    showToast(`排序失败: ${e.message}`, 'error')
  }
}

const sortObjectKeys = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item))
  }

  const sortedObj = {}
  Object.keys(obj).sort().forEach(key => {
    sortedObj[key] = sortObjectKeys(obj[key])
  })

  return sortedObj
}

const copyResult = async () => {
  if (!formattedJson.value) {
    showToast('没有可复制的内容', 'error')
    return
  }

  try {
    await navigator.clipboard.writeText(formattedJson.value)
    copySuccess.value = true
    showToast('已复制到剪贴板')

    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    showToast('复制失败', 'error')
  }
}

const clearInput = () => {
  inputJson.value = ''
  validationMessage.value = ''
  formattedJson.value = ''
  hasError.value = false
  errorLine.value = null
  showToast('输入已清空')
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputJson.value = text

    if (text.trim()) {
      const isValid = validateJson(text)
      if (isValid) {
        // 自动格式化
        try {
          const obj = JSON.parse(text)
          formattedJson.value = JSON.stringify(obj, null, 2)
          showToast('JSON 已自动格式化')
        } catch (e) {
          showToast('JSON 格式无效，请检查输入', 'error')
        }
      } else {
        showToast('JSON 格式无效，请检查输入', 'error')
      }
    }
  } catch (err) {
    showToast('无法从剪贴板读取内容', 'error')
  }
}

const downloadJson = () => {
  if (!formattedJson.value) {
    showToast('没有可下载的内容', 'error')
    return
  }

  const blob = new Blob([formattedJson.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `formatted_json_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('JSON 文件已下载')
}

const scrollToError = () => {
  if (errorLine.value && jsonTextarea.value) {
    const textarea = jsonTextarea.value
    const lines = inputJson.value.split('\n')
    let position = 0
    
    for (let i = 0; i < errorLine.value - 1; i++) {
      position += lines[i].length + 1 // +1 for newline
    }
    
    textarea.setSelectionRange(position, position)
    textarea.focus()
    
    // 滚动到错误位置
    const lineHeight = 20 // 估算的行高
    const scrollTop = (errorLine.value - 1) * lineHeight
    textarea.scrollTop = Math.max(0, scrollTop - textarea.clientHeight / 2)
  }
}

// 拖拽事件处理
const handleDragEnter = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

// 生命周期
onMounted(() => {
  // 添加全局拖拽事件监听
  document.addEventListener('dragenter', handleDragEnter)
  document.addEventListener('dragleave', handleDragLeave)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('dragenter', handleDragEnter)
  document.removeEventListener('dragleave', handleDragLeave)
  clearTimeout(debounceTimer)
})
</script>

<style scoped>
.formatter {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 110px);
  position: relative;
}

.formatter-header {
  display: none;
}

.formatter-actions {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  padding: 10px;
  background-color: transparent;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.main-btn {
  padding: 10px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  justify-content: center;
}

.main-btn:hover:not(.disabled) {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-btn:active:not(.disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.main-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.formatter-content {
  display: flex;
  flex: 1;
  padding: 0 20px 20px 20px;
  gap: 20px;
  background-color: transparent;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.input-panel,
.output-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  min-height: 500px;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.input-panel.drag-over {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  color: #202124;
  font-weight: 600;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 10px;
  background: #f1f3f4;
  color: #5f6368;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #e8eaed;
    color: #1a73e8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    font-size: 16px;
    transition: all 0.2s;
  }

  .mdi-check {
    color: #0f9d58;
  }
}

/* 编辑器容器 */
.editor-container {
  display: flex;
  flex: 1;
  position: relative;
  background: #fff;
}

.editor-container.with-line-numbers {
  background: #f8f9fa;
}

/* 行号样式 */
.line-numbers {
  display: flex;
  flex-direction: column;
  background: #f1f3f4;
  border-right: 1px solid #e0e0e0;
  padding: 16px 8px;
  min-width: 50px;
  user-select: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #666;
  text-align: right;
}

.line-number {
  height: 20px;
  line-height: 20px;
  padding: 0 4px;
  transition: all 0.2s;

  &.error-line {
    background: #fce8e6;
    color: #d93025;
    font-weight: bold;
  }
}

/* JSON 输入输出样式 */
.json-input {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  min-height: 450px;
  background: #fff;
  transition: all 0.3s;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(26, 115, 232, 0.2);
  }

  &.drag-over {
    background: rgba(26, 115, 232, 0.05);
  }

  &.error {
    border: 2px solid #d93025;
    box-shadow: inset 0 0 0 2px rgba(217, 48, 37, 0.1);
  }
}

.json-output {
  flex: 1;
  padding: 16px;
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  background: #fff;
  min-height: 450px;
  width: 100%;
  border: none;
  color: inherit; /* 确保颜色继承 */
}

.json-output.with-line-numbers {
  padding-left: 8px;
}

/* 确保语法高亮样式优先级最高 */
.json-output span[class*="json-"] {
  display: inline-block;
}

/* 验证消息 */
.validation-message {
  padding: 12px 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  background: #f8f9fa;
}

.text-success {
  color: #0f9d58;
}

.text-error {
  color: #d93025;
}

.error-location-btn {
  margin-left: auto;
  padding: 4px 8px;
  background: #fce8e6;
  color: #d93025;
  border: 1px solid #d93025;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    background: #d93025;
    color: #fff;
  }

  i {
    font-size: 14px;
  }
}

/* 统计信息 */
.json-stats,
.output-stats {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #5f6368;
}

.json-stats span,
.output-stats span {
  flex: 1;
  text-align: center;
}

/* Toast 样式 */
.toast-container {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 15px;
  min-width: 250px;

  &.success {
    background-color: #e6f4ea;
    color: #0f9d58;
    border-left: 4px solid #0f9d58;
  }

  &.error {
    background-color: #fce8e6;
    color: #d93025;
    border-left: 4px solid #d93025;
  }

  i {
    font-size: 20px;
  }
}

/* Toast 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 响应式设计 */
@media (max-width: 900px) {
  .formatter-content {
    flex-direction: column;
    padding: 0 10px 10px 10px;
  }

  .input-panel,
  .output-panel {
    min-height: 350px;
  }

  .json-input,
  .json-output {
    min-height: 300px;
  }

  .formatter-actions {
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .formatter-actions {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 15px;
  }

  .main-btn {
    width: 100%;
    justify-content: center;
    min-width: 100%;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .input-actions,
  .output-actions {
    width: 100%;
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .line-numbers {
    min-width: 40px;
    padding: 16px 4px;
    font-size: 11px;
  }

  .json-stats,
  .output-stats {
    flex-direction: column;
    gap: 4px;
  }

  .json-stats span,
  .output-stats span {
    text-align: left;
  }

  .validation-message {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .error-location-btn {
    margin-left: 0;
    align-self: flex-start;
  }
}

/* JSON 语法高亮 - 仅区分key和value */
.json-output .json-key {
  color: #d32f2f !important;
  font-weight: 600 !important;
}

.json-output .json-value {
  color: #2e7d32 !important;
  font-weight: 500 !important;
}

/* 深色主题的JSON语法高亮 */
@media (prefers-color-scheme: dark) {
  .json-output .json-string {
    color: #81c784 !important; /* 浅绿色 - 字符串 */
    background: rgba(129, 199, 132, 0.1) !important;
  }

  .json-output .json-number {
    color: #64b5f6 !important; /* 浅蓝色 - 数字 */
    background: rgba(100, 181, 246, 0.1) !important;
  }

  .json-output .json-boolean {
    color: #ba68c8 !important; /* 浅紫色 - 布尔值 */
    background: rgba(186, 104, 200, 0.15) !important;
  }

  .json-output .json-null {
    color: #a1887f !important; /* 浅棕色 - null值 */
    background: rgba(161, 136, 127, 0.1) !important;
  }

  .json-output .json-key {
    color: #ef5350 !important; /* 浅红色 - 键名 */
    background: rgba(239, 83, 80, 0.1) !important;
  }

  .json-output .json-punctuation {
    color: #bdbdbd !important; /* 浅灰色 - 标点符号 */
  }

  .json-output .json-bracket {
    color: #9e9e9e !important; /* 中灰色 - 括号 */
  }

  .json-output .json-comma {
    color: #757575 !important; /* 灰色 - 逗号 */
  }
}
</style>