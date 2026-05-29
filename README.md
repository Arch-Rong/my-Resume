# My Resume

仿写 [Oh My CV](https://ohmycv.app/) 的本地优先 Markdown 简历编辑器。

参考项目：[Renovamen/oh-my-cv](https://github.com/Renovamen/oh-my-cv)（Vue 3 + Nuxt + Monaco + markdown-it）

---

## 项目目标

- 在浏览器中用 **Markdown** 编写简历，实时预览排版效果
- 数据 **仅存本地**，无需注册登录
- 支持多份简历管理、主题定制与 **PDF 导出**
- 推荐在 **Chromium 内核浏览器**（Chrome / Edge）中使用，以保证打印与分页效果

---

## 功能规划

### MVP（第一版必做）

| 功能 | 说明 |
|------|------|
| Markdown 编辑 | 左侧编辑区，语法高亮、行号、自动换行 |
| 实时预览 | 右侧根据 Markdown 即时渲染简历版面 |
| 多简历管理 | 列表页：新建、打开、重命名、删除 |
| 本地持久化 | 自动保存至 IndexedDB，刷新不丢失 |
| 导入 / 导出 | 支持 `.md` 文件导入与导出 |
| 基础排版设置 | 纸张尺寸（A4 / Letter）、主题色、页边距 |
| PDF 导出 | 基于打印样式（`@page` + `window.print()`） |
| 明暗主题 | 应用 UI 支持深色 / 浅色模式 |

### 第二阶段（对齐 oh-my-cv 体验）

| 功能 | 说明 |
|------|------|
| 自定义 CSS | 独立 CSS 编辑 Tab，覆盖简历样式 |
| 分页控制 | 自动分页、`\newpage`、行距与段间距调节 |
| Google Fonts | 在线选择字体并加载 |
| 图标 | 通过 Iconify 在 Markdown 中插入图标 |
| 数学公式 | KaTeX 渲染（学术简历） |
| Front Matter | YAML 头部元数据（姓名、联系方式等） |
| 大小写纠正 | 常见品牌名自动修正（如 GitHub） |
| 批量备份 | 导出全部简历为 JSON，支持从备份恢复 |
| PWA | 离线可用 |

### 暂不纳入首期

- 用户账号与云同步
- 协作编辑
- AI 润色 / 翻译
- 模板市场

---

## 技术栈

### 与 oh-my-cv 的对照

| 层级 | oh-my-cv | 本项目（拟定） |
|------|----------|----------------|
| 框架 | Nuxt 3 + Vue 3 | **React 18 + TypeScript** |
| 构建 | Vite（Nuxt） | **Vite** |
| 编辑区 | Monaco Editor | **CodeMirror 6**（`@uiw/react-codemirror`） |
| Markdown 渲染 | markdown-it + 自研插件 | **react-markdown** + **remark-gfm**（MVP）；复杂语法阶段可引入 **markdown-it** |
| 状态管理 | Pinia | **Zustand** |
| 样式 | UnoCSS | **Tailwind CSS** |
| 本地存储 | localForage | **IndexedDB**（`idb`）+ localStorage（仅存 UI 设置） |
| PDF | 浏览器打印 + 打印 CSS | 同左 |
| 包管理 | pnpm | **pnpm** |

> **说明**：oh-my-cv 使用 Monaco 是因为编辑体验接近 VS Code；本项目优先 **CodeMirror** 以减小体积、加快首屏。若后续需要 minimap 等 IDE 级体验，可将编辑区替换为 Monaco，预览与存储层无需改动。

### 核心依赖（规划）

```text
# 应用框架
react react-dom
typescript vite

# 编辑
@uiw/react-codemirror
@codemirror/lang-markdown
@codemirror/lang-css

# 预览
react-markdown remark-gfm

# 状态与工具
zustand
idb
clsx tailwind-merge

# 样式
tailwindcss

# 测试（可选）
vitest @testing-library/react
```

### 第二阶段可能引入

```text
markdown-it                    # 对齐 oh-my-cv 自定义语法时
@iconify/react                 # 图标
katex remark-math rehype-katex # 公式
vite-plugin-pwa                # 离线
```

---

## 架构概览

```text
┌─────────────────────────────────────────────────────────────┐
│                        React App (Vite)                      │
├──────────────┬──────────────────────┬────────────────────────┤
│  CodeMirror  │  react-markdown      │  设置面板               │
│  Markdown    │  → 预览 DOM          │  纸张 / 主题 / 边距     │
│  (+ CSS Tab) │  + Tailwind/打印 CSS │  导入导出 / 保存        │
├──────────────┴──────────────────────┴────────────────────────┤
│  Zustand（当前简历、列表、设置）                              │
├─────────────────────────────────────────────────────────────┤
│  IndexedDB（简历正文、元数据）│  localStorage（主题偏好）   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    window.print() → PDF
```

### 数据模型（草案）

```typescript
interface Resume {
  id: string;
  title: string;
  markdown: string;
  css: string;           // 自定义样式，二期
  settings: ResumeSettings;
  createdAt: number;
  updatedAt: number;
}

interface ResumeSettings {
  paperSize: "a4" | "letter";
  themeColor: string;
  margins: { top: number; right: number; bottom: number; left: number };
}
```

---

## 目录结构（规划）

```text
my-Resume/
├── README.md                 # 本文件
├── docs/
│   ├── FEATURES.md           # 功能清单与迭代阶段
│   └── TECH_STACK.md         # 技术选型说明
├── public/
├── src/
│   ├── components/
│   │   ├── editor/           # CodeMirror 编辑区
│   │   ├── preview/          # 简历预览
│   │   ├── dashboard/        # 简历列表
│   │   └── toolbar/          # 设置与导出
│   ├── stores/               # Zustand
│   ├── lib/
│   │   ├── markdown.ts       # 渲染封装
│   │   ├── storage.ts        # IndexedDB
│   │   └── print.ts          # PDF 导出
│   ├── pages/
│   └── App.tsx
├── package.json
└── vite.config.ts
```

---

## 开发阶段

| 阶段 | 周期（参考） | 交付物 |
|------|--------------|--------|
| 1 | 1～2 周 | 编辑 + 预览 + 路由骨架 |
| 2 | 1 周 | 多简历 CRUD + IndexedDB 自动保存 |
| 3 | 1 周 | 打印 CSS + PDF 导出 + 纸张/边距/主题色 |
| 4 | 1～2 周 | CSS Tab、字体、图标、公式等进阶能力 |

---

## 本地开发（待初始化后补充）

```bash
pnpm install
pnpm dev
```

---

## 参考链接

- 在线演示：[ohmycv.app](https://ohmycv.app/)
- 源码：[Renovamen/oh-my-cv](https://github.com/Renovamen/oh-my-cv)
- 原版数据存储：[localForage](https://localforage.github.io/localForage/)

---

## 许可证

待定（若参考 oh-my-cv 大量代码，需注意其 [GPL-3.0](https://github.com/Renovamen/oh-my-cv/blob/main/LICENSE) 协议要求）。
