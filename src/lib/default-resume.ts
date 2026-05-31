export const DEFAULT_MARKDOWN = `---
name: NAME
header:
  - text: (+86) 131-2345-6789
  - text: youremail@email.com
  - text: github.com/yourname
  - text: yourwebsite.com
---

## 技术栈

- **语言**：TypeScript、JavaScript、Python
- **前端**：React、Vue、Tailwind CSS
- **工具**：Git、Vite、Node.js

## 工作经历

### 公司名称 · 职位

*2024.01 - 至今*

- 负责核心业务模块开发与性能优化
- 推动组件库与工程化规范落地

## 项目介绍

### 项目名称

- 项目简介与你在其中的职责
- 关键技术点与可量化成果
`;

export const DEFAULT_CSS = `/* 自定义简历样式 */
`;

export const DEFAULT_SETTINGS = {
	paperSize: "a4" as const,
	themeColor: "#377bb5",
};
