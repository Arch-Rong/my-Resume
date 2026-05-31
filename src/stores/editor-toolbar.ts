import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorToolbarState {
	open: boolean;
	toggle: () => void;
	setOpen: (open: boolean) => void;
}

/**
 * 编辑器右侧工具栏展开/折叠状态
 * persist 中间件自动写入 localStorage（key: my-resume:toolbar）
 */
export const useEditorToolbarStore = create<EditorToolbarState>()(
	persist(
		(set) => ({
			open: true,
			toggle: () => set((state) => ({ open: !state.open })),
			setOpen: (open) => set({ open }),
		}),
		{
			name: "my-resume:toolbar",
			// 只持久化 open，不存函数
			partialize: (state) => ({ open: state.open }),
		},
	),
);

/** 与旧 Context API 兼容的 hook */
export function useEditorToolbar() {
	const open = useEditorToolbarStore((s) => s.open);
	const toggle = useEditorToolbarStore((s) => s.toggle);
	const setOpen = useEditorToolbarStore((s) => s.setOpen);
	return { open, toggle, setOpen };
}
