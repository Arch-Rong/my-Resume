import type * as Monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import {
	applyMonacoTheme,
	createEditor,
	setupMonaco,
	watchMonacoTheme,
} from "#/lib/monaco/setup";

/** 编辑器支持的语言：Markdown 正文 或 自定义 CSS */
export type EditorLanguage = "markdown" | "css";

interface CodeEditorProps {
	/** 当前 Tab：markdown | css */
	language: EditorLanguage;
	/** 当前语言对应的文本内容（受控组件） */
	value: string;
	/** 内容变化时回调，通知父组件更新 resume */
	onChange: (value: string) => void;
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
	// DOM 容器：Monaco 会在这个 div 里挂载编辑器 UI
	const containerRef = useRef<HTMLDivElement>(null);
	// Monaco 编辑器实例（全局只创建一次，切换 Tab 时换 Model 不换 Editor）
	const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
	// 两种语言各一份文档 Model，切换 Tab 时在它们之间切换
	const modelsRef = useRef<
		Partial<Record<EditorLanguage, Monaco.editor.ITextModel>>
	>({});
	// 用 ref 存最新 onChange，避免 effect 闭包拿到旧函数
	const onChangeRef = useRef(onChange);
	// 用 ref 存最新 language，初始化异步完成时能读到当前 Tab
	const languageRef = useRef(language);
	// 标记「正在程序写入内容」，此时不要触发 onChange（避免循环更新）
	const syncingRef = useRef(false);

	// 每次 render 同步最新 props 到 ref
	onChangeRef.current = onChange;
	languageRef.current = language;

	/**
	 * Effect 1：挂载时初始化 Monaco（只跑一次）
	 * - 动态 import monaco-editor（避免 SSR 报错）
	 * - 创建 Editor 实例
	 * - 绑定第一个 Model
	 * - 监听输入变化 → onChange
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: 故意 []，防止重复创建 editor
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		let disposed = false; // 组件已卸载则不再继续异步初始化
		let unwatchTheme: (() => void) | undefined; // 取消监听 html 主题 class
		let contentDisposable: Monaco.IDisposable | undefined; // 取消监听编辑器输入

		void (async () => {
			const monaco = await setupMonaco(); // 加载 Monaco + Worker + 主题
			if (disposed) {
				return;
			}

			unwatchTheme = watchMonacoTheme(monaco); // 明暗模式切换时同步 Monaco 主题

			const editor = createEditor(monaco, container); // 在容器里创建编辑器
			editorRef.current = editor;

			/** 获取或创建指定语言的 Model，并保证内容与 text 一致 */
			const attachModel = (lang: EditorLanguage, text: string) => {
				let model = modelsRef.current[lang];
				if (!model) {
					// 第一次：新建 Model（语言决定语法高亮）
					model = monaco.editor.createModel(text, lang);
					modelsRef.current[lang] = model;
				} else if (model.getValue() !== text) {
					// 已有 Model 但内容不同：覆盖文本
					model.setValue(text);
				}
				return model;
			};

			const model = attachModel(languageRef.current, value);
			editor.setModel(model); // 把 Model 挂到编辑器上

			// 用户打字 → 通知父组件
			contentDisposable = editor.onDidChangeModelContent(() => {
				if (syncingRef.current) {
					return; // 程序 setValue 时不回传
				}
				const current = editor.getModel();
				if (!current) {
					return;
				}
				onChangeRef.current(current.getValue());
			});
		})();

		// 卸载：释放 Monaco 资源，防止内存泄漏
		return () => {
			disposed = true;
			contentDisposable?.dispose();
			unwatchTheme?.();
			editorRef.current?.dispose();
			editorRef.current = null;
			for (const model of Object.values(modelsRef.current)) {
				model?.dispose();
			}
			modelsRef.current = {};
		};
	}, []);

	/**
	 * Effect 2：切换 Markdown / CSS Tab
	 * language 或 value 变时，切换到对应 Model（不销毁 Editor）
	 */
	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) {
			return; // 初始化还没完成
		}

		void setupMonaco().then((monaco) => {
			let model = modelsRef.current[language];
			if (!model) {
				// 首次切到该 Tab：懒创建 Model
				model = monaco.editor.createModel(value, language);
				modelsRef.current[language] = model;
			} else if (model.getValue() !== value) {
				// 父组件 state 与 Model 不一致：同步（如切换 Tab 后）
				syncingRef.current = true;
				model.setValue(value);
				syncingRef.current = false;
			}
			if (editor.getModel() !== model) {
				editor.setModel(model); // 切换显示的文档
			}
		});
	}, [language, value]);

	/**
	 * Effect 3：外部写入（导入 Markdown、从存储恢复等）
	 * 仅当父组件 value 与当前 Model 不同时才 setValue
	 */
	useEffect(() => {
		const editor = editorRef.current;
		const model = editor?.getModel();
		if (!editor || !model || model.getValue() === value) {
			return;
		}
		syncingRef.current = true;
		const position = editor.getPosition(); // 尽量保留光标位置
		model.setValue(value);
		if (position) {
			editor.setPosition(position);
		}
		syncingRef.current = false;
	}, [value]);

	/**
	 * Effect 4：组件挂载后应用一次 Monaco 主题
	 * （持续监听由 watchMonacoTheme 在 Effect 1 里处理）
	 */
	useEffect(() => {
		void setupMonaco().then(applyMonacoTheme);
	}, []);

	// 空 div 作为 Monaco 挂载点；h-full 占满左侧编辑区高度
	return (
		<div
			ref={containerRef}
			className="h-full min-h-[200px] w-full overflow-hidden bg-editor"
		/>
	);
}
