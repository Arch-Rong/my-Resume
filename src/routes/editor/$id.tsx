import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeEditor } from "#/components/editor/CodeEditor";
import { EditorToolbar } from "#/components/editor/EditorToolbar";
import { PreviewPane } from "#/components/editor/PreviewPane";
import {
	createResume,
	getResume,
	type Resume,
	saveResume,
} from "#/lib/resume-storage";
import { useEditorToolbar } from "#/stores/editor-toolbar";

export const Route = createFileRoute("/editor/$id")({
	component: EditorPage,
});

type EditorTab = "markdown" | "css";

function EditorPage() {
	const { id } = useParams({ from: "/editor/$id" });
	const navigate = useNavigate();
	const { open: toolbarOpen } = useEditorToolbar();
	const [resume, setResume] = useState<Resume | null>(null);
	const [tab, setTab] = useState<EditorTab>("markdown");
	const [savedHint, setSavedHint] = useState(false);
	const resumeRef = useRef<Resume | null>(null);
	const hintTimerRef = useRef<number | null>(null);

	useEffect(() => {
		const doc = getResume(id);
		if (!doc) {
			navigate({ to: "/resumes" });
			return;
		}
		setResume(doc);
		resumeRef.current = doc;
	}, [id, navigate]);

	const persist = useCallback((next: Resume) => {
		saveResume(next);
		resumeRef.current = next;
		setSavedHint(true);
		if (hintTimerRef.current) {
			window.clearTimeout(hintTimerRef.current);
		}
		hintTimerRef.current = window.setTimeout(() => setSavedHint(false), 2000);
	}, []);

	useEffect(() => {
		if (!resume) {
			return;
		}
		const timer = window.setTimeout(() => {
			if (resumeRef.current) {
				saveResume(resumeRef.current);
			}
		}, 600);
		return () => window.clearTimeout(timer);
	}, [resume]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				if (resumeRef.current) {
					persist(resumeRef.current);
				}
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [persist]);

	const patch = (partial: Partial<Resume>) => {
		setResume((prev) => {
			if (!prev) {
				return prev;
			}
			const next = { ...prev, ...partial };
			resumeRef.current = next;
			return next;
		});
	};

	const patchSettings = (settings: Partial<Resume["settings"]>) => {
		setResume((prev) => {
			if (!prev) {
				return prev;
			}
			const next = {
				...prev,
				settings: { ...prev.settings, ...settings },
			};
			resumeRef.current = next;
			return next;
		});
	};

	if (!resume) {
		return (
			<div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-fg-muted">
				加载中…
			</div>
		);
	}

	const handleRename = () => {
		const title = window.prompt("简历标题", resume.title);
		if (title?.trim()) {
			patch({ title: title.trim() });
		}
	};

	const handleNewResume = () => {
		const created = createResume();
		navigate({ to: "/editor/$id", params: { id: created.id } });
	};

	const handleExportMarkdown = () => {
		const blob = new Blob([resume.markdown], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${resume.title}.md`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImportMarkdown = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".md,text/markdown";
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) {
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				patch({ markdown: String(reader.result) });
			};
			reader.readAsText(file);
		};
		input.click();
	};

	const handleExportPdf = () => {
		window.print();
	};

	return (
		<div className="flex h-[calc(100vh-3.5rem)] flex-col">
			{savedHint ? (
				<div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-lg bg-elevated px-3 py-2 text-sm text-fg shadow-lg ring-1 ring-border">
					已保存
				</div>
			) : null}

			<div className="flex min-h-0 flex-1 gap-2 p-2">
				{/* 左侧编辑 */}
				<div className="flex min-w-0 flex-1 flex-col border-r rounded-lg border-border bg-editor">
					<div className="flex shrink-0 border-b border-border">
						{(["markdown", "css"] as const).map((key) => (
							<button
								key={key}
								type="button"
								onClick={() => setTab(key)}
								className={`px-4 py-2.5 text-sm font-medium capitalize transition ${
									tab === key
										? "border-b-2 border-accent text-fg"
										: "text-fg-muted hover:text-fg"
								}`}
							>
								{key === "markdown" ? "Markdown" : "CSS"}
							</button>
						))}
					</div>
					<div className="min-h-0 flex-1">
						<CodeEditor
							language={tab}
							value={tab === "markdown" ? resume.markdown : resume.css}
							onChange={(text) =>
								tab === "markdown"
									? patch({ markdown: text })
									: patch({ css: text })
							}
						/>
					</div>
				</div>

				{/* 中间预览 */}
				<div className="hidden min-w-0 flex-1 md:flex rounded-lg bg-pink-200">
					<PreviewPane
						markdown={resume.markdown}
						css={resume.css}
						themeColor={resume.settings.themeColor}
						paperSize={resume.settings.paperSize}
					/>
				</div>

				{/* 右侧工具栏（可折叠） */}
				<aside
					className={`shrink-0 overflow-hidden transition-[width,opacity] duration-200 ease-out ${
						toolbarOpen ? "w-52 opacity-100 xl:w-56" : "w-0 opacity-0"
					}`}
				>
					{toolbarOpen ? (
						<EditorToolbar
							resume={resume}
							onSave={() => persist(resume)}
							onRename={handleRename}
							onNewResume={handleNewResume}
							onPaperSize={(paperSize) => patchSettings({ paperSize })}
							onThemeColor={(themeColor) => patchSettings({ themeColor })}
							onExportMarkdown={handleExportMarkdown}
							onImportMarkdown={handleImportMarkdown}
							onExportPdf={handleExportPdf}
						/>
					) : null}
				</aside>
			</div>
		</div>
	);
}
