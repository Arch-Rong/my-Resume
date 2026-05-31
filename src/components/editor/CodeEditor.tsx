interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
	return (
		<textarea
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			spellCheck={false}
			className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-fg outline-none placeholder:text-fg-muted/50"
		/>
	);
}
