import type { CSSProperties, ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { remarkAdmonition } from "#/lib/remark-admonition";
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

const CODE_BLOCK_STYLE: CSSProperties = {
	margin: 0,
	padding: "0.75rem",
	background: "transparent",
	fontSize: "0.75rem",
	lineHeight: "1.625",
};

const ADMONITION_CLASS: Record<"info" | "warning" | "danger", string> = {
	info: "border-info/30 bg-info/10",
	warning: "border-accent/40 bg-accent/10",
	danger: "border-red-500/40 bg-red-500/10",
};

function Admonition({
	variant,
	children,
}: {
	variant: "info" | "warning" | "danger";
	children: ReactNode;
}) {
	return (
		<div
			className={`mb-3 rounded-md border px-4 py-3 text-sm leading-relaxed text-preview-fg/90 ${ADMONITION_CLASS[variant]} [&>p]:mb-1 [&>p:last-child]:mb-0`}
		>
			{children}
		</div>
	);
}

const previewComponents = {
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
	blockquote: ({ children }) => (
		<blockquote className="mb-3 border-l-4 border-preview-fg/25 py-0.5 pl-4 text-sm italic leading-relaxed text-preview-fg/70 [&>p]:mb-1 [&>p]:whitespace-pre-line [&>p:last-child]:mb-0">
			{children}
		</blockquote>
	),
	ul: ({ children }) => (
		<ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-preview-fg/90">
			{children}
		</ul>
	),
	ol: ({ children }) => (
		<ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-preview-fg/90">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="leading-relaxed">{children}</li>,
	strong: ({ children }) => (
		<strong className="font-semibold text-preview-fg">{children}</strong>
	),
	em: ({ children }) => <em className="text-preview-fg/70">{children}</em>,
	del: ({ children }) => <del className="text-preview-fg/50">{children}</del>,
	a: ({ href, children }) => (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="text-info underline decoration-info/40 underline-offset-2 hover:decoration-info"
		>
			{children}
		</a>
	),
	input: ({ checked, ...props }) => (
		<input
			type="checkbox"
			checked={Boolean(checked)}
			readOnly
			className="mr-2 accent-[var(--resume-primary)]"
			{...props}
		/>
	),
	table: ({ children }) => (
		<div className="mb-3 overflow-x-auto">
			<table className="w-full border-collapse text-sm text-preview-fg/90 ">
				{children}
			</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="border-b border-preview-fg/15 bg-preview-fg/5">
			{children}
		</thead>
	),
	tbody: ({ children }) => <tbody>{children}</tbody>,
	tr: ({ children }) => (
		<tr className="border-t border-preview-fg/10 first:border-t-0">
			{children}
		</tr>
	),
	th: ({ children }) => (
		<th className="px-3 py-2 text-left font-semibold text-preview-fg">
			{children}
		</th>
	),
	td: ({ children }) => <td className="px-3 py-2">{children}</td>,
	pre: ({ children }) => (
		<div className="mb-3 overflow-x-auto rounded-md border border-preview-fg/10 bg-preview-fg/5">
			{children}
		</div>
	),
	code: ({ className, children }) => {
		const text = String(children).replace(/\n$/, "");
		const match = /language-(\w+)/.exec(className ?? "");

		if (match) {
			return (
				<SyntaxHighlighter
					language={match[1]}
					style={oneDark}
					PreTag="div"
					customStyle={CODE_BLOCK_STYLE}
					wrapLongLines
				>
					{text}
				</SyntaxHighlighter>
			);
		}

		if (text.includes("\n")) {
			return (
				<code className="block p-3 font-mono text-xs leading-relaxed text-preview-fg/90 whitespace-pre-wrap">
					{text}
				</code>
			);
		}

		return (
			<code className="rounded bg-preview-fg/10 px-1.5 py-0.5 font-mono text-[0.85em] text-preview-fg">
				{children}
			</code>
		);
	},
	info: ({ children }) => <Admonition variant="info">{children}</Admonition>,
	warning: ({ children }) => (
		<Admonition variant="warning">{children}</Admonition>
	),
	danger: ({ children }) => (
		<Admonition variant="danger">{children}</Admonition>
	),
} as Components;

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
					remarkPlugins={[remarkGfm, remarkDirective, remarkAdmonition]}
					components={previewComponents}
				>
					{body}
				</ReactMarkdown>
			</div>
		</div>
	);
}
