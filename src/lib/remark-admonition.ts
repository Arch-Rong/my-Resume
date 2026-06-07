import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const ADMONITION_TYPES = new Set(["info", "warning", "danger"]);

/** 将 :::info / :::warning / :::danger 容器指令映射为自定义 hast 标签 */
export const remarkAdmonition: Plugin<[], Root> = () => (tree) => {
	visit(tree, (node) => {
		if (node.type !== "containerDirective") {
			return;
		}
		if (!ADMONITION_TYPES.has(node.name)) {
			return;
		}
		if (!node.data) {
			node.data = {};
		}
		node.data.hName = node.name;
	});
};
