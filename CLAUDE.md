# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 开发命令

- `npm install` - 安装依赖
- `npm run dev` - 启动开发服务器，支持热重载
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run deploy` - 使用 gh-pages 部署到 GitHub Pages

## 架构概览

这是一个 Vue 3 + Vite 工具箱应用，为开发者提供实用工具。应用使用：

- **Vue 3** 混合使用 Composition API 和 Options API
- **Vue Router 4** 使用哈希路由 (`createWebHashHistory`)
- **Vue I18n** 国际化支持（中文、英文、日文）
- **Element Plus** 和 **Material Design Icons** UI 组件
- **Vite** 构建工具，集成 Vue DevTools

### 核心架构模式

**路由结构：**
- 哈希路由配置，适配 GitHub Pages 部署
- 默认路由重定向到 `/timestamp`
- 懒加载路由组件，优化性能
- 路由：`/timestamp`、`/json`、`/base64`

**国际化：**
- `src/locales/index.js` 中的集中式 i18n 配置
- 默认语言：`zh-CN`，回退语言：`en-US`
- 语言文件：`zh-CN.js`、`en-US.js`、`ja-JP.js`
- 主导航中的语言切换器

**组件架构：**
- 单文件 Vue 组件 (.vue)
- `App.vue` 中的主布局，包含固定导航栏和工具栏
- `src/views/` 中每个工具的视图组件
- `src/components/` 中的共享组件

**样式处理：**
- Vue 组件内的作用域 CSS
- `src/assets/main.css` 中的全局样式
- CSS 变量和现代 CSS 特性
- 移动优先的响应式设计
- MDI 图标系统

### 构建配置

**Vite 配置：**
- Base URL 设为 `/ToolBox/` 用于 GitHub Pages
- 别名 `@` 映射到 `src/` 目录
- 开发环境启用 Vue DevTools

**部署：**
- 通过 `gh-pages` 包部署到 GitHub Pages
- 构建产物输出到 `dist/` 目录
- package.json 中配置了主页地址

### 开发模式

**组件结构：**
- 视图组件处理页面级逻辑和布局
- 混合使用 Composition API (`setup()`) 和 Options API (`data()`、`methods()`)
- 通过方法处理事件
- 响应式数据管理

**状态管理：**
- 无集中式状态管理（Vuex/Pinia）
- 使用 Vue 响应式系统的组件级状态
- 父子组件通过 props 和 emit 通信

**代码风格：**
- 中文注释和 UI 文本，通过 i18n 显示
- 混合缩进（空格和制表符）- 遵循现有模式
- 工具函数采用函数式编程方法