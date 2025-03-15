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
              <h2 class="card-title">{{ $t('timestamp.input') }}</h2>
            </div>
            <div class="card-body">
              <!-- 时间戳输入 -->
              <div class="input-block">
                <div class="input-label">{{ $t('timestamp.result.timestamp') }}：</div>
                <div class="input-control">
                  <div class="timestamp-input-wrapper">
                    <input type="text" v-model="timestampInput" :placeholder="$t('timestamp.input')" @input="detectTimestampType"
                      class="text-input">
                    <div class="timestamp-actions">
                      <button class="action-button" @click="useCurrentTimestamp" :title="$t('timestamp.current')">
                        <i class="mdi mdi-clock-outline"></i>
                      </button>
                      <button class="action-button" @click="clearTimestamp" :title="$t('timestamp.clear')">
                        <i class="mdi mdi-close"></i>
                      </button>
                    </div>
                  </div>
                  <div class="timestamp-type-options-wrapper">
                    <div class="timestamp-type-options">
                      <label class="radio-option">
                        <input type="radio" v-model="timestampType" value="seconds" @change="handleTimestampTypeChange">
                        <span>{{ $t('timestamp.type.seconds') }}</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="timestampType" value="milliseconds" @change="handleTimestampTypeChange">
                        <span>{{ $t('timestamp.type.milliseconds') }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 日期时间输入区域 -->
              <div class="input-block">
                <div class="input-label">{{ $t('timestamp.inputSection.date') }}</div>
                <div class="datetime-input-wrapper">
                  <input type="number" v-model="dateComponents.year" :placeholder="$t('timestamp.inputSection.year')" @input="updateDateFromComponents" class="date-input year">
                  <span>-</span>
                  <input type="number" v-model="dateComponents.month" :placeholder="$t('timestamp.inputSection.month')" @input="updateDateFromComponents" class="date-input month">
                  <span>-</span>
                  <input type="number" v-model="dateComponents.day" :placeholder="$t('timestamp.inputSection.day')" @input="updateDateFromComponents" class="date-input day">
                  <span>|</span>
                  <input type="number" v-model="dateComponents.hour" :placeholder="$t('timestamp.inputSection.hour')" @input="updateDateFromComponents" class="date-input hour">
                  <span>:</span>
                  <input type="number" v-model="dateComponents.minute" :placeholder="$t('timestamp.inputSection.minute')" @input="updateDateFromComponents" class="date-input minute">
                  <span>:</span>
                  <input type="number" v-model="dateComponents.second" :placeholder="$t('timestamp.inputSection.second')" @input="updateDateFromComponents" class="date-input second">
                </div>
              </div>

              <!-- 时区选择部分的模板代码 -->
              <div class="input-block timezone-block">
                <div class="input-label">{{ $t('timestamp.inputSection.timezone') }}：</div>
                <select v-model="selectedTimezone" @change="updateTimezoneInfo" class="timezone-select">
                  <option value="Asia/Shanghai">{{ $t('timestamp.timezone.shanghai') }}</option>
                  <option value="Asia/Tokyo">{{ $t('timestamp.timezone.tokyo') }}</option>
                  <option value="Europe/London">{{ $t('timestamp.timezone.london') }}</option>
                  <option value="America/New_York">{{ $t('timestamp.timezone.newYork') }}</option>
                  <option value="Europe/Paris">{{ $t('timestamp.timezone.paris') }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧结果区域 -->
        <div class="result-section">
          <div class="section-card">
            <div class="card-header">
              <h2 class="card-title">{{ $t('timestamp.title') }}</h2>
            </div>
            <div class="card-body">
              <!-- 秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">{{ $t('timestamp.type.seconds') }}：</div>
                <div class="result-content">
                  <div class="result-text">{{ secondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(secondsTimestamp)" :title="$t('timestamp.copy')"
                    v-if="secondsTimestamp">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- 毫秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">{{ $t('timestamp.type.milliseconds') }}：</div>
                <div class="result-content">
                  <div class="result-text">{{ millisecondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(millisecondsTimestamp)" :title="$t('timestamp.copy')"
                    v-if="millisecondsTimestamp">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- 当前时区 -->
              <div class="result-block">
                <div class="result-label">当前时区：</div>
                <div class="result-content">
                  <div class="result-text">{{ currentTimezone }}</div>
                </div>
              </div>

              <!-- 格式化时间 -->
              <div class="result-block">
                <div class="result-label">格式化时间：</div>
                <div class="result-content">
                  <div class="result-text">{{ formattedDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(formattedDate)" title="复制" v-if="formattedDate">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- ISO 格式 -->
              <div class="result-block">
                <div class="result-label">ISO 格式：</div>
                <div class="result-content">
                  <div class="result-text">{{ isoDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(isoDate)" title="复制" v-if="isoDate">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- UTC 时间 -->
              <div class="result-block">
                <div class="result-label">UTC 时间：</div>
                <div class="result-content">
                  <div class="result-text">{{ utcDate || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(utcDate)" title="复制" v-if="utcDate">
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
    <div class="toast-container" v-if="toast.show">
      <div class="toast" :class="toast.type">
        <i class="mdi" :class="toast.icon"></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      timestampInput: '',
      timestampType: 'seconds',
      secondsTimestamp: '',
      millisecondsTimestamp: '',
      datetime: '',
      dateComponents: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
      },
      formattedDate: '',
      selectedTimezone: '',
      isoDate: '',
      utcDate: '',
      currentTimezone: '',
      toast: {
        show: false,
        message: '',
        type: 'success',
        icon: 'mdi-check-circle'
      }
    }
  },
  created() {
    // 设置默认时区为用户当前时区
    this.selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.updateTimezoneInfo()

    // 初始化为当前时间
    this.useCurrentTimestamp()
  },
  methods: {
    showToast(message, type = 'success') {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.toast.show = true;
      setTimeout(() => this.toast.show = false, 3000);
    },

    detectTimestampType() {
      if (!this.timestampInput) return;

      const timestamp = Number(this.timestampInput);
      if (isNaN(timestamp)) {
        this.showToast('请输入有效的数字时间戳', 'error');
        return;
      }

      this.timestampType = timestamp > 10000000000 ? 'milliseconds' : 'seconds';
      this.convertTimestamp();
    },

    handleTimestampTypeChange() {
      if (this.timestampInput) {
        this.convertTimestamp();
      }
    },

    convertTimestamp() {
      if (!this.timestampInput) return;

      const timestamp = Number(this.timestampInput);
      if (isNaN(timestamp)) {
        this.showToast('请输入有效的数字时间戳', 'error');
        return;
      }

      try {
        const date = new Date(this.timestampType === 'seconds' ? timestamp * 1000 : timestamp);
        this.secondsTimestamp = this.timestampType === 'seconds' ? timestamp : Math.floor(timestamp / 1000);
        this.millisecondsTimestamp = this.timestampType === 'seconds' ? timestamp * 1000 : timestamp;
        this.updateDateFormats(date);
        this.updateDateComponents(date);
      } catch (e) {
        this.showToast('时间戳转换失败，请检查输入', 'error');
      }
    },

    isDateComponentsValid() {
      return this.dateComponents.year && this.dateComponents.month && this.dateComponents.day;
    },

    updateDateFromComponents() {
      if (!this.isDateComponentsValid()) return;

      try {
        this.limitDateComponentValues();
        const date = new Date(
          this.dateComponents.year,
          this.dateComponents.month - 1,
          this.dateComponents.day,
          this.dateComponents.hour || 0,
          this.dateComponents.minute || 0,
          this.dateComponents.second || 0
        );
        this.updateDateFormats(date);
        this.datetime = date.toISOString().slice(0, 16);
        this.timestampInput = this.secondsTimestamp;
      } catch (e) {
        this.showToast('日期无效，请检查输入', 'error');
      }
    },

    limitDateComponentValues() {
      const limits = {
        year: [1970, 2100],
        month: [1, 12],
        day: [1, 31],
        hour: [0, 23],
        minute: [0, 59],
        second: [0, 59]
      };

      Object.entries(limits).forEach(([key, [min, max]]) => {
        if (this.dateComponents[key]) {
          this.dateComponents[key] = Math.min(Math.max(parseInt(this.dateComponents[key]), min), max);
        }
      });
    },

    updateDateComponents(date) {
      this.dateComponents = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
    },

    updateTimezoneInfo() {
      const date = new Date();
      this.currentTimezone = new Intl.DateTimeFormat('zh-CN', { timeZoneName: 'long' })
        .formatToParts(date)
        .find(part => part.type === 'timeZoneName').value;
    },

    updateDateFormats(date) {
      this.secondsTimestamp = Math.floor(date.getTime() / 1000);
      this.millisecondsTimestamp = date.getTime();
      this.datetime = date.toISOString().slice(0, 16);
      this.formattedDate = date.toLocaleString('zh-CN', {
        timeZone: this.selectedTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      this.isoDate = date.toISOString();
      this.utcDate = date.toUTCString();
    },

    useCurrentTimestamp() {
      const now = Date.now();
      this.timestampInput = this.timestampType === 'seconds' ? Math.floor(now / 1000).toString() : now.toString();
      this.detectTimestampType();
    },

    clearTimestamp() {
      this.timestampInput = '';
      this.secondsTimestamp = '';
      this.millisecondsTimestamp = '';
      this.formattedDate = '';
      this.isoDate = '';
      this.utcDate = '';
      // 清空日期时间输入框
      this.dateComponents = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
      };
      this.datetime = '';
    },

    async copyToClipboard(text) {
      if (!text) {
        this.showToast('没有可复制的内容', 'error');
        return;
      }

      try {
        await navigator.clipboard.writeText(text.toString());
        this.showToast('已复制到剪贴板');
      } catch (err) {
        this.showToast('复制失败', 'error');
      }
    }
  }
}
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
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.card-header {
  padding: 10px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.card-body {
  padding: 20px;
}

/* 输入块样式 */
.input-block {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.input-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.input-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #409eff;
    outline: none;
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
  width: 32px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f5f7fa;
  border-color: #c6e2ff;
  color: #409EFF;
}

.action-button:active {
  border-color: #409EFF;
  color: #409EFF;
  outline: none;
}

.action-button i {
  font-size: 16px;
}

.action-button:last-child:hover {
  border-color: #fbc4c4;
  color: #F56C6C;
}

.action-button:last-child:active {
  border-color: #F56C6C;
}

/* 时间戳类型选项样式 */
.timestamp-type-options-wrapper {
  margin-top: 8px;
}

.timestamp-type-options {
  display: flex;
  gap: 16px;
  flex-direction: row;
  align-items: center;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  margin-bottom: 4px;

  input[type="radio"] {
    margin: 0;
  }

  span {
    font-size: 14px;
    color: #606266;
  }
}

/* 日期输入样式 */
.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  transition: all 0.3s;
}

.date-group,
.time-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.datetime-separator {
  color: #909399;
  font-weight: 500;
  margin: 0 12px;
  user-select: none;
}

.date-input {
  width: 40px;
  padding: 4px;
  border: none;
  font-size: 14px;
  text-align: center;
  -moz-appearance: textfield;
  color: #333;
  transition: all 0.3s;
  background: transparent;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
  }

  &.year {
    width: 60px;
  }
}

.date-separator {
  color: #666;
  font-size: 14px;
  user-select: none;
}

/* 结果块样式 */
.result-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #eee;

  &:last-child {
    margin-bottom: 0;
  }
}

.result-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 6px;
  font-weight: 500;
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
}

/* 复制按钮样式 */
.copy-button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 8px;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #1a73e8;
  }
}

/* 提示框样式 */
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  min-width: 200px;
  animation: slideUp 0.3s ease-out forwards;

  &.success {
    background-color: #e6f4ea;
    color: #0f9d58;
    border-left: 3px solid #0f9d58;
  }

  &.error {
    background-color: #fce8e6;
    color: #d93025;
    border-left: 3px solid #d93025;
  }

  i {
    font-size: 18px;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .converter-area {
    flex-direction: column;
  }

  .input-section,
  .result-section {
    width: 100%;
  }

  .date-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .date-group,
  .time-group {
    justify-content: space-between;
  }

  .date-input {
    flex: 1;
    max-width: 80px;
  }
}

.select-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606266' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.select-input:hover {
  border-color: #c0c4cc;
}

.select-input:focus {
  outline: none;
  border-color: #409eff;
}

.select-input option {
  padding: 8px;
  font-size: 14px;
}

/* 时区选择器样式 */
.timezone-block {
  position: relative;
}

.timezone-select {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  color: #333;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23606266'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}

.timezone-select:hover {
  border-color: #409eff;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.1);
}

.timezone-select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.timezone-select option {
  padding: 12px;
  font-size: 14px;
  background-color: #fff;
  color: #333;
}

.timezone-select option:hover {
  background-color: #f5f7fa;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .timezone-select {
    padding: 12px 14px;
    font-size: 15px;
  }
}
</style>