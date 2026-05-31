# Cursor 项目配置

本目录为 **My Resume** 的 AI 开发规则，基于社区模板 [awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc) 裁剪并加上本项目约定。

## 文件说明

| 文件 | 作用 |
|------|------|
| `rules/001-project.mdc` | 始终生效：项目背景、栈、原则 |
| `rules/010-react-tsx.mdc` | 编辑 `*.tsx` 时：React 组件规范 |
| `rules/015-typescript.mdc` | 编辑 `*.ts` 时：TypeScript 规范 |
| `rules/020-tanstack-router.mdc` | 编辑 `src/routes/**` 时：路由约定 |
| `rules/030-styling.mdc` | 样式与 Tailwind / CSS 变量 |
| 根目录 `AGENTS.md` | Agent 模式总览（Cursor 也会读取） |

## 在 Cursor 里确认已生效

1. 打开 **Cursor Settings → Rules**
2. 应看到 Project Rules 下列出上述 `.mdc` 文件
3. 聊天时用 **Agent** 模式（`.mdc` 在 Agent 下比旧版 `.cursorrules` 更可靠）

## 追加社区模板（可选）

**Settings → Rules → Add Rule → Remote Rule (GitHub)**，可粘贴例如：

```text
https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/rules-mdc/react.mdc
https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/rules-mdc/typescript.mdc
```

注意：远程规则较泛，可能与 Biome tab / TanStack Start 冲突，建议以本仓库 `rules/` 为主。

## 推荐 Cursor 设置（用户级）

在 Cursor Settings 中建议：

- **Chat → Default Mode**：Agent
- **Features → Cursor Tab**：开启（行内补全）
- **Models**：按订阅选择默认模型

项目级格式化已在 `.vscode/settings.json`（Biome + formatOnSave）。

## 手动引用规则

在对话里输入 `@` → 选择某个 rule 文件，可临时强调该规范。
