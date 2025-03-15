<template>
  <div class="formatter">
    <div class="formatter-header">
      <h1>JSON 格式化工具</h1>
      <p>粘贴、验证、格式化和压缩 JSON 数据</p>
    </div>

    <div class="formatter-actions">
      <button class="main-btn" @click="formatJson">
        <i class="mdi mdi-code-json"></i> 格式化
      </button>
      <button class="main-btn" @click="compressJson">
        <i class="mdi mdi-arrow-collapse-horizontal"></i> 压缩
      </button>
      <button class="main-btn" @click="validateJsonOnly">
        <i class="mdi mdi-check-circle-outline"></i> 验证
      </button>
      <button class="main-btn" @click="sortJson">
        <i class="mdi mdi-sort-alphabetical-ascending"></i> 排序
      </button>
    </div>

    <div class="formatter-content">
      <div class="input-panel">
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
          </div>
        </div>
        <textarea v-model="inputJson" placeholder="请输入 JSON 字符串" class="json-input"
          @input="validateJsonOnType"></textarea>
        <div class="validation-message" v-if="validationMessage">
          <i class="mdi"
            :class="validationStatus ? 'mdi-check-circle text-success' : 'mdi-alert-circle text-error'"></i>
          {{ validationMessage }}
        </div>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <h3>格式化结果</h3>
          <div class="output-actions">
            <button class="action-btn" @click="downloadJson" title="下载 JSON">
              <i class="mdi mdi-download-outline"></i>
              <span>下载</span>
            </button>
            <button class="action-btn" @click="copyResult" title="复制结果">
              <i class="mdi" :class="copySuccess ? 'mdi-check' : 'mdi-content-copy'"></i>
              <span>{{ copySuccess ? '已复制' : '复制' }}</span>
            </button>
          </div>
        </div>
        <pre class="json-output" v-html="highlightedJson"></pre>
      </div>
    </div>

    <!-- 自定义提示框 -->
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
      inputJson: '',
      formattedJson: '',
      validationMessage: '',
      validationStatus: false,
      copySuccess: false,
      toast: {
        show: false,
        message: '',
        type: 'success',
        icon: 'mdi-check-circle'
      }
    }
  },
  computed: {
    highlightedJson() {
      if (!this.formattedJson) return '';

      // 简单的语法高亮实现
      return this.formattedJson
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
          let cls = 'json-number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'json-key';
            } else {
              cls = 'json-string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
          } else if (/null/.test(match)) {
            cls = 'json-null';
          }
          return `<span class="${cls}">${match}</span>`;
        });
    }
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

    validateJson(json) {
      try {
        if (!json.trim()) {
          this.validationMessage = '';
          this.validationStatus = false;
          return false;
        }

        JSON.parse(json);
        this.validationMessage = '有效的 JSON 格式';
        this.validationStatus = true;
        return true;
      } catch (e) {
        this.validationMessage = `无效的 JSON: ${e.message}`;
        this.validationStatus = false;
        return false;
      }
    },
    validateJsonOnType() {
      if (this.inputJson.trim()) {
        const isValid = this.validateJson(this.inputJson);
        // 如果是有效的JSON，自动格式化
        if (isValid) {
          try {
            const obj = JSON.parse(this.inputJson);
            this.formattedJson = JSON.stringify(obj, null, 2);
          } catch (e) {
            // 解析错误，不进行格式化
          }
        }
      } else {
        this.validationMessage = '';
        this.formattedJson = '';
      }
    },
    formatJson() {
      if (this.validateJson(this.inputJson)) {
        const obj = JSON.parse(this.inputJson);
        this.formattedJson = JSON.stringify(obj, null, 2);
        this.showToast('JSON 格式化成功');
      } else if (!this.inputJson.trim()) {
        this.formattedJson = '';
      } else {
        this.showToast('JSON 格式无效，请检查输入', 'error');
      }
    },
    compressJson() {
      if (this.validateJson(this.inputJson)) {
        const obj = JSON.parse(this.inputJson);
        this.formattedJson = JSON.stringify(obj);
        this.showToast('JSON 压缩成功');
      } else {
        this.showToast('JSON 格式无效，请检查输入', 'error');
      }
    },
    async copyResult() {
      try {
        if (!this.formattedJson) {
          this.showToast('没有可复制的内容', 'error');
          return;
        }

        await navigator.clipboard.writeText(this.formattedJson);
        this.copySuccess = true;
        this.showToast('已复制到剪贴板');

        // 2秒后恢复按钮状态
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (err) {
        this.showToast('复制失败', 'error');
      }
    },
    clearInput() {
      this.inputJson = '';
      this.validationMessage = '';
      this.formattedJson = '';
      this.showToast('输入已清空');
    },
    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.inputJson = text;

        // 尝试验证并自动格式化
        if (text.trim()) {
          const isValid = this.validateJson(text);
          if (isValid) {
            const obj = JSON.parse(text);
            this.formattedJson = JSON.stringify(obj, null, 2);
            this.showToast('JSON 已自动格式化');
          } else {
            this.showToast('JSON 格式无效，请检查输入', 'error');
          }
        }
      } catch (err) {
        this.showToast('无法从剪贴板读取内容', 'error');
      }
    },
    downloadJson() {
      if (!this.formattedJson) {
        this.showToast('没有可下载的内容', 'error');
        return;
      }

      const blob = new Blob([this.formattedJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted_json.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast('JSON 文件已下载');
    },
    validateJsonOnly() {
      if (!this.inputJson.trim()) {
        this.showToast('请先输入JSON数据', 'error');
        return;
      }

      const isValid = this.validateJson(this.inputJson);
      if (isValid) {
        this.showToast('JSON 格式有效');
      } else {
        this.showToast('JSON 格式无效，请检查输入', 'error');
      }
    },
    sortJson() {
      if (!this.validateJson(this.inputJson)) {
        this.showToast('JSON 格式无效，无法排序', 'error');
        return;
      }

      try {
        const obj = JSON.parse(this.inputJson);

        // 递归排序对象的键
        const sortObjectKeys = (obj) => {
          // 如果不是对象或是null，直接返回
          if (obj === null || typeof obj !== 'object') {
            return obj;
          }

          // 如果是数组，对数组中的每个对象元素进行排序
          if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
          }

          // 对象的情况，获取所有键并排序
          const sortedObj = {};
          Object.keys(obj).sort().forEach(key => {
            sortedObj[key] = sortObjectKeys(obj[key]);
          });

          return sortedObj;
        };

        const sortedObj = sortObjectKeys(obj);
        this.formattedJson = JSON.stringify(sortedObj, null, 2);
        this.showToast('JSON 已排序');
      } catch (e) {
        this.showToast(`排序失败: ${e.message}`, 'error');
      }
    }
  }
}
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
  /* 隐藏标题，因为已经在顶部导航栏显示了 */
}

.formatter-actions {
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

.main-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.main-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  min-height: 500px;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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

.action-btn:hover {
  background: #e8eaed;
  color: #1a73e8;
}

.action-btn i {
  font-size: 16px;
  transition: all 0.2s;
}

/* 复制成功状态样式 */
.action-btn .mdi-check {
  color: #0f9d58;
}

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
}

.json-input:focus {
  outline: none;
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
}

.validation-message {
  padding: 8px 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  width: 100%;
}

.text-success {
  color: #0f9d58;
}

.text-error {
  color: #d93025;
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
  padding: 10px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  min-width: 250px;
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

/* JSON 语法高亮 */
.json-string {
  color: #0f9d58;
}

.json-number {
  color: #1a73e8;
}

.json-boolean {
  color: #9c27b0;
}

.json-null {
  color: #9e9e9e;
}

.json-key {
  color: #d93025;
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
}
</style>