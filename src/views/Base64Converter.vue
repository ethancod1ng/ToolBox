<template>
  <div class="converter">
    <div class="converter-header">
      <h1>{{ t('base64.title') }}</h1>
      <p>{{ t('base64.subtitle') }}</p>
    </div>

    <div class="converter-actions">
      <button 
        class="main-btn" 
        @click="encode"
        :disabled="isProcessing || !input.trim()"
        :class="{ 'disabled': isProcessing || !input.trim() }"
      >
        <i class="mdi mdi-arrow-down-bold-box-outline"></i> 
        {{ isProcessing ? t('base64.actions.processing') : t('base64.actions.encode') }}
      </button>
      <button 
        class="main-btn" 
        @click="decode"
        :disabled="isProcessing || !input.trim()"
        :class="{ 'disabled': isProcessing || !input.trim() }"
      >
        <i class="mdi mdi-arrow-up-bold-box-outline"></i> 
        {{ isProcessing ? t('base64.actions.processing') : t('base64.actions.decode') }}
      </button>
      <button class="main-btn" @click="clearAll">
        <i class="mdi mdi-delete-outline"></i> {{ t('base64.actions.clear') }}
      </button>
      <button 
        class="main-btn" 
        @click="swapTexts"
        :disabled="!input.trim() && !output.trim()"
        :class="{ 'disabled': !input.trim() && !output.trim() }"
      >
        <i class="mdi mdi-swap-vertical"></i> {{ t('base64.actions.swap') }}
      </button>
    </div>

    <div class="converter-content">
      <div 
        class="input-panel"
        @drop="handleFileDrop"
        @dragover.prevent
        @dragenter.prevent
        @dragleave.prevent
      >
        <div class="panel-header">
          <h3>{{ t('base64.labels.input') }}</h3>
          <div class="input-actions">
            <button class="action-btn" @click="clearInput" :title="t('base64.actions.clear')">
              <i class="mdi mdi-delete-outline"></i>
              <span>{{ t('base64.actions.clear') }}</span>
            </button>
            <button class="action-btn" @click="pasteFromClipboard" :title="t('base64.actions.paste')">
              <i class="mdi mdi-clipboard-text-outline"></i>
              <span>{{ t('base64.actions.paste') }}</span>
            </button>
            <button class="action-btn" @click="selectFile" :title="t('base64.actions.file')">
              <i class="mdi mdi-file-upload-outline"></i>
              <span>{{ t('base64.actions.file') }}</span>
            </button>
            <input 
              ref="fileInput" 
              type="file" 
              @change="handleFileSelect" 
              style="display: none"
              accept=".txt,.json,.xml,.html,.css,.js,.md"
            />
          </div>
        </div>
        <textarea 
          v-model="input" 
          :placeholder="t('base64.placeholders.input')" 
          class="text-input"
          @input="handleInputChange"
          :class="{ 'drag-over': isDragOver }"
        ></textarea>
        <div v-if="inputStats" class="input-stats">
          <span>{{ t('base64.stats.characters') }}: {{ inputStats.charCount }}</span>
          <span>{{ t('base64.stats.bytes') }}: {{ inputStats.byteCount }}</span>
          <span>{{ t('base64.stats.lines') }}: {{ inputStats.lineCount }}</span>
        </div>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <h3>{{ t('base64.labels.output') }}</h3>
          <div class="output-actions">
            <button 
              class="action-btn" 
              @click="downloadResult" 
              :title="t('base64.actions.download')"
              :disabled="!output.trim()"
            >
              <i class="mdi mdi-download-outline"></i>
              <span>{{ t('base64.actions.download') }}</span>
            </button>
            <button 
              class="action-btn" 
              @click="copyResult" 
              :title="t('base64.actions.copy')"
              :disabled="!output.trim()"
            >
              <i class="mdi" :class="copySuccess ? 'mdi-check' : 'mdi-content-copy'"></i>
              <span>{{ copySuccess ? t('base64.actions.copied') : t('base64.actions.copy') }}</span>
            </button>
          </div>
        </div>
        <textarea v-model="output" readonly class="text-output"></textarea>
        <div v-if="outputStats" class="output-stats">
          <span>{{ t('base64.stats.characters') }}: {{ outputStats.charCount }}</span>
          <span>{{ t('base64.stats.bytes') }}: {{ outputStats.byteCount }}</span>
          <span>{{ t('base64.stats.lines') }}: {{ outputStats.lineCount }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 国际化
const { t } = useI18n()

// 响应式数据
const input = ref('')
const output = ref('')
const copySuccess = ref(false)
const isProcessing = ref(false)
const isDragOver = ref(false)
const fileInput = ref(null)

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
const inputStats = computed(() => {
  if (!input.value) return null
  return {
    charCount: input.value.length,
    byteCount: new Blob([input.value]).size,
    lineCount: input.value.split('\n').length
  }
})

const outputStats = computed(() => {
  if (!output.value) return null
  return {
    charCount: output.value.length,
    byteCount: new Blob([output.value]).size,
    lineCount: output.value.split('\n').length
  }
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


// Base64 编码/解码函数
const encodeBase64 = (str) => {
  try {
    // 处理 Unicode 字符
    return btoa(unescape(encodeURIComponent(str)))
  } catch (e) {
    throw new Error('编码失败：输入包含无效字符')
  }
}

const decodeBase64 = (str) => {
  try {
    // 处理 Unicode 字符
    return decodeURIComponent(escape(atob(str)))
  } catch (e) {
    throw new Error('解码失败：输入不是有效的 Base64 字符串')
  }
}

// 文件处理函数
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    readFile(file)
  }
  // 清空 input 值，允许重复选择同一文件
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
    showToast(t('base64.messages.fileSizeError'), 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    input.value = e.target.result
    showToast(`${t('base64.messages.fileLoaded')}: ${file.name}`)
  }
  reader.onerror = () => {
    showToast(t('base64.messages.fileReadError'), 'error')
  }
  reader.readAsText(file)
}

// 主要功能函数
const encode = async () => {
  if (!input.value.trim()) {
    showToast(t('base64.messages.inputRequired'), 'error')
    return
  }
  // 直接处理，无需loading
  try {
    output.value = encodeBase64(input.value)
    showToast(t('base64.messages.encodeSuccess'))
  } catch (e) {
    showToast(t('base64.messages.encodeError'), 'error')
  }
}

const decode = async () => {
  if (!input.value.trim()) {
    showToast(t('base64.messages.decodeInputRequired'), 'error')
    return
  }
  // 直接处理，无需loading
  try {
    output.value = decodeBase64(input.value)
    showToast(t('base64.messages.decodeSuccess'))
  } catch (e) {
    showToast(t('base64.messages.decodeError'), 'error')
  }
}

const copyResult = async () => {
  if (!output.value) {
    showToast(t('base64.messages.noCopyContent'), 'error')
    return
  }

  try {
    await navigator.clipboard.writeText(output.value)
    copySuccess.value = true
    showToast(t('base64.messages.copySuccess'))

    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (e) {
    showToast(t('base64.messages.copyError'), 'error')
  }
}

const clearInput = () => {
  input.value = ''
  showToast(t('base64.messages.clearSuccess'))
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  showToast(t('base64.messages.clearAllSuccess'))
}

const swapTexts = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
  if (input.value && output.value) {
    showToast(t('base64.messages.swapSuccess'))
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
    showToast(t('base64.messages.pasteSuccess'))
  } catch (err) {
    showToast(t('base64.messages.pasteError'), 'error')
  }
}

const downloadResult = () => {
  if (!output.value) {
    showToast(t('base64.messages.downloadError'), 'error')
    return
  }

  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `base64_result_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast(t('base64.messages.downloadSuccess'))
}

// 输入变化处理（防抖）
const handleInputChange = debounce(() => {
  // 可以在这里添加实时预览或其他功能
}, 300)

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
.converter {
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

.converter-header {
  display: none;
}

.converter-actions {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  padding: 15px 0;
  background-color: transparent;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px 15px 20px;
}

.main-btn {
  padding: 10px 16px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
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

.converter-content {
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
  border-radius: 4px;
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
  padding: 10px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  color: #202124;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 10px;
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
}

.action-btn:hover:not(:disabled) {
  background: #e8eaed;
  color: #1a73e8;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn i {
  font-size: 16px;
  transition: all 0.2s;
}

.action-btn .mdi-check {
  color: #0f9d58;
}

.text-input,
.text-output {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  min-height: 450px;
  transition: all 0.3s;
}

.text-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.text-input.drag-over {
  background: rgba(26, 115, 232, 0.05);
}

.text-output {
  background: #fff;
}

.input-stats,
.output-stats {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #5f6368;
}

.input-stats span,
.output-stats span {
  flex: 1;
  text-align: center;
}

/* 自定义提示框样式 */
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
}

.toast.success {
  background-color: #e6f4ea;
  color: #0f9d58;
  border-left: 4px solid #0f9d58;
}

.toast.error {
  background-color: #fce8e6;
  color: #d93025;
  border-left: 4px solid #d93025;
}

.toast i {
  font-size: 20px;
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
  .converter-content {
    flex-direction: column;
    padding: 0 10px 10px 10px;
  }

  .input-panel,
  .output-panel {
    min-height: 350px;
  }

  .text-input,
  .text-output {
    min-height: 300px;
  }

  .converter-actions {
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .converter-actions {
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

  .input-stats,
  .output-stats {
    flex-direction: column;
    gap: 4px;
  }

  .input-stats span,
  .output-stats span {
    text-align: left;
  }
}
</style>