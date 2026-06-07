import type { Paragraph, PhrasingContent, Root } from "mdast";
import type { Plugin } from "unified";

interface ResumeRowColumn {
	type: "resumeRowColumn";
	children: PhrasingContent[];
	data: {
		hName: "resume-row-col";
	};
}

interface ResumeRow {
	type: "resumeRow";
	children: ResumeRowColumn[];
	data: {
		hName: "resume-row";
	};
}

function phrasingPlainText(children: PhrasingContent[]): string {
	return children
		.map((child) => {
			if (child.type === "text") {
				return child.value;
			}
			if ("children" in child && Array.isArray(child.children)) {
				return phrasingPlainText(child.children as PhrasingContent[]);
			}
			return "";
		})
		.join("");
}

function startsWithTilde(node: Paragraph): boolean {
	return phrasingPlainText(node.children).trimStart().startsWith("~");
}

function stripTildePrefix(children: PhrasingContent[]): PhrasingContent[] {
	const next = structuredClone(children);
	const first = next[0];
	if (first?.type === "text") {
		first.value = first.value.replace(/^\s*~\s?/, "");
	}
	return next;
}

function textColumn(value: string): ResumeRowColumn {
	return {
		type: "resumeRowColumn",
		data: { hName: "resume-row-col" },
		children: [{ type: "text", value }],
	};
}

function phrasingColumn(children: PhrasingContent[]): ResumeRowColumn {
	return {
		type: "resumeRowColumn",
		data: { hName: "resume-row-col" },
		children,
	};
}

/** 在首个换行处拆分段落，保留首列的行内 Markdown（如 **加粗**） */
function splitAtFirstNewline(children: PhrasingContent[]): {
	first: PhrasingContent[];
	rest: string;
} {
	const first: PhrasingContent[] = [];
	let rest = "";
	let done = false;

	for (const child of children) {
		if (done) {
			rest += phrasingPlainText([child]);
			continue;
		}

		if (child.type === "text") {
			const newlineAt = child.value.indexOf("\n");
			if (newlineAt === -1) {
				first.push(child);
				continue;
			}

			const before = child.value.slice(0, newlineAt);
			if (before) {
				first.push({ type: "text", value: before });
			}
			rest = child.value.slice(newlineAt + 1);
			done = true;
			continue;
		}

		first.push(child);
	}

	return { first, rest };
}

function parseTildeLines(text: string): string[] | null {
	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line !== "");

	if (lines.length === 0) {
		return null;
	}
	if (!lines.every((line) => line.startsWith("~"))) {
		return null;
	}

	return lines.map((line) => line.replace(/^~\s?/, ""));
}

function toResumeRow(paragraphs: Paragraph[]): ResumeRow {
	return {
		type: "resumeRow",
		data: { hName: "resume-row" },
		children: paragraphs.map((paragraph, index) => ({
			type: "resumeRowColumn",
			data: { hName: "resume-row-col" },
			children:
				index === 0 ? paragraph.children : stripTildePrefix(paragraph.children),
		})),
	};
}

/** 同一段落内用换行分隔的多列：首行 + 若干以 ~ 开头的行 */
function parseInlineResumeRow(node: Paragraph): ResumeRow | null {
	const fullText = phrasingPlainText(node.children);
	const lines = fullText.split("\n");
	if (lines.length < 2) {
		return null;
	}
	if (!lines.slice(1).every((line) => line.trimStart().startsWith("~"))) {
		return null;
	}

	const { first, rest } = splitAtFirstNewline(node.children);
	const tildeColumns = parseTildeLines(rest);
	if (!tildeColumns) {
		return null;
	}

	return {
		type: "resumeRow",
		data: { hName: "resume-row" },
		children: [
			phrasingColumn(first),
			...tildeColumns.map((value) => textColumn(value)),
		],
	};
}

function transformBlocks(children: Root["children"]): Root["children"] {
	const result: Root["children"] = [];
	let index = 0;

	while (index < children.length) {
		const node = children[index];

		if (node.type === "paragraph") {
			const inlineRow = parseInlineResumeRow(node);
			if (inlineRow) {
				result.push(inlineRow);
				index += 1;
				continue;
			}
		}

		if (node.type === "paragraph" && !startsWithTilde(node)) {
			const group: Paragraph[] = [node];
			let nextIndex = index + 1;

			while (nextIndex < children.length) {
				const next = children[nextIndex];
				if (next.type !== "paragraph" || !startsWithTilde(next)) {
					break;
				}
				group.push(next);
				nextIndex += 1;
			}

			if (group.length > 1) {
				result.push(toResumeRow(group));
				index = nextIndex;
				continue;
			}
		}

		result.push(node);
		index += 1;
	}

	return result;
}

/** 将「首行 + 若干 ~ 行」合并为单行均匀分布的简历条目 */
export const remarkResumeRow: Plugin<[], Root> = () => (tree) => {
	tree.children = transformBlocks(tree.children);
};
