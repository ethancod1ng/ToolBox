<template>
  <div class="converter">
    <div class="converter-header">
      <h1>Base64 转换工具</h1>
      <p>编码、解码和转换 Base64 数据</p>
    </div>

    <div class="converter-actions">
      <button class="main-btn" @click="encode">
        <i class="mdi mdi-arrow-down-bold-box-outline"></i> 编码
      </button>
      <button class="main-btn" @click="decode">
        <i class="mdi mdi-arrow-up-bold-box-outline"></i> 解码
      </button>
      <button class="main-btn" @click="clearAll">
        <i class="mdi mdi-delete-outline"></i> 清空
      </button>
      <button class="main-btn" @click="swapTexts">
        <i class="mdi mdi-swap-vertical"></i> 交换
      </button>
    </div>

    <div class="converter-content">
      <div class="input-panel">
        <div class="panel-header">
          <h3>输入文本</h3>
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
        <textarea v-model="input" placeholder="请输入要转换的文本" class="text-input"></textarea>
      </div>

      <div class="output-panel">
        <div class="panel-header">
          <h3>转换结果</h3>
          <div class="output-actions">
            <button class="action-btn" @click="downloadResult" title="下载结果">
              <i class="mdi mdi-download-outline"></i>
              <span>下载</span>
            </button>
            <button class="action-btn" @click="copyResult" title="复制结果">
              <i class="mdi" :class="copySuccess ? 'mdi-check' : 'mdi-content-copy'"></i>
              <span>{{ copySuccess ? '已复制' : '复制' }}</span>
            </button>
          </div>
        </div>
        <textarea v-model="output" readonly class="text-output"></textarea>
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
      input: '',
      output: '',
      error: '',
      copySuccess: false,
      toast: {
        show: false,
        message: '',
        type: 'success',
        icon: 'mdi-check-circle'
      }
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

    encode() {
      if (!this.input.trim()) {
        this.showToast('请先输入需要编码的文本', 'error');
        return;
      }

      try {
        this.output = btoa(this.input);
        this.error = '';
        this.showToast('Base64 编码成功');
      } catch (e) {
        this.error = '编码失败：输入包含非 ASCII 字符';
        this.showToast('编码失败：输入包含非 ASCII 字符', 'error');
      }
    },

    decode() {
      if (!this.input.trim()) {
        this.showToast('请先输入需要解码的 Base64 字符串', 'error');
        return;
      }

      try {
        this.output = atob(this.input);
        this.error = '';
        this.showToast('Base64 解码成功');
      } catch (e) {
        this.error = '解码失败：输入不是有效的 Base64 字符串';
        this.showToast('解码失败：输入不是有效的 Base64 字符串', 'error');
      }
    },

    async copyResult() {
      if (!this.output) {
        this.showToast('没有可复制的内容', 'error');
        return;
      }

      try {
        await navigator.clipboard.writeText(this.output);
        this.copySuccess = true;
        this.showToast('已复制到剪贴板');

        // 2秒后恢复按钮状态
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (e) {
        this.showToast('复制失败', 'error');
      }
    },

    clearInput() {
      this.input = '';
      this.showToast('输入已清空');
    },

    clearAll() {
      this.input = '';
      this.output = '';
      this.error = '';
      this.showToast('已清空所有内容');
    },

    swapTexts() {
      const temp = this.input;
      this.input = this.output;
      this.output = temp;
      if (this.input && this.output) {
        this.showToast('输入和输出内容已交换');
      }
    },

    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.input = text;
        this.showToast('已从剪贴板粘贴');
      } catch (err) {
        this.showToast('无法从剪贴板读取内容', 'error');
      }
    },

    downloadResult() {
      if (!this.output) {
        this.showToast('没有可下载的内容', 'error');
        return;
      }

      const blob = new Blob([this.output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'base64_result.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast('文件已下载');
    }
  }
}
</script>

<style scoped>
.converter {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.converter-header {
  text-align: center;
  padding: 20px 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.converter-header h1 {
  color: #1a73e8;
  margin-bottom: 8px;
}

.converter-header p {
  color: #5f6368;
}

.converter-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 15px 0;
  background-color: white;
  flex-wrap: wrap;
}

.main-btn {
  padding: 12px 20px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  justify-content: center;
}

.main-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.converter-content {
  display: flex;
  flex: 1;
  padding: 0 20px 20px 20px;
  gap: 20px;
  background-color: white;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
  font-size: 16px;
  color: #202124;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 12px;
  background: #f1f3f4;
  color: #5f6368;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
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
  font-size: 18px;
  transition: all 0.2s;
}

/* 复制成功状态样式 */
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
}

.text-input:focus {
  outline: none;
}

.text-output {
  background: #fff;
}

.error {
  padding: 10px 16px;
  font-size: 14px;
  color: #d93025;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  width: 100%;
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
  animation: slideUp 0.3s ease-out forwards;
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

  .action-btn {
    padding: 8px 10px;
  }

  .action-btn span {
    display: none;
  }

  .action-btn i {
    margin: 0;
  }

  .converter-actions {
    gap: 10px;
    padding: 10px;
  }

  .main-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: calc(50% - 10px);
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
}
</style>