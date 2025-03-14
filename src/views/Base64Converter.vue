<template>
  <div class="converter">
    <div class="input-group">
      <label>原始文本：</label>
      <textarea 
        v-model="input" 
        placeholder="请输入要转换的文本"
        @input="encode"
      ></textarea>
    </div>

    <div class="button-group">
      <button @click="encode">编码</button>
      <button @click="decode">解码</button>
      <button @click="copyResult">复制结果</button>
    </div>

    <div class="input-group">
      <label>转换结果：</label>
      <textarea 
        v-model="output" 
        readonly
      ></textarea>
    </div>

    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      output: '',
      error: ''
    }
  },
  methods: {
    encode() {
      try {
        this.output = btoa(this.input)
        this.error = ''
      } catch (e) {
        this.error = '编码失败：输入包含非 ASCII 字符'
      }
    },
    decode() {
      try {
        this.output = atob(this.input)
        this.error = ''
      } catch (e) {
        this.error = '解码失败：输入不是有效的 Base64 字符串'
      }
    },
    async copyResult() {
      if (!this.output) return
      try {
        await navigator.clipboard.writeText(this.output)
        alert('已复制到剪贴板')
      } catch (e) {
        alert('复制失败')
      }
    }
  }
}
</script>

<style scoped>
.converter {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group textarea {
  width: 100%;
  height: 150px;
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

.error {
  color: red;
  margin-top: 10px;
}
</style>