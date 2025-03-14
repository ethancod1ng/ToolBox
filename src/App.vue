<template>
  <div class="app-container">
    <nav class="sidebar">
      <h2 class="sidebar-title">工具箱</h2>
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
}

.app-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.sidebar {
  width: 200px;
  background: #ffffff;
  padding: 20px 0;
  color: #333333;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  text-align: center;
  margin: 0 0 20px 0;
  padding: 0 20px;
  font-size: 1.5em;
  color: #1a73e8;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #5f6368;
  transition: all 0.3s;
}

.nav-link i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
  color: #5f6368;
}

.nav-link:hover {
  background: #f1f3f4;
  color: #1a73e8;
}

.nav-link:hover i {
  color: #1a73e8;
}

.nav-link.router-link-active {
  background: #e8f0fe;
  color: #1a73e8;
}

.nav-link.router-link-active i {
  color: #1a73e8;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  margin-left: 200px;
  min-height: 100vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 10px 0;
    position: relative;
    height: auto;
  }
  
  .main-content {
    margin-left: 0;
    max-width: 100%;
  }
}
</style>
