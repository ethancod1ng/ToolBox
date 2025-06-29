<template>
  <div class="timestamp-container">
    <!-- 主内容区域 -->
    <div class="content-wrapper">
      <!-- 转换区域 -->
      <div class="converter-area">
        <!-- 左侧输入区域 -->
        <div class="input-section">
          <div class="section-card">
            <div class="card-header">
              <h2 class="card-title">{{ t('timestamp.title') }}</h2>
            </div>
            <div class="card-body">
              <!-- 时间戳输入 -->
              <div class="input-block">
                <div class="input-label">{{ t('timestamp.labels.timestampInput') }}</div>
                <div class="input-control">
                  <div class="timestamp-input-wrapper">
                    <input 
                      type="text" 
                      v-model="timestampInput" 
                      :placeholder="t('timestamp.placeholders.timestamp')" 
                      @input="detectTimestampType"
                      class="text-input"
                      :class="{ 'error': timestampError }"
                    >
                    <div class="timestamp-actions">
                      <button class="action-button" @click="useCurrentTimestamp" :title="t('timestamp.actions.useCurrentTime')">
                        <i class="mdi mdi-clock-outline"></i>
                      </button>
                      <button class="action-button" @click="clearTimestamp" :title="t('timestamp.actions.clearTimestamp')">
                        <i class="mdi mdi-close"></i>
                      </button>
                    </div>
                  </div>
                  <div class="timestamp-type-options-wrapper">
                    <div class="timestamp-type-options">
                      <label class="radio-option">
                        <input type="radio" v-model="timestampType" value="seconds" @change="handleTimestampTypeChange">
                        <span>{{ t('timestamp.types.seconds') }}</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="timestampType" value="milliseconds" @change="handleTimestampTypeChange">
                        <span>{{ t('timestamp.types.milliseconds') }}</span>
                      </label>
                    </div>
                  </div>
                  <div v-if="timestampError" class="error-message">
                    {{ timestampError }}
                  </div>
                </div>
              </div>

              <!-- 日期时间输入区域 -->
              <div class="input-block">
                <div class="input-label">{{ t('timestamp.labels.datetimeInput') }}</div>
                <div class="datetime-input-container">
                  <!-- 日期选择器 -->
                  <div class="date-picker-section">
                    <div class="date-inputs">
                      <div class="date-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.year" 
                          :placeholder="t('timestamp.placeholders.year')" 
                          @input="updateDateFromComponents"
                          class="date-input year"
                          :class="{ 'error': dateErrors.year }"
                          min="1970"
                          max="2100"
                        >
                        <span class="date-separator">{{ t('timestamp.inputSection.year') }}</span>
                      </div>
                      <div class="date-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.month" 
                          :placeholder="t('timestamp.placeholders.month')" 
                          @input="updateDateFromComponents"
                          class="date-input month"
                          :class="{ 'error': dateErrors.month }"
                          min="1"
                          max="12"
                        >
                        <span class="date-separator">{{ t('timestamp.inputSection.month') }}</span>
                      </div>
                      <div class="date-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.day" 
                          :placeholder="t('timestamp.placeholders.day')" 
                          @input="updateDateFromComponents"
                          class="date-input day"
                          :class="{ 'error': dateErrors.day }"
                          min="1"
                          max="31"
                        >
                        <span class="date-separator">{{ t('timestamp.inputSection.day') }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 时间选择器 -->
                  <div class="time-picker-section">
                    <div class="time-inputs">
                      <div class="time-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.hour" 
                          :placeholder="t('timestamp.placeholders.hour')" 
                          @input="updateDateFromComponents"
                          class="time-input hour"
                          :class="{ 'error': dateErrors.hour }"
                          min="0"
                          max="23"
                        >
                        <span class="time-separator">:</span>
                      </div>
                      <div class="time-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.minute" 
                          :placeholder="t('timestamp.placeholders.minute')" 
                          @input="updateDateFromComponents"
                          class="time-input minute"
                          :class="{ 'error': dateErrors.minute }"
                          min="0"
                          max="59"
                        >
                        <span class="time-separator">:</span>
                      </div>
                      <div class="time-input-group">
                        <input 
                          type="number" 
                          v-model="dateComponents.second" 
                          :placeholder="t('timestamp.placeholders.second')" 
                          @input="updateDateFromComponents"
                          class="time-input second"
                          :class="{ 'error': dateErrors.second }"
                          min="0"
                          max="59"
                        >
                      </div>
                    </div>
                  </div>

                  <!-- 快速操作按钮 -->
                  <div class="quick-actions">
                    <button class="quick-btn" @click="setToNow" :title="t('timestamp.actions.setToNow')">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ t('timestamp.actions.setToNow') }}
                    </button>
                    <button class="quick-btn" @click="setToToday" :title="t('timestamp.actions.setToToday')">
                      <i class="mdi mdi-calendar-today"></i>
                      {{ t('timestamp.actions.setToToday') }}
                    </button>
                    <button class="quick-btn" @click="clearDateTime" :title="t('timestamp.actions.clearDateTime')">
                      <i class="mdi mdi-close"></i>
                      {{ t('timestamp.actions.clearDateTime') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 时区选择 -->
              <div class="input-block timezone-block">
                <div class="input-label">{{ t('timestamp.labels.timezoneSelect') }}</div>
                <select v-model="selectedTimezone" @change="updateTimezoneInfo" class="timezone-select">
                  <option value="Asia/Shanghai">{{ t('timestamp.timezones.Asia/Shanghai') }}</option>
                  <option value="Asia/Tokyo">{{ t('timestamp.timezones.Asia/Tokyo') }}</option>
                  <option value="Europe/London">{{ t('timestamp.timezones.Europe/London') }}</option>
                  <option value="America/New_York">{{ t('timestamp.timezones.America/New_York') }}</option>
                  <option value="Europe/Paris">{{ t('timestamp.timezones.Europe/Paris') }}</option>
                  <option value="UTC">{{ t('timestamp.timezones.UTC') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧结果区域 -->
        <div class="result-section">
          <div class="section-card">
            <div class="card-header">
              <h2 class="card-title">{{ t('timestamp.result.title') }}</h2>
            </div>
            <div class="card-body">
              <!-- 秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.secondsResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ secondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(secondsTimestamp)" :title="t('timestamp.copy')"
                    v-if="secondsTimestamp">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- 毫秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.millisecondsResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ millisecondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(millisecondsTimestamp)" :title="t('timestamp.copy')"
                    v-if="millisecondsTimestamp">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- 当前时区 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.currentTimezoneResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ currentTimezone }}</div>
                </div>
              </div>

              <!-- 格式化时间 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.formattedResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ formattedDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(formattedDate)" :title="t('timestamp.copy')" v-if="formattedDate">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- ISO 格式 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.isoResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ isoDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(isoDate)" :title="t('timestamp.copy')" v-if="isoDate">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- UTC 时间 -->
              <div class="result-block">
                <div class="result-label">{{ t('timestamp.labels.utcResult') }}</div>
                <div class="result-content">
                  <div class="result-text">{{ utcDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(utcDate)" :title="t('timestamp.copy')" v-if="utcDate">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示框 -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// 国际化
const { t, locale } = useI18n()

// 响应式数据
const timestampInput = ref('')
const timestampType = ref('seconds')
const secondsTimestamp = ref('')
const millisecondsTimestamp = ref('')
const datetime = ref('')
const selectedTimezone = ref('')
const currentTimezone = ref('')
const formattedDate = ref('')
const isoDate = ref('')
const utcDate = ref('')

// 日期组件
const dateComponents = ref({
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',
  second: ''
})

// 错误状态
const timestampError = ref('')
const dateErrors = ref({
  year: false,
  month: false,
  day: false,
  hour: false,
  minute: false,
  second: false
})

// Toast 状态
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  icon: 'mdi-check-circle'
})

// 防抖定时器
let debounceTimer = null

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

// 时间戳处理函数
const detectTimestampType = debounce(() => {
  if (!timestampInput.value) {
    timestampError.value = ''
    return
  }

  const timestamp = Number(timestampInput.value)
  if (isNaN(timestamp)) {
    timestampError.value = t('timestamp.errors.invalidTimestamp')
    return
  }

  timestampError.value = ''
  timestampType.value = timestamp > 10000000000 ? 'milliseconds' : 'seconds'
  convertTimestamp()
}, 300)

const handleTimestampTypeChange = () => {
  if (timestampInput.value) {
    convertTimestamp()
  }
}

const convertTimestamp = () => {
  if (!timestampInput.value) return

  const timestamp = Number(timestampInput.value)
  if (isNaN(timestamp)) {
    showToast(t('timestamp.errors.invalidTimestamp'), 'error')
    return
  }

  try {
    const date = new Date(timestampType.value === 'seconds' ? timestamp * 1000 : timestamp)
    if (isNaN(date.getTime())) {
      throw new Error('无效的时间戳')
    }

    secondsTimestamp.value = timestampType.value === 'seconds' ? timestamp : Math.floor(timestamp / 1000)
    millisecondsTimestamp.value = timestampType.value === 'seconds' ? timestamp * 1000 : timestamp
    updateDateFormats(date)
    updateDateComponents(date)
  } catch (e) {
    showToast(t('timestamp.errors.timestampConvertFailed'), 'error')
  }
}

// 日期组件处理函数
const validateDateComponent = (key, value) => {
  const limits = {
    year: [1970, 2100],
    month: [1, 12],
    day: [1, 31],
    hour: [0, 23],
    minute: [0, 59],
    second: [0, 59]
  }

  if (!value) {
    dateErrors.value[key] = false
    return true
  }

  const numValue = parseInt(value)
  const [min, max] = limits[key]
  
  if (isNaN(numValue) || numValue < min || numValue > max) {
    dateErrors.value[key] = true
    return false
  }

  // 特殊验证：月份天数
  if (key === 'day' && dateComponents.value.year && dateComponents.value.month) {
    const year = parseInt(dateComponents.value.year)
    const month = parseInt(dateComponents.value.month)
    const maxDays = new Date(year, month, 0).getDate()
    if (numValue > maxDays) {
      dateErrors.value[key] = true
      return false
    }
  }

  dateErrors.value[key] = false
  return true
}

const updateDateFromComponents = debounce(() => {
  // 验证所有日期组件
  const isValid = Object.keys(dateComponents.value).every(key => 
    validateDateComponent(key, dateComponents.value[key])
  )

  if (!isValid) return

  // 检查是否有足够的日期信息
  if (!dateComponents.value.year || !dateComponents.value.month || !dateComponents.value.day) {
    return
  }

  try {
    const date = new Date(
      parseInt(dateComponents.value.year),
      parseInt(dateComponents.value.month) - 1,
      parseInt(dateComponents.value.day),
      parseInt(dateComponents.value.hour) || 0,
      parseInt(dateComponents.value.minute) || 0,
      parseInt(dateComponents.value.second) || 0
    )

    if (isNaN(date.getTime())) {
      throw new Error('无效的日期')
    }

    updateDateFormats(date)
    timestampInput.value = secondsTimestamp.value.toString()
  } catch (e) {
    showToast(t('timestamp.errors.dateInvalid'), 'error')
  }
}, 300)

const updateDateComponents = (date) => {
  dateComponents.value = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  }
}

// 时区处理函数
const updateTimezoneInfo = () => {
  const date = new Date()
  try {
    // 根据当前语言环境动态设置时区名称显示
    const currentLocale = locale.value || 'zh-CN'
    currentTimezone.value = new Intl.DateTimeFormat(currentLocale, { 
      timeZone: selectedTimezone.value,
      timeZoneName: 'long' 
    }).formatToParts(date).find(part => part.type === 'timeZoneName')?.value || selectedTimezone.value
  } catch (e) {
    currentTimezone.value = selectedTimezone.value
  }
}

const updateDateFormats = (date) => {
  secondsTimestamp.value = Math.floor(date.getTime() / 1000)
  millisecondsTimestamp.value = date.getTime()
  datetime.value = date.toISOString().slice(0, 16)
  
  try {
    const currentLocale = locale.value || 'zh-CN'
    formattedDate.value = date.toLocaleString(currentLocale, {
      timeZone: selectedTimezone.value,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  } catch (e) {
    const currentLocale = locale.value || 'zh-CN'
    formattedDate.value = date.toLocaleString(currentLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  
  isoDate.value = date.toISOString()
  utcDate.value = date.toUTCString()
}

// 快捷操作函数
const useCurrentTimestamp = () => {
  const now = Date.now()
  timestampInput.value = timestampType.value === 'seconds' ? Math.floor(now / 1000).toString() : now.toString()
  detectTimestampType()
}

const setToNow = () => {
  const now = new Date()
  updateDateComponents(now)
  updateDateFromComponents()
}

const setToToday = () => {
  const today = new Date()
  dateComponents.value = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: 0,
    minute: 0,
    second: 0
  }
  updateDateFromComponents()
}

const clearTimestamp = () => {
  timestampInput.value = ''
  secondsTimestamp.value = ''
  millisecondsTimestamp.value = ''
  formattedDate.value = ''
  isoDate.value = ''
  utcDate.value = ''
  timestampError.value = ''
}

const clearDateTime = () => {
  dateComponents.value = {
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: ''
  }
  Object.keys(dateErrors.value).forEach(key => {
    dateErrors.value[key] = false
  })
}

const copyToClipboard = async (text) => {
  if (!text) {
    showToast(t('timestamp.noContent'), 'error')
    return
  }

  try {
    await navigator.clipboard.writeText(text.toString())
    showToast(t('timestamp.copySuccess'))
  } catch (err) {
    showToast(t('timestamp.copyFailed'), 'error')
  }
}

// 监听器
watch(dateComponents, () => {
  // 自动验证日期组件
  Object.keys(dateComponents.value).forEach(key => {
    validateDateComponent(key, dateComponents.value[key])
  })
}, { deep: true })

// 监听语言变化，更新时区显示
watch(locale, () => {
  updateTimezoneInfo()
  // 如果有日期数据，重新格式化
  if (secondsTimestamp.value || millisecondsTimestamp.value) {
    const currentDate = secondsTimestamp.value 
      ? new Date(secondsTimestamp.value * 1000)
      : new Date(millisecondsTimestamp.value)
    updateDateFormats(currentDate)
  }
})

// 生命周期
onMounted(() => {
  // 设置默认时区
  selectedTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  updateTimezoneInfo()
  
  // 初始化为当前时间
  useCurrentTimestamp()
})
</script>

<style scoped>
/* 主容器样式 */
.timestamp-container {
  width: 100%;
  min-height: calc(100vh - 110px);
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 内容包装器 */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 转换区域 */
.converter-area {
  display: flex;
  gap: 20px;
}

/* 左侧输入区域和右侧结果区域共享样式 */
.input-section,
.result-section {
  flex: 1;
}

/* 卡片样式 */
.section-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.card-header {
  padding: 16px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* 输入块样式 */
.input-block {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.input-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
  font-weight: 500;
}

.input-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 时间戳输入样式 */
.timestamp-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.text-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  background: #fff;

  &:focus {
    border-color: #1a73e8;
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  &.error {
    border-color: #d93025;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
  }
}

.timestamp-actions {
  display: flex;
  gap: 4px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background-color: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f8f9fa;
    border-color: #1a73e8;
    color: #1a73e8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 18px;
  }
}

/* 时间戳类型选项样式 */
.timestamp-type-options-wrapper {
  margin-top: 8px;
}

.timestamp-type-options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background-color: #f8f9fa;
  }

  input[type="radio"] {
    margin: 0;
    width: 16px;
    height: 16px;
    accent-color: #1a73e8;
  }

  span {
    font-size: 14px;
    color: #555;
    font-weight: 500;
  }
}

/* 日期时间输入容器 */
.datetime-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 日期选择器样式 */
.date-picker-section,
.time-picker-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 2px solid transparent;
  transition: all 0.3s;

  &:hover {
    border-color: #e1e5e9;
  }
}

.date-inputs,
.time-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.date-input-group,
.time-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-input,
.time-input {
  width: 60px;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  background: #fff;
  transition: all 0.3s;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  &.error {
    border-color: #d93025;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
  }

  &.year {
    width: 80px;
  }

  &.month,
  &.day {
    width: 60px;
  }

  &.hour,
  &.minute,
  &.second {
    width: 50px;
  }
}

.date-separator,
.time-separator {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  min-width: 20px;
  text-align: center;
}

/* 快速操作按钮 */
.quick-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background: #fff;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: #f8f9fa;
    border-color: #1a73e8;
    color: #1a73e8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 16px;
  }
}

/* 错误消息 */
.error-message {
  color: #d93025;
  font-size: 13px;
  margin-top: 4px;
  padding: 8px 12px;
  background: #fce8e6;
  border-radius: 4px;
  border-left: 3px solid #d93025;
}

/* 时区选择器样式 */
.timezone-block {
  position: relative;
}

.timezone-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;

  &:hover {
    border-color: #1a73e8;
    box-shadow: 0 2px 6px rgba(26, 115, 232, 0.1);
  }

  &:focus {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  option {
    padding: 12px;
    font-size: 14px;
    background-color: #fff;
    color: #333;
  }
}

/* 结果块样式 */
.result-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  transition: all 0.3s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: #f1f3f4;
    border-color: #dadce0;
  }
}

.result-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: 600;
}

.result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-text {
  font-size: 14px;
  color: #333;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', monospace;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e1e5e9;
  flex: 1;
  margin-right: 8px;
}

/* 复制按钮样式 */
.copy-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover {
    background-color: #f8f9fa;
    border-color: #1a73e8;
    color: #1a73e8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 16px;
  }
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
  .converter-area {
    flex-direction: column;
  }

  .input-section,
  .result-section {
    width: 100%;
  }

  .date-inputs,
  .time-inputs {
    flex-direction: column;
    gap: 16px;
  }

  .date-input-group,
  .time-input-group {
    justify-content: center;
  }

  .quick-actions {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .content-wrapper {
    padding: 10px;
  }

  .card-body {
    padding: 16px;
  }

  .timestamp-input-wrapper {
    flex-direction: column;
    gap: 12px;
  }

  .timestamp-actions {
    justify-content: center;
  }

  .date-input,
  .time-input {
    width: 50px;
    
    &.year {
      width: 70px;
    }
  }

  .quick-actions {
    flex-direction: column;
    align-items: center;
  }

  .quick-btn {
    width: 100%;
    justify-content: center;
  }

  .result-content {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .result-text {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .copy-button {
    align-self: flex-end;
  }
}
</style>