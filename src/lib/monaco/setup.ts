import type * as Monaco from "monaco-editor";

declare global {
	interface Window {
		monaco?: typeof Monaco;
	}
}

const DARK_THEME = "my-resume-dark";

let setupPromise: Promise<typeof Monaco> | null = null;

function getResolvedTheme(): "light" | "dark" {
	if (typeof document === "undefined") {
		return "dark";
	}
	return document.documentElement.classList.contains("light")
		? "light"
		: "dark";
}

export function applyMonacoTheme(monaco: typeof Monaco) {
	monaco.editor.setTheme(getResolvedTheme() === "dark" ? DARK_THEME : "vs");
}

function defineThemes(monaco: typeof Monaco) {
	monaco.editor.defineTheme(DARK_THEME, {
		base: "vs-dark",
		inherit: true,
		rules: [],
		colors: {
			"editor.background": "#22262c",
			"editor.lineHighlightBorder": "#4b5563",
		},
	});
	applyMonacoTheme(monaco);
}

/** 监听 html.light / .dark 切换，同步 Monaco 主题 */
export function watchMonacoTheme(monaco: typeof Monaco): () => void {
	const observer = new MutationObserver(() => applyMonacoTheme(monaco));
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class", "data-theme"],
	});
	return () => observer.disconnect();
}

/**
 * 动态加载 Monaco 并配置 Worker（仅浏览器端）
 *
 * 为什么需要这个函数？
 * - Monaco 依赖 Web Worker 做语法分析，Vite 里要手动告诉它 Worker 文件在哪
 * - TanStack Start 有 SSR，不能在服务端 import monaco，必须等浏览器再加载
 * - 全局只初始化一次，多处调用（CodeEditor、主题）共享同一份 monaco 实例
 *
 * @see https://github.com/microsoft/monaco-editor#using-with-vite
 */
export async function setupMonaco(): Promise<typeof Monaco> {
	// SSR / 预渲染环境没有 window，Monaco 无法运行，直接抛错
	if (typeof window === "undefined") {
		throw new Error("Monaco can only run in the browser");
	}

	// 已经初始化过：挂到 window.monaco 上，直接复用（避免重复加载几 MB 的包）
	if (window.monaco) {
		return window.monaco;
	}

	// 正在初始化中：多个组件同时 await setupMonaco() 时，共用同一个 Promise
	// 防止并发触发两次 import 和 Worker 配置
	if (setupPromise) {
		return setupPromise;
	}

	// 首次初始化：把异步流程存到 setupPromise，后续调用都等它完成
	setupPromise = (async () => {
		// 动态 import：代码拆成独立 chunk，只有打开编辑器页才下载
		const monaco = await import("monaco-editor");
		// 缓存到 window，刷新页面前都可复用
		window.monaco = monaco;

		// 并行加载两个 Web Worker 模块（Vite 的 ?worker 会把它们打成 Worker 脚本）
		// EditorWorker：编辑器基础能力（缩进、括号匹配等）
		// CssWorker：CSS 语言的语法高亮 / 校验
		const [{ default: EditorWorker }, { default: CssWorker }] =
			await Promise.all([
				import("monaco-editor/esm/vs/editor/editor.worker?worker"),
				import("monaco-editor/esm/vs/language/css/css.worker?worker"),
			]);

		// 告诉 Monaco：需要 Worker 时，用上面加载的类来 new 一个 Worker 实例
		// Monaco 内部按 label 区分要哪种 Worker
		globalThis.MonacoEnvironment = {
			getWorker(_moduleId: string, label: string) {
				switch (label) {
					case "editorWorkerService":
						// 通用编辑器 Worker（Markdown 也走这个）
						return new EditorWorker();
					case "css":
						// CSS Tab 专用 Worker
						return new CssWorker();
					default:
						// 未配置的语言 Worker 会走到这里
						throw new Error(`Unknown worker label: ${label}`);
				}
			},
		};

		// 注册暗色主题 my-resume-dark，并按当前 html.light/.dark 应用主题
		defineThemes(monaco);
		// 返回 monaco 命名空间，供 createEditor、createModel 等使用
		return monaco;
	})();

	// 返回 Promise<monaco>，调用方 await setupMonaco() 拿到就绪的实例
	return setupPromise;
}

export function createEditor(monaco: typeof Monaco, container: HTMLElement) {
	return monaco.editor.create(container, {
		automaticLayout: true,
		wordWrap: "on",
		fontSize: 13,
		lineHeight: 20,
		fontFamily: 'Menlo, Monaco, "Courier New", monospace',
		minimap: { enabled: true },
		scrollBeyondLastLine: false,
		padding: { top: 12, bottom: 12 },
	});
}
