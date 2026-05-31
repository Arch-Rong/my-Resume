import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PaperSize } from "#/lib/resume-storage";

interface PreviewPaneProps {
	markdown: string;
	css: string;
	themeColor: string;
	paperSize: PaperSize;
}

const PAPER_CLASS: Record<PaperSize, string> = {
	a4: "w-full max-w-[210mm]",
	letter: "w-full max-w-[216mm]",
};

export function PreviewPane({
	markdown,
	css,
	themeColor,
	paperSize,
}: PreviewPaneProps) {
	const body = markdown.replace(/^---[\s\S]*?---\n?/, "");

	return (
		<div className="h-full w-full overflow-auto rounded-lg bg-editor p-4 sm:p-6">
			<div
				className={`resume-preview mx-auto min-h-[297mm] rounded-sm bg-editor px-8 py-10 text-preview-fg  ${PAPER_CLASS[paperSize]}`}
				style={
					{
						"--resume-primary": themeColor,
					} as CSSProperties
				}
			>
				{css ? <style>{css}</style> : null}
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						h2: ({ children }) => (
							<h2 className="mb-3 mt-6 border-b border-preview-fg/15 pb-1 text-base font-bold text-[var(--resume-primary)]">
								{children}
							</h2>
						),
						h3: ({ children }) => (
							<h3 className="mb-1 mt-4 text-sm font-semibold text-preview-fg">
								{children}
							</h3>
						),
						p: ({ children }) => (
							<p className="mb-2 text-sm leading-relaxed text-preview-fg/90">
								{children}
							</p>
						),
						ul: ({ children }) => (
							<ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-preview-fg/90">
								{children}
							</ul>
						),
						li: ({ children }) => (
							<li className="leading-relaxed">{children}</li>
						),
						strong: ({ children }) => (
							<strong className="font-semibold text-preview-fg">
								{children}
							</strong>
						),
						em: ({ children }) => (
							<em className="text-preview-fg/70">{children}</em>
						),
					}}
				>
					{body}
				</ReactMarkdown>
			</div>
		</div>
	);
}
