<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="navbar-content">
        <div class="logo">
          <h2 class="navbar-title">工具箱</h2>
        </div>
        <nav class="nav-links">
          <router-link to="/timestamp" class="nav-link">
            <i class="mdi mdi-clock-outline"></i>
            <span>时间戳转换</span>
          </router-link>
          <router-link to="/json" class="nav-link">
            <i class="mdi mdi-code-json"></i>
            <span>JSON 格式化</span>
          </router-link>
          <router-link to="/base64" class="nav-link">
            <i class="mdi mdi-shuffle-variant"></i>
            <span>Base64 转换</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 工具操作栏 - 根据当前路由动态显示不同工具的操作按钮 -->
    <div class="toolbar">
      <div class="toolbar-content">
        <!-- 时间戳工具操作按钮 -->
        <div class="tool-actions" v-if="$route.path === '/timestamp'">
          <button class="tool-action-btn primary">
            <i class="mdi mdi-clock-outline"></i> 当前时间
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-delete-outline"></i> 清空
          </button>
        </div>

        <!-- JSON格式化工具操作按钮 -->
        <div class="tool-actions" v-if="$route.path === '/json'">
          <button class="tool-action-btn primary">
            <i class="mdi mdi-code-json"></i> 格式化
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-arrow-collapse-horizontal"></i> 压缩
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-check-circle-outline"></i> 验证
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-sort-alphabetical-ascending"></i> 排序
          </button>
        </div>

        <!-- Base64工具操作按钮 -->
        <div class="tool-actions" v-if="$route.path === '/base64'">
          <button class="tool-action-btn primary">
            <i class="mdi mdi-encode"></i> 编码
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-decode"></i> 解码
          </button>
          <button class="tool-action-btn">
            <i class="mdi mdi-delete-outline"></i> 清空
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* 添加全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  width: 100%;
}

/* 顶部导航栏 */
.top-navbar {
  background: linear-gradient(90deg, #1a73e8, #6c5ce7);
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.navbar-title {
  font-size: 1.5em;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.navbar-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.navbar-title:hover::after {
  transform: translateX(0);
}

.nav-links {
  display: flex;
  margin-left: 30px;
  height: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 100%;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #ffffff;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-link i {
  margin-right: 8px;
  font-size: 1.1em;
  transition: transform 0.3s ease;
}

.nav-link span {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link:hover i {
  transform: scale(1.2);
}

.nav-link:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-link.router-link-active {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-link.router-link-active::before {
  transform: scaleX(1);
}

/* 工具栏 */
.toolbar {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 90;
  transition: all 0.3s ease;
}

.toolbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
}

.tool-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tool-action-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.tool-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.tool-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.2);
}

.tool-action-btn:hover::before {
  transform: translateX(100%);
}

.tool-action-btn:active {
  transform: translateY(1px);
}

.tool-action-btn.primary {
  background: linear-gradient(135deg, #1a73e8, #4285f4);
  color: white;
}

.tool-action-btn.primary:hover {
  background: linear-gradient(135deg, #1557b0, #3b77db);
}

.tool-action-btn i {
  margin-right: 8px;
  font-size: 18px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-action-btn:hover i {
  transform: rotate(15deg) scale(1.2);
}

/* 添加工具栏动画 */
@keyframes toolbarSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toolbar {
  animation: toolbarSlideIn 0.5s ease forwards;
}

/* 添加按钮动画 */
@keyframes buttonPop {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }

  70% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.tool-action-btn {
  animation: buttonPop 0.3s ease forwards;
  animation-delay: calc(var(--btn-index) * 0.1s);
}

/* 主内容区域 */
.main-content {
  flex-grow: 1;
  padding-top: 110px;
  /* 顶部导航栏 + 工具栏的高度 */
  width: 100%;
  min-height: calc(100vh - 110px);
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {

  .navbar-content,
  .toolbar-content {
    padding: 0 10px;
  }

  .top-navbar {
    height: auto;
    padding: 10px 0;
  }

  .navbar-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    overflow-x: auto;
  }

  .toolbar {
    top: auto;
    position: relative;
  }

  .main-content {
    padding-top: 20px;
  }

  .tool-action-btn {
    flex: 1;
    justify-content: center;
    padding: 8px 10px;
  }

  .tool-action-btn span {
    display: none;
  }

  .tool-action-btn i {
    margin-right: 0;
  }
}
</style>

<script>
export default {
  mounted() {
    // 监听路由变化，更新工具栏按钮
    this.$watch(
      () => this.$route.path,
      () => {
        // 路由变化时可以添加一些动画效果
        const toolbar = document.querySelector('.toolbar');
        if (toolbar) {
          toolbar.classList.add('fade-in');
          setTimeout(() => {
            toolbar.classList.remove('fade-in');
          }, 500);
        }
      }
    );
  }
}
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}
</style>
