# 技术栈说明

本文档记录 **My Resume** 的技术选型、理由及与 [oh-my-cv](https://github.com/Renovamen/oh-my-cv) 的对应关系。

---

## 总览

```text
React 18 + TypeScript + Vite
├── UI：Tailwind CSS
├── 路由：React Router
├── 编辑：CodeMirror 6（@uiw/react-codemirror）
├── 预览：react-markdown + remark-gfm
├── 状态：Zustand
├── 存储：IndexedDB（idb）+ localStorage
└── PDF：Print CSS + window.print()
```

---

## 分层选型

### 1. 应用框架：React + TypeScript + Vite

| 理由 |
|------|
| 生态成熟，组件与 hooks 适合编辑器类 SPA |
| Vite 冷启动快，配置简单 |
| TypeScript 便于维护简历数据模型与存储 API |

**oh-my-cv 使用**：Nuxt 3 + Vue 3 + TypeScript

---

### 2. 编辑区：CodeMirror 6

| 方案 | 优点 | 缺点 |
|------|------|------|
| **CodeMirror 6**（选用） | 体积小、React 集成简单、Markdown/CSS 高亮够用 | 无内置 minimap |
| Monaco | 体验接近 VS Code，oh-my-cv 官方方案 | 包大、Vite 需配置 Worker |
| textarea | 零依赖 | 无高亮，大文档体验差 |

**集成方式**：

- `@uiw/react-codemirror`
- `@codemirror/lang-markdown`（Markdown Tab）
- `@codemirror/lang-css`（CSS Tab，二期）

**与 oh-my-cv**：其使用 `monaco-editor@0.50`，双 Model（`markdown` / `css`）共用一个 Editor 实例切换。本项目可用两个 CodeMirror 实例或单实例切换 Document，行为等价。

---

### 3. 预览渲染：react-markdown（MVP）

| 方案 | 适用场景 |
|------|----------|
| **react-markdown + remark-gfm** | 标准 Markdown / GFM，React 项目上手快 |
| **markdown-it** | 需复刻 oh-my-cv 自定义插件（KaTeX、`\newpage`、交叉引用等） |

**oh-my-cv 使用**：

- `markdown-it` 核心
- 自研包：`@ohmycv/markdown-it-katex`、`markdown-it-cross-ref`、`markdown-it-latex-cmds`
- `@ohmycv/front-matter` 解析 YAML 头

**迁移策略**：

1. MVP：`react-markdown` 满足标题、列表、链接、表格等
2. 当需要公式、换页、交叉引用时：引入 `markdown-it` 或编写 remark 插件，预览层抽象为 `renderMarkdown(md: string): string | ReactNode`，避免业务组件与具体库耦合

---

### 4. 状态管理：Zustand

管理：

- 当前简历 ID 与正文
- 简历列表元数据
- UI 设置（暗色模式、侧边栏）
- 保存状态（dirty / saving / lastSavedAt）

**oh-my-cv 使用**：Pinia

---

### 5. 本地存储

| 存储 | 内容 |
|------|------|
| **IndexedDB**（`idb`） | 简历正文、CSS、设置、时间戳 |
| **localStorage** | 主题偏好、最近打开的简历 ID |

**oh-my-cv 使用**：localForage（底层可为 IndexedDB / WebSQL / localStorage）

**设计要点**：

- 每次编辑 debounce 后写入
- 列表页只读元数据，减少反序列化开销
- 提供 `exportAll()` / `importBackup(json)` 供用户自行备份

---

### 6. 样式

| 层级 | 技术 |
|------|------|
| 应用 UI | Tailwind CSS |
| 简历预览 | 独立 CSS 文件 + CSS 变量（`--theme-color`、`--page-margin` 等） |
| 打印 / PDF | `@media print`、`@page { size: A4 }` |

预览 DOM 与打印共用同一套 CSS 变量，避免「屏上好看、打出走样」。

**oh-my-cv 使用**：UnoCSS + `@ohmycv/dynamic-css` 动态注入工具栏与 CSS 编辑器样式。

---

### 7. PDF 导出

**方案**：浏览器原生打印（与 oh-my-cv 一致）

```text
用户点击「导出 PDF」
  → 打开仅含简历内容的打印视图（或隐藏 UI）
  → window.print()
  → 用户选择「另存为 PDF」
```

**注意**：

- 推荐 Chromium 内核浏览器
- 打印前同步纸张尺寸与边距到 `@page`
- 二期再做分页（`break-inside: avoid`、`\newpage` 对应 `page-break-before`）

**未采用（首期）**：Puppeteer 服务端渲染——需后端，与「本地优先」目标不符。

---

### 8. 路由

建议使用 **React Router v6**：

| 路径 | 页面 |
|------|------|
| `/` | 落地页 |
| `/resumes` | 简历列表 |
| `/editor/:id` | 编辑器 |

**oh-my-cv 使用**：Nuxt 文件路由（`pages/editor/[id].vue`）

---

### 9. 工具链

| 工具 | 用途 |
|------|------|
| pnpm | 包管理（与 oh-my-cv 一致） |
| ESLint + Prettier | 代码规范 |
| Vitest | 单元测试（渲染、存储） |
| Playwright（可选） | E2E：创建简历 → 编辑 → 导出 |

---

## 第二阶段依赖预览

| 能力 | 推荐库 |
|------|--------|
| 图标 | `@iconify/react` |
| 公式 | `remark-math` + `rehype-katex` 或 `markdown-it` + `@ohmycv/markdown-it-katex` 思路自研 |
| 字体 | Google Fonts API + 动态 `<link>` |
| 离线 | `vite-plugin-pwa` |
| 国际化 | `react-i18next` |

---

## 关键技术决策记录

| 决策 | 选择 | 备选 | 原因 |
|------|------|------|------|
| 编辑器 | CodeMirror 6 | Monaco | 更轻、够用；可随时替换 |
| 预览 MVP | react-markdown | 直接用 markdown-it | React 生态顺手 |
| 预览进阶 | markdown-it | 纯 remark 插件 | 与 oh-my-cv 语法对齐成本更低 |
| 后端 | 无 | Supabase 同步 | 首期本地优先 |
| PDF | 浏览器打印 | html2pdf.js | 分页质量打印更稳 |

---

## 参考：oh-my-cv 实际依赖（摘录）

来源：`oh-my-cv/site/package.json`

- `monaco-editor` — 编辑区
- `markdown-it` + 多个 `@ohmycv/markdown-it-*` — 渲染
- `localforage` — 持久化
- `nuxt`、`pinia`、`@vueuse/core` — 框架与工具
- `katex` — 数学公式
- `@vite-pwa/nuxt` — PWA

完整列表以原仓库为准。
