<template>
  <div class="formatter">
    <div class="input-area">
      <textarea 
        v-model="inputJson" 
        placeholder="请输入 JSON 字符串"
        class="json-input"
      ></textarea>
    </div>

    <div class="button-group">
      <button @click="formatJson">格式化</button>
      <button @click="compressJson">压缩</button>
      <button @click="clearResult">复制结果</button>
    </div>

    <div class="output-area">
      <pre class="json-output">{{ formattedJson }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputJson: '',
      formattedJson: ''
    }
  },
  methods: {
    formatJson() {
      try {
        const obj = JSON.parse(this.inputJson)
        this.formattedJson = JSON.stringify(obj, null, 2)
      } catch (e) {
        this.formattedJson = '无效的 JSON 格式'
      }
    },
    compressJson() {
      try {
        const obj = JSON.parse(this.inputJson)
        this.formattedJson = JSON.stringify(obj)
      } catch (e) {
        this.formattedJson = '无效的 JSON 格式'
      }
    },
    async clearResult() {
      try {
        await navigator.clipboard.writeText(this.formattedJson)
        alert('已复制到剪贴板')
      } catch (err) {
        alert('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.formatter {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-gap: 20px;
  min-height: calc(100vh - 100px);
}

.input-area, .output-area {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.json-input {
  width: 100%;
  height: 300px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: border-color 0.3s;
}

.json-input:focus {
  border-color: #1a73e8;
  outline: none;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}

button {
  padding: 12px 32px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

button:hover {
  background: #1557b0;
  transform: translateY(-1px);
}

.output-area {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
  border: 2px solid #e0e0e0;
}

.json-output {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .formatter {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
    padding: 10px 0;
  }

  button {
    width: 100%;
  }
}
</style>