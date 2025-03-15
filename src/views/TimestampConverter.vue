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
              <h2 class="card-title">输入</h2>
            </div>
            <div class="card-body">
              <!-- 时间戳输入 -->
              <div class="input-block">
                <div class="input-label">时间戳：</div>
                <div class="input-control">
                  <input type="text" v-model="timestampInput" placeholder="请输入秒级或毫秒级时间戳" @input="detectTimestampType"
                    class="text-input">
                  <div class="radio-options">
                    <label class="radio-option">
                      <input type="radio" v-model="timestampType" value="seconds" @change="handleTimestampTypeChange">
                      <span>秒级</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="timestampType" value="milliseconds"
                        @change="handleTimestampTypeChange">
                      <span>毫秒级</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 日期时间输入 -->
              <div class="input-block">
                <div class="input-label">日期时间：</div>
                <div class="input-control">
                  <div class="date-inputs">
                    <div class="date-group">
                      <input type="number" v-model="dateComponents.year" placeholder="年" min="1970" max="2100"
                        @change="updateDateFromComponents" class="date-input year">
                      <span class="date-separator">-</span>
                      <input type="number" v-model="dateComponents.month" placeholder="月" min="1" max="12"
                        @change="updateDateFromComponents" class="date-input month">
                      <span class="date-separator">-</span>
                      <input type="number" v-model="dateComponents.day" placeholder="日" min="1" max="31"
                        @change="updateDateFromComponents" class="date-input day">
                    </div>
                    <div class="time-group">
                      <input type="number" v-model="dateComponents.hour" placeholder="时" min="0" max="23"
                        @change="updateDateFromComponents" class="date-input hour">
                      <span class="date-separator">:</span>
                      <input type="number" v-model="dateComponents.minute" placeholder="分" min="0" max="59"
                        @change="updateDateFromComponents" class="date-input minute">
                      <span class="date-separator">:</span>
                      <input type="number" v-model="dateComponents.second" placeholder="秒" min="0" max="59"
                        @change="updateDateFromComponents" class="date-input second">
                    </div>
                  </div>
                </div>
              </div>

              <!-- 日期选择器 -->
              <div class="input-block">
                <div class="input-label">日期选择器：</div>
                <div class="input-control">
                  <input type="datetime-local" v-model="datetime" @input="dateToTimestamp" class="datetime-input">
                </div>
              </div>

              <!-- 时区选择 -->
              <div class="input-block">
                <div class="input-label">时区：</div>
                <div class="input-control">
                  <select v-model="selectedTimezone" @change="updateTime" class="select-input">
                    <option value="Asia/Shanghai">上海 (UTC+8)</option>
                    <option value="Asia/Tokyo">东京 (UTC+9)</option>
                    <option value="Europe/London">伦敦 (UTC+0)</option>
                    <option value="America/New_York">纽约 (UTC-5)</option>
                    <option value="Europe/Paris">巴黎 (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧结果区域 -->
        <div class="result-section">
          <div class="section-card">
            <div class="card-header">
              <h2 class="card-title">转换结果</h2>
            </div>
            <div class="card-body">
              <!-- 秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">秒级时间戳：</div>
                <div class="result-content">
                  <div class="result-text">{{ secondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(secondsTimestamp)" title="复制"
                    v-if="secondsTimestamp">
                    <i class="mdi mdi-content-copy"></i>
                  </button>
                </div>
              </div>

              <!-- 毫秒级时间戳 -->
              <div class="result-block">
                <div class="result-label">毫秒级时间戳：</div>
                <div class="result-content">
                  <div class="result-text">{{ millisecondsTimestamp || '-' }}</div>
                  <button class="copy-button" @click="copyToClipboard(millisecondsTimestamp)" title="复制"
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
export default {
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
    // 显示自定义提示
    showToast(message, type = 'success') {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.toast.show = true;

      // 3秒后自动关闭
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },

    // 自动检测时间戳类型（秒级或毫秒级）
    detectTimestampType() {
      if (!this.timestampInput) return;

      const timestamp = Number(this.timestampInput);
      if (isNaN(timestamp)) {
        this.showToast('请输入有效的数字时间戳', 'error');
        return;
      }

      // 如果时间戳长度大于10位，可能是毫秒级时间戳
      if (timestamp > 10000000000) {
        this.timestampType = 'milliseconds';
      } else {
        this.timestampType = 'seconds';
      }

      // 自动转换时间戳
      this.convertTimestamp();
    },

    // 处理时间戳类型变化
    handleTimestampTypeChange() {
      if (this.timestampInput) {
        this.convertTimestamp();
      }
    },

    // 时间戳转日期
    convertTimestamp() {
      if (!this.timestampInput) {
        return;
      }

      const timestamp = Number(this.timestampInput);
      if (isNaN(timestamp)) {
        this.showToast('请输入有效的数字时间戳', 'error');
        return;
      }

      try {
        let date;
        if (this.timestampType === 'seconds') {
          date = new Date(timestamp * 1000);
          this.secondsTimestamp = timestamp;
          this.millisecondsTimestamp = timestamp * 1000;
        } else {
          date = new Date(timestamp);
          this.secondsTimestamp = Math.floor(timestamp / 1000);
          this.millisecondsTimestamp = timestamp;
        }

        this.updateDateFormats(date);
        this.updateDateComponents(date);
      } catch (e) {
        this.showToast('时间戳转换失败，请检查输入', 'error');
      }
    },

    // 日期转时间戳
    convertDate() {
      if (!this.datetime && !this.isDateComponentsValid()) {
        this.showToast('请先选择或输入日期时间', 'error');
        return;
      }

      try {
        let date;
        if (this.datetime) {
          date = new Date(this.datetime);
        } else {
          // 从组件构建日期
          date = new Date(
            this.dateComponents.year,
            this.dateComponents.month - 1, // 月份从0开始
            this.dateComponents.day,
            this.dateComponents.hour || 0,
            this.dateComponents.minute || 0,
            this.dateComponents.second || 0
          );
        }

        this.updateDateFormats(date);
        this.updateDateComponents(date);
        this.timestampInput = this.secondsTimestamp;
      } catch (e) {
        this.showToast('日期转换失败，请检查输入', 'error');
      }
    },

    // 检查日期组件是否有效
    isDateComponentsValid() {
      return this.dateComponents.year &&
        this.dateComponents.month &&
        this.dateComponents.day;
    },

    // 从日期组件更新日期
    updateDateFromComponents() {
      if (!this.isDateComponentsValid()) return;

      try {
        // 限制输入值的范围
        this.limitDateComponentValues();

        const date = new Date(
          this.dateComponents.year,
          this.dateComponents.month - 1, // 月份从0开始
          this.dateComponents.day,
          this.dateComponents.hour || 0,
          this.dateComponents.minute || 0,
          this.dateComponents.second || 0
        );

        this.updateDateFormats(date);
        // 更新datetime输入框
        this.datetime = date.toISOString().slice(0, 16);

        // 自动更新时间戳输入框
        this.timestampInput = this.secondsTimestamp;
      } catch (e) {
        this.showToast('日期无效，请检查输入', 'error');
      }
    },

    // 限制日期组件的值
    limitDateComponentValues() {
      // 限制年份
      if (this.dateComponents.year) {
        this.dateComponents.year = Math.min(Math.max(parseInt(this.dateComponents.year), 1970), 2100);
      }

      // 限制月份
      if (this.dateComponents.month) {
        this.dateComponents.month = Math.min(Math.max(parseInt(this.dateComponents.month), 1), 12);
      }

      // 限制日期
      if (this.dateComponents.day) {
        this.dateComponents.day = Math.min(Math.max(parseInt(this.dateComponents.day), 1), 31);
      }

      // 限制小时
      if (this.dateComponents.hour) {
        this.dateComponents.hour = Math.min(Math.max(parseInt(this.dateComponents.hour), 0), 23);
      }

      // 限制分钟
      if (this.dateComponents.minute) {
        this.dateComponents.minute = Math.min(Math.max(parseInt(this.dateComponents.minute), 0), 59);
      }

      // 限制秒数
      if (this.dateComponents.second) {
        this.dateComponents.second = Math.min(Math.max(parseInt(this.dateComponents.second), 0), 59);
      }
    },

    // 更新日期组件
    updateDateComponents(date) {
      this.dateComponents = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 月份从0开始，需要+1
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
    },

    updateTimezoneInfo() {
      const date = new Date();
      const options = { timeZoneName: 'long' };
      this.currentTimezone = new Intl.DateTimeFormat('zh-CN', options).formatToParts(date)
        .find(part => part.type === 'timeZoneName').value;
    },

    dateToTimestamp() {
      if (this.datetime) {
        const date = new Date(this.datetime);
        this.updateDateFormats(date);
        this.updateDateComponents(date);

        // 自动更新时间戳输入框
        this.timestampInput = this.secondsTimestamp;
      }
    },

    updateDateFormats(date) {
      this.secondsTimestamp = Math.floor(date.getTime() / 1000);
      this.millisecondsTimestamp = date.getTime();
      this.datetime = date.toISOString().slice(0, 16);

      // 格式化为选定时区的时间
      const options = {
        timeZone: this.selectedTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };

      this.formattedDate = date.toLocaleString('zh-CN', options);
      this.isoDate = date.toISOString();
      this.utcDate = date.toUTCString();
    },

    useCurrentTimestamp() {
      const now = new Date();
      this.updateDateFormats(now);
      this.updateDateComponents(now);
      this.timestampInput = this.secondsTimestamp;
      this.showToast('已使用当前时间');
    },

    updateTime() {
      if (this.secondsTimestamp) {
        const date = new Date(this.secondsTimestamp * 1000);
        this.updateDateFormats(date);
        this.updateDateComponents(date);
      }
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
    },

    clearAll() {
      this.timestampInput = '';
      this.datetime = '';
      this.secondsTimestamp = '';
      this.millisecondsTimestamp = '';
      this.formattedDate = '';
      this.isoDate = '';
      this.utcDate = '';
      this.dateComponents = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
      };
      this.showToast('已清空所有内容');
    }
  }
}
</script>

<style scoped>
/* 主容器 */
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

/* 工具标题和描述 */
.tool-header {
  display: none;
  /* 隐藏标题，因为已经在顶部导航栏显示了 */
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.action-group {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

.action-btn.primary {
  background-color: #1a73e8;
  color: white;
  border-color: #1a73e8;
}

.action-btn.primary:hover {
  background-color: #1765cc;
}

.action-btn i {
  margin-right: 6px;
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
  padding: 16px;
}

/* 输入块 */
.input-block {
  margin-bottom: 16px;
}

.input-block:last-child {
  margin-bottom: 0;
}

.input-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.input-control {
  width: 100%;
}

/* 文本输入 */
.text-input,
.datetime-input,
.select-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.2s;
}

.text-input:focus,
.datetime-input:focus,
.select-input:focus {
  border-color: #1a73e8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

/* 单选按钮 */
.radio-options {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-option input {
  margin-right: 6px;
}

/* 日期输入 */
.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-group,
.time-group {
  display: flex;
  align-items: center;
}

.date-input {
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  -moz-appearance: textfield;
}

.date-input::-webkit-outer-spin-button,
.date-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.date-input:focus {
  border-color: #1a73e8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.date-input.year {
  width: 70px;
}

.date-separator {
  margin: 0 4px;
  color: #666;
}

/* 结果块 */
.result-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #eee;
}

.result-block:last-child {
  margin-bottom: 0;
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

/* 复制按钮 */
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
}

.copy-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #1a73e8;
}

/* 提示框 */
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
}

.toast.success {
  background-color: #e6f4ea;
  color: #0f9d58;
  border-left: 3px solid #0f9d58;
}

.toast.error {
  background-color: #fce8e6;
  color: #d93025;
  border-left: 3px solid #d93025;
}

.toast i {
  font-size: 18px;
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
</style>