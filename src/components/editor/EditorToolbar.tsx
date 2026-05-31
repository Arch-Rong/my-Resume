import {
	Download,
	FileInput,
	FilePlus,
	FileText,
	Palette,
	Printer,
	Save,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { PaperSize, Resume } from "#/lib/resume-storage";

const THEME_PRESETS = [
	{ name: "Black", value: "#1f2328" },
	{ name: "Blue", value: "#377bb5" },
	{ name: "Orange", value: "#e8811a" },
	{ name: "Red", value: "#cf222e" },
	{ name: "Green", value: "#1a7f37" },
];

interface EditorToolbarProps {
	resume: Resume;
	onSave: () => void;
	onRename: () => void;
	onNewResume: () => void;
	onPaperSize: (size: PaperSize) => void;
	onThemeColor: (color: string) => void;
	onExportMarkdown: () => void;
	onImportMarkdown: () => void;
	onExportPdf: () => void;
}

function ToolbarSection({
	icon: Icon,
	title,
	children,
}: {
	icon: ComponentType<{ size?: number; strokeWidth?: number }>;
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="border-b border-border px-3 py-3">
			<div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-fg-muted">
				<Icon size={14} strokeWidth={1.75} />
				{title}
			</div>
			<div className="space-y-1">{children}</div>
		</section>
	);
}

function ToolbarButton({
	children,
	onClick,
	shortcut,
}: {
	children: ReactNode;
	onClick: () => void;
	shortcut?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-fg transition hover:bg-[var(--card-hover)]"
		>
			<span>{children}</span>
			{shortcut ? (
				<kbd className="text-[10px] text-fg-muted">{shortcut}</kbd>
			) : null}
		</button>
	);
}

export function EditorToolbar({
	resume,
	onSave,
	onRename,
	onNewResume,
	onPaperSize,
	onThemeColor,
	onExportMarkdown,
	onImportMarkdown,
	onExportPdf,
}: EditorToolbarProps) {
	return (
		<aside className="flex h-full w-52 shrink-0 flex-col overflow-y-auto border-l border-border bg-editor xl:w-56">
			<ToolbarSection icon={Save} title="File">
				<ToolbarButton onClick={onSave} shortcut="⌘ S">
					Save
				</ToolbarButton>
				<ToolbarButton onClick={onRename} shortcut="↵">
					Rename
				</ToolbarButton>
				<ToolbarButton onClick={onNewResume}>
					<span className="flex items-center gap-1.5">
						<FilePlus size={14} />
						New Resume
					</span>
				</ToolbarButton>
				<ToolbarButton onClick={onExportPdf}>
					<span className="flex items-center gap-1.5">
						<Printer size={14} />
						Export PDF
					</span>
				</ToolbarButton>
				<ToolbarButton onClick={onExportMarkdown}>
					<span className="flex items-center gap-1.5">
						<Download size={14} />
						Export Markdown
					</span>
				</ToolbarButton>
				<ToolbarButton onClick={onImportMarkdown}>
					<span className="flex items-center gap-1.5">
						<FileInput size={14} />
						Import Markdown
					</span>
				</ToolbarButton>
			</ToolbarSection>

			<ToolbarSection icon={FileText} title="Paper Size">
				<select
					value={resume.settings.paperSize}
					onChange={(e) => onPaperSize(e.target.value as PaperSize)}
					className="w-full rounded-md border border-border bg-muted px-2 py-1.5 text-sm text-fg outline-none focus:border-accent"
				>
					<option value="a4">A4</option>
					<option value="letter">US Letter</option>
				</select>
			</ToolbarSection>

			<ToolbarSection icon={Palette} title="Theme Color">
				<div className="mb-2 flex flex-wrap gap-1.5">
					{THEME_PRESETS.map((preset) => (
						<button
							key={preset.value}
							type="button"
							title={preset.name}
							onClick={() => onThemeColor(preset.value)}
							className="h-5 w-5 rounded-full border-2 border-border transition hover:scale-110"
							style={{
								backgroundColor: preset.value,
								borderColor:
									resume.settings.themeColor === preset.value
										? "var(--accent)"
										: undefined,
							}}
						/>
					))}
				</div>
				<input
					type="color"
					value={resume.settings.themeColor}
					onChange={(e) => onThemeColor(e.target.value)}
					className="h-8 w-full cursor-pointer rounded border border-border bg-transparent"
				/>
			</ToolbarSection>
		</aside>
	);
}
