# My Resume — Agent 指南

本地优先的 Markdown 简历编辑器，对标 [oh-my-cv](https://github.com/Renovamen/oh-my-cv)。

## 技术栈

- React 19 + TypeScript + Vite + TanStack Start / Router
- Tailwind CSS 4（`src/styles.css`）
- Biome（format / lint，缩进 **tab**，双引号）
- pnpm

规划中的核心能力：CodeMirror 6、react-markdown、Zustand、IndexedDB、浏览器打印 PDF。

## 文档（改代码前先读）

| 文档 | 内容 |
|------|------|
| `docs/TECH_STACK.md` | 技术选型 |
| `docs/FEATURES.md` | 功能与迭代 |
| `docs/HOME.md` | 首页行为 |

## 目录约定

```text
src/routes/       TanStack 文件路由（勿手改 routeTree.gen.ts）
src/components/   UI 组件
src/lib/          工具（markdown、storage、print）
src/stores/       Zustand
```

路径别名：`#/*` 或 `@/*` → `./src/*`

## 编码原则

1. **最小改动**：只改与任务相关的文件
2. **匹配现有风格**：Biome、Tailwind、CSS 变量（`--sea-ink`、`--accent`）
3. **不引入后端**：MVP 数据存 IndexedDB / localStorage
4. **组件**：函数组件 + TypeScript；路由用 `createFileRoute`
5. **提交**：用户未要求时不 `git commit`

## 常用命令

```bash
pnpm dev          # 开发 http://localhost:3000
pnpm build        # 生产构建
pnpm check        # Biome 检查
pnpm exec biome check --write .   # 自动修复
```

## 与用户沟通

- 使用**中文**回复
- 说明简洁，避免过度 bold
