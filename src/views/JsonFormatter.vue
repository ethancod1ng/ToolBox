<template>
  <div class="formatter">
    <div class="input-area">
      <textarea 
        v-model="inputJson" 
        placeholder="请输入 JSON 字符串"
        @input="formatJson"
      ></textarea>
    </div>
    <div class="button-group">
      <button @click="formatJson">格式化</button>
      <button @click="minifyJson">压缩</button>
      <button @click="copyResult">复制结果</button>
    </div>
    <pre class="output-area" v-if="formattedJson"><code>{{ formattedJson }}</code></pre>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputJson: '',
      formattedJson: '',
      error: ''
    }
  },
  methods: {
    formatJson() {
      try {
        if (!this.inputJson) {
          this.formattedJson = ''
          this.error = ''
          return
        }
        const obj = JSON.parse(this.inputJson)
        this.formattedJson = JSON.stringify(obj, null, 2)
        this.error = ''
      } catch (e) {
        this.error = '无效的 JSON 格式'
        this.formattedJson = ''
      }
    },
    minifyJson() {
      try {
        if (!this.inputJson) return
        const obj = JSON.parse(this.inputJson)
        this.formattedJson = JSON.stringify(obj)
        this.error = ''
      } catch (e) {
        this.error = '无效的 JSON 格式'
        this.formattedJson = ''
      }
    },
    async copyResult() {
      if (!this.formattedJson) return
      try {
        await navigator.clipboard.writeText(this.formattedJson)
        alert('已复制到剪贴板')
      } catch (e) {
        alert('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.formatter {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.input-area textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.button-group {
  margin: 15px 0;
}

button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.output-area {
  background: white;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>