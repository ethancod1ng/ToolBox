<template>
  <div class="converter">
    <div class="input-group">
      <label>时间戳：</label>
      <div class="input-with-button">
        <input 
          type="number" 
          v-model="timestamp" 
          placeholder="请输入时间戳"
          @input="timestampToDate"
        >
        <button @click="useCurrentTimestamp">使用当前时间</button>
      </div>
    </div>

    <div class="input-group">
      <label>日期时间：</label>
      <div class="datetime-wrapper">
        <input 
          type="datetime-local" 
          v-model="datetime"
          @input="dateToTimestamp"
          class="datetime-input"
        >
        <select v-model="selectedTimezone" @change="updateTime" class="timezone-select">
          <option value="Asia/Tokyo">东京 (UTC+9)</option>
          <option value="Asia/Shanghai">上海 (UTC+8)</option>
          <option value="Europe/London">伦敦 (UTC+0)</option>
          <option value="America/New_York">纽约 (UTC-5)</option>
        </select>
      </div>
    </div>

    <div class="result">
      <div class="result-item">
        <label>秒级时间戳：</label>
        <div class="result-value">
          {{ timestamp || '-' }}
          <button class="copy-btn" @click="copyToClipboard(timestamp)">复制</button>
        </div>
      </div>
      <div class="result-item">
        <label>毫秒级时间戳：</label>
        <div class="result-value">
          {{ timestamp ? timestamp * 1000 : '-' }}
          <button class="copy-btn" @click="copyToClipboard(timestamp * 1000)">复制</button>
        </div>
      </div>
      <div class="result-item">
        <label>当前时区：</label>
        <div class="result-value">{{ currentTimezone }}</div>
      </div>
      <div class="result-item">
        <label>格式化时间：</label>
        <div class="result-value">{{ formattedDate || '-' }}</div>
      </div>
      <div class="result-item">
        <label>ISO 格式：</label>
        <div class="result-value">{{ isoDate || '-' }}</div>
      </div>
      <div class="result-item">
        <label>UTC 时间：</label>
        <div class="result-value">{{ utcDate || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timestamp: '',
      datetime: '',
      formattedDate: '',
      selectedTimezone: 'Asia/Tokyo',
      isoDate: '',
      utcDate: '',
      currentTimezone: ''
    }
  },
  created() {
    this.selectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.updateTimezoneInfo()
  },
  methods: {
    updateTimezoneInfo() {
      const date = new Date()
      const options = { timeZoneName: 'long' }
      this.currentTimezone = new Intl.DateTimeFormat('zh-CN', options).formatToParts(date)
        .find(part => part.type === 'timeZoneName').value
    },
    timestampToDate() {
      if (this.timestamp) {
        const date = new Date(this.timestamp * 1000)
        this.updateDateFormats(date)
      }
    },
    dateToTimestamp() {
      if (this.datetime) {
        const date = new Date(this.datetime)
        this.updateDateFormats(date)
      }
    },
    updateDateFormats(date) {
      this.timestamp = Math.floor(date.getTime() / 1000)
      this.datetime = date.toISOString().slice(0, 16)
      
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
      }
      
      this.formattedDate = date.toLocaleString('zh-CN', options)
      this.isoDate = date.toISOString()
      this.utcDate = date.toUTCString()
    },
    useCurrentTimestamp() {
      const now = new Date()
      this.updateDateFormats(now)
    },
    updateTime() {
      if (this.timestamp) {
        this.timestampToDate()
      }
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text.toString())
        alert('已复制到剪贴板')
      } catch (err) {
        alert('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.datetime-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
}

.datetime-input {
  flex: 3;  /* 增加比例 */
}

.timezone-select {
  flex: 1;
  min-width: 160px;  /* 确保时区选择器有足够宽度 */
}

.input-with-button {
  display: flex;
  gap: 12px;
  width: 100%;
}

input {
  flex: 3;  /* 增加输入框占比 */
}

button {
  flex: 1;
  min-width: 160px;  /* 确保按钮有足够宽度 */
}

.converter {
  max-width: 1200px;
  width: 100%;  /* 确保容器占满可用空间 */
  margin: 0 auto;
  padding: 40px;
}

.result {
  width: 100%;  /* 确保结果区域占满容器宽度 */
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  width: 100%;
}

.result-item label {
  min-width: 130px;  /* 设置最小宽度 */
  margin-right: 20px;  /* 增加右侧间距 */
}

.result-value {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;  /* 让复制按钮靠右 */
}

.timezone-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  background: white;
}

.copy-btn {
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 8px;
  background: #f1f3f4;
  color: #1a73e8;
}

.copy-btn:hover {
  background: #e8f0fe;
}

.converter {
  max-width: 1200px;  /* 增加最大宽度 */
  margin: 0 auto;
  background: white;
  padding: 40px;  /* 增加内边距 */
  border-radius: 12px;  /* 增加圆角 */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);  /* 增强阴影效果 */
}

.input-group {
  margin-bottom: 32px;  /* 增加间距 */
}

.input-group label {
  font-size: 15px;
  margin-bottom: 10px;
}

input, .timezone-select {
  padding: 12px;
  font-size: 15px;
}

button {
  padding: 12px 24px;
  font-size: 15px;
}

.result-item label {
  width: 130px;
  font-size: 14px;
}

.result-value {
  font-size: 15px;
}

.copy-btn {
  padding: 4px 10px;
  font-size: 13px;
  margin-left: 10px;
}

.result {
  margin-top: 40px;  /* 增加间距 */
  padding: 30px;  /* 增加内边距 */
}

.result-item {
  padding: 16px 0;  /* 增加内边距 */
}

.result-item label {
  width: 150px;  /* 增加标签宽度 */
  font-size: 16px;
}

.result-value {
  font-size: 18px;  /* 增大字体 */
}

.copy-btn {
  padding: 6px 12px;
  font-size: 14px;
  margin-left: 12px;
}

.input-with-button {
  display: flex;
  gap: 12px;
}

input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #1a73e8;
  outline: none;
}

.datetime-input {
  width: 100%;
}

button {
  padding: 12px 24px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background: #1557b0;
}

.result {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item label {
  width: 120px;
  color: #666;
  font-size: 15px;
}

.result-value {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-family: monospace;
}

@media (max-width: 768px) {
  .converter {
    padding: 20px;
  }

  .input-with-button {
    flex-direction: column;
  }

  button {
    width: 100%;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-item label {
    margin-bottom: 4px;
  }
}
</style>