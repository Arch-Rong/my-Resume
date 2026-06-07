# My Resume — AGENTS.md

本文件为 Codex / AI coding agent 提供仓库级协作约定。Codex 会在开始工作前读取它，用来理解这个项目的目标、当前实现、约束边界、常用命令和交付标准。

## 这个文件的作用

- 说明项目是什么，以及当前已经实现到哪一步
- 告诉代理哪些文档需要先读，哪些文件是事实来源
- 约束实现方式，避免代理做出偏离产品方向的大改
- 统一验证和沟通方式，减少反复确认

## 项目定位

My Resume 是一个本地优先的 Markdown 简历编辑器，对标 [oh-my-cv](https://github.com/Renovamen/oh-my-cv)。

产品原则：

- 只在浏览器本地保存数据
- 不引入后端、账号系统、云同步
- 以 Markdown 编辑 + 实时预览 + PDF 导出为核心体验
- 以桌面端编辑体验为主，移动端以可访问和不破版为底线

## 当前实现，以代码为准

当前仓库的真实实现比部分规划文档更新，修改前请优先相信 `package.json` 和 `src/` 代码，而不是早期方案描述。

当前实际技术栈：

- React 19 + TypeScript
- Vite 8
- TanStack Start / TanStack Router 文件路由
- Tailwind CSS 4，主题变量集中在 `src/styles.css`
- Monaco Editor，封装在 `src/components/editor/CodeEditor.tsx`
- `react-markdown` + `remark-gfm` 负责预览渲染
- Zustand 管理编辑器工具栏 UI 状态
- `localStorage` 持久化简历数据，实现在 `src/lib/resume-storage.ts`
- `window.print()` 导出 PDF

当前主要页面：

- `/`：落地页
- `/resumes`：简历列表、JSON 备份导入导出
- `/editor/$id`：Markdown/CSS 编辑、预览、打印导出

## 现状与规划差异

以下差异非常重要，避免代理被旧文档误导：

- 文档里有 CodeMirror 6 方案，但当前代码使用的是 Monaco Editor
- 文档里有 IndexedDB 规划，但当前代码实际使用的是 `localStorage`
- 文档里部分目录规划仍提到 `pages/`，实际路由目录是 `src/routes/`
- 如果任务没有明确要求，不要擅自把 Monaco 迁到 CodeMirror，也不要把 `localStorage` 迁到 IndexedDB

如果你的改动改变了这些事实，请同步更新相关文档，至少包括 `README.md` 或 `docs/` 中对应内容。

## 修改前先读

基础文档：

- `docs/TECH_STACK.md`：技术选型与历史方案
- `docs/FEATURES.md`：功能范围与阶段目标
- `docs/HOME.md`：首页行为与文案方向
- `README.md`：项目背景与阶段说明

高优先级事实文件：

- `package.json`：依赖、脚本、当前框架
- `src/routes/`：页面结构
- `src/lib/resume-storage.ts`：当前存储模型与导入导出能力
- `src/components/editor/CodeEditor.tsx`：编辑器事实实现
- `src/components/editor/PreviewPane.tsx`：预览渲染能力
- `src/styles.css`：主题变量、打印样式、设计 token

## 目录约定

```text
src/routes/                TanStack 文件路由，勿手改 routeTree.gen.ts
src/components/            页面与 UI 组件
src/components/editor/     编辑器、预览、右侧工具栏
src/components/resumes/    简历列表卡片
src/lib/                   Monaco、默认简历、存储等工具
src/stores/                Zustand store
src/styles.css             全局主题变量与打印样式
```

路径别名：

- `#/*` → `./src/*`

## 编码原则

1. 最小改动，只改和任务直接相关的文件
2. 优先延续现有实现，不做“顺手重构”或大范围迁移
3. 组件使用函数组件 + TypeScript
4. 路由使用 `createFileRoute`，不要手改 `src/routeTree.gen.ts`
5. 浏览器 API 需要考虑 SSR / hydration，访问 `window`、`localStorage`、`document` 时保持保护逻辑
6. 保持本地优先，不引入服务端依赖、登录、远程存储或埋点
7. 未经明确要求，不新增重量级依赖，不替换核心基础设施
8. 如果文档和代码冲突，以当前代码行为为准，并在必要时回写文档
9. 用户未要求时不要 `git commit`

## UI 与样式约定

- 保持现有“oh-my-cv 风格”的深色优先视觉方向
- 优先复用 `src/styles.css` 中已有变量，如 `--bg-base`、`--bg-elevated`、`--accent`、`--preview-bg`
- 不要引入与现有主题系统平行的第二套颜色体系
- 编辑器页布局以桌面三栏体验为中心，移动端可以降级，但不要破坏主流程
- 打印相关改动必须留意 `@media print` 中的可见性规则

## 数据与存储约定

- 当前简历数据结构定义在 `src/lib/resume-storage.ts`
- 简历列表排序以 `updatedAt` 倒序为准
- 导入导出功能已存在，改数据结构时要考虑兼容旧数据
- 目前有一个旧列表键 `my-resume:list` 的迁移逻辑；修改存储时不要无意删掉已有用户数据

## 文案与语言

- 对用户的回复使用中文
- 代码注释尽量简洁，只解释不直观的逻辑
- UI 文案目前中英混合，除非任务要求统一文案，否则不要大范围重写

## 代码风格

- 使用 Biome 约束格式
- 缩进使用 tab
- JavaScript / TypeScript 字符串使用双引号
- 尽量保持现有命名风格和组件组织方式

## 验证要求

按改动范围选择最合适的验证方式：

- 仅文档改动：通常不需要构建，但要自检内容是否与当前代码一致
- 一般代码改动：运行 `pnpm check`
- 路由、构建、样式或导入路径改动：额外运行 `pnpm build`
- 若新增或修改测试：运行 `pnpm test`

如果因为环境或时间原因没有运行验证，需要在回复里明确说明。

## 常用命令

```bash
pnpm dev      # 本地开发，默认 http://localhost:3000
pnpm build    # 生产构建
pnpm preview  # 预览构建产物
pnpm test     # Vitest
pnpm lint     # Biome lint
pnpm check    # Biome check
pnpm format   # Biome format
```

## 代理在本仓库中的工作方式

- 先读文档，再看相关源码，最后动手
- 优先解决当前用户任务，不顺带扩展需求
- 遇到架构迁移级别的动作时先停下来确认
- 输出时给出结果、影响范围、是否验证过即可，避免冗长复盘
